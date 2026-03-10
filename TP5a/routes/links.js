import process from "node:process";
import Joi from "joi";
import Boom from "@hapi/boom";

export default {
  name: "links",
  version: process.env.npm_package_version,
  register: async function linksHandler(server, _options) {
    const { db } = server.app;
    const { prefix } = server.realm.modifiers.route;

    server.route({
      method: "GET",
      path: "/",
      handler: async (request, h) => {
        return await db.getAllLinksStats();
      },
    });

    server.route({
      method: "GET",
      path: "/{short}",
      handler: async (request, h) => {
        const { short } = request.params;
        const link = await server.app.db.getLinkByShort(short);
        if (link === undefined) {
          throw Boom.notFound(`Shortened link ${short} not found`);
        }
        // -- Correction TP5a, exo 2.1:
        server.app.db.updateVisit(short);
        // --
        server.log("debug", `Redirecting to ${link.long}`);
        return h.redirect(link.long);
      },
    });

    server.route({
      method: "GET",
      path: "/{short}/status",
      handler: async (request, h) => {
        const { short } = request.params;
        const link = await server.app.db.getLinkByShort(short);
        if (link === undefined) {
          throw Boom.notFound(`Shortened link ${short} not found`);
        }
        // Exo TP5a 3, on efface le champ secret_key de l'objet link
        // avant de le retourner au client
        delete link.secret_key;
        return { link };
      },
    });

    server.route({
      method: "DELETE",
      path: "/{short}",
      handler: async (request, h) => {
        // Correction TP5a exo 3
        // Supprime un lien
        const { short } = request.params;
        const { secret_key } = request.payload;
        server.log("info", short + " " + secret_key);

        const link = await server.app.db.getLinkByShort(short);
        if (link === undefined) {
          // 404
          throw Boom.notFound(`Shortened link ${short} not found`);
        }
        if (secret_key === undefined) {
          // 400
          throw Boom.badRequest("invalid query, missing key param");
        }
        if (link.secret_key != secret_key) {
          // 401
          throw Boom.unauthorized(`Invalid key`);
        }
        server.app.db.deleteLinkByShort(short);
        return { link }; // reponse 200 avec les détails
      },
      options: {
        validate: {
          payload: Joi.object({
            secret_key: Joi.string().length(12).example("y1otdDzBIVXR"),
          }),
        },
      },
    });

    server.route({
      method: "POST",
      path: "/",
      handler: async (request, h) => {
        // Code jusqu'à l'exo 3 inclus :
        // const { uri } = request.payload;
        // const link = await server.app.db.createLink(uri);
        // --
        // Modifié à l'exo 4 :
        const { uri, expires } = request.payload;
        server.log("info", "expires " + expires);
        let expiresFormatted;
        if (expires != undefined) {
          expiresFormatted = expires.toISOString().replace("T", " ").slice(0, -5);
        }
        const link = await db.createLink(uri, expiresFormatted);
        // --
        return h.response({ ...link, uri: `${server.info.uri}${prefix}/${link.short}` }).code(201);
      },
      options: {
        validate: {
          payload: Joi.object({
            uri: Joi.string().uri().example("http://perdu.com"),
            // Rajouté dans l'exo 4 :
            expires: Joi.date().optional().label("Expiration date"),
          }),
        },
      },
    });
  },
};
