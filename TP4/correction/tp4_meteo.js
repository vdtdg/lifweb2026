/****************************************************************/
/* Exo 1                                                        */
/****************************************************************/

/**
 * Récupère les données météorologiques pour une position latitude/longitude donnée.
 * L'API de la météo norvégienne est requêtée.
 *
 * @async
 * @function getMeteoLatLon
 * @param {number} lat - La latitude de la position.
 * @param {number} lon - La longitude de la position.
 * @returns {Promise<{temperature: number, meteoSymbol: string}>} Une promesse qui se résout en un objet contenant la température et le symbole météo.
 *
 * On s'occupera de la gestion des problèmes dans l'exo 5
 */
async function getMeteoLatLon(lat, lon) {
  const url = `https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=${lat}&lon=${lon}`;
  const response = await fetch(url);

  if (response.ok) {
    let data = await response.json();
    const temperature = data.properties.timeseries[0].data.instant.details.air_temperature;
    const meteoSymbol = data.properties.timeseries[0].data.next_1_hours.summary.symbol_code;
    return { temperature, meteoSymbol };
  } else {
    console.log(`erreur api meteo`);
  }
}

/** Appelle GetMeteoLatLon et modifie le DOM */
async function exo1MeteoOslo(lat, lon) {
  const res = await getMeteoLatLon(lat, lon);

  document.querySelector("#meteo-oslo .temperature").innerText = res.temperature;
  document.querySelector("#meteo-oslo .meteo-icon").data = `svg/${res.meteoSymbol}.svg`;
}

exo1MeteoOslo(59.8939243, 10.6203135);

/****************************************************************/
/* Exo 2                                                        */
/****************************************************************/

/**
 * Récupère les coordonnées géographiques (latitude et longitude) pour une ville donnée.
 * L'API de géocodage de l'IGN est requêtée, elle ne couvre que la France.
 * Elle renvoie plusieurs résultats (ou aucun si elle ne trouve rien).
 * À la différence de Google ou d'autres API, elle connait les adresse, mais
 * n'est pas très forte sur les POI (station de métro, lieu culturel, etc.)
 *
 * @async
 * @param {string} ville - Le nom de la ville à géocoder (en réalité une adresse).
 * @returns {Promise<Object|undefined>} Une promesse qui résout vers un objet contenant la latitude et la longitude, ou undefined si le géocodage échoue ou si aucun résultat n'est trouvé.
 * @property {number} lat - La coordonnée de latitude de la ville.
 * @property {number} lon - La coordonnée de longitude de la ville.
 *
 * On s'occupera de la gestion des problèmes et cas limites dans l'exo 5
 */
async function getPositionVille(ville) {
  const url = `https://data.geopf.fr/geocodage/search?q=${ville}`;
  const response = await fetch(url);
  if (response.ok) {
    let data = await response.json();
    if (data.features.length > 0) {
      const coord = data.features[0].geometry.coordinates;
      const lat = coord[1];
      const lon = coord[0];
      return { lat: lat, lon: lon };
    }
  } else {
    console.log(`erreur geocodage ${ville}`);
  }
}

/**
 * Récupère et affiche la météo actuelle à Lyon
 * @async
 *
 * @param {string} ville - Le nom de la ville à géocoder (en réalité une adresse).
 * @requires getPositionVille - Fonction qui retourne les coordonnées lat/lon d'une ville
 * @requires getMeteoLatLon - Fonction qui retourne les données météo pour des coordonnées
 *
 * @description
 * Cette fonction effectue les opérations suivantes :
 * 1. Récupère les coordonnées géographiques de Lyon
 * 2. Récupère les données météorologiques pour ces coordonnées
 * 3. Met à jour l'interface avec :
 *    - Le nom de la ville
 *    - Les coordonnées (latitude/longitude)
 *    - La température
 *    - L'icône météo correspondante
 *
 * La fonction ne gère aucun cas limite cela sera vu dans l'exo 5.
 *
 */
async function exo2MeteoLyon(ville) {
  const pos = await getPositionVille(ville);
  const { temperature, meteoSymbol } = await getMeteoLatLon(pos.lat, pos.lon);

  document.querySelector("#meteo-lyon .ville").innerText = ville;
  document.querySelector("#meteo-lyon .coord").innerText = `lat:${pos.lat},lon:${pos.lon}`;

  const $tempElt = document.querySelector("#meteo-lyon .temperature");
  $tempElt.innerText = temperature;

  const $meteoIllustrationElt = document.querySelector("#meteo-lyon .meteo-icon");
  $meteoIllustrationElt.data = `svg/${meteoSymbol}.svg`;
}

/****************************************************************/
/* Exo 3 avec utilisation d'un template                         */
/****************************************************************/

/**
 * Crée un nouveau widget météo à partir d'un template HTML et le remplit avec les données d'une ville
 * @param {HTMLTemplateElement} template - L'élément template HTML contenant la structure du widget météo
 * @param {string} ville - Le nom de la ville
 * @param {Object} coordonnees - Les coordonnées géographiques de la ville
 * @param {number} coordonnees.lat - La latitude de la ville
 * @param {number} coordonnees.lon - La longitude de la ville
 * @param {string} temperature - La température actuelle (avec unité)
 * @param {string} icone - L'identifiant de l'icône météo (sans extension .svg)
 * @returns {DocumentFragment} Un nouveau fragment DOM contenant le widget météo rempli
 * @throws {Error} Si un des sélecteurs requis n'est pas trouvé dans le template
 * @example
 * const template = document.querySelector("#meteo-card-template");
 * const widget = creeWidgetMeteoVilleFromTemplate(
 *   template,
 *   "Lyon",
 *   { lat: 45.75, lon: 4.85 },
 *   "22°C",
 *   "sunny"
 * );
 * someHTMLElt.appendChild(widget);
 */
function creeWidgetMeteoVilleFromTemplate(template, ville, coordonnees, temperature, icone) {
  const conteneur = template.content.cloneNode(true);
  conteneur.querySelector(".ville").innerText = ville;
  conteneur.querySelector(".coord").innerText = `lat:${coordonnees.lat},lon:${coordonnees.lon}`;
  conteneur.querySelector(".temperature").innerText = temperature;
  conteneur.querySelector(".meteo-icon").data = `svg/${icone}.svg`;
  return conteneur;
}

/**
 * Génère et affiche des widgets météo pour une liste de villes favorites.
 *
 * On s'occupera de la gestion des problèmes dans l'exo 5
 */
async function exo3MeteoTableauTemplate() {
  const $dashboard = document.querySelector("#meteo-dashboard");
  const template = document.querySelector("#meteo-card-template");

  const villesFavorites = ["Paris", "Marseille", "Toulouse", "Villeurbanne", "Lille"];
  for (ville of villesFavorites) {
    const pos = await getPositionVille(ville);
    const { temperature, meteoSymbol } = await getMeteoLatLon(pos.lat, pos.lon);

    $cardRoot = creeWidgetMeteoVilleFromTemplate(template, ville, pos, temperature, meteoSymbol);
    $dashboard.append($cardRoot);
  }
}

/**************************************************
 * Remplissage au chargement de la page           *
 **************************************************/

// exo1MeteoOslo(59.8939243, 10.6203135);
exo2MeteoLyon("Lyon");
exo3MeteoTableauTemplate();
