
- Faire une première requête avec httpie ou curl sur la route /health de l’API.
- Faire une seconde requête avec httpie pour créer un nouveau raccourci d’url (voir les routes ci-dessus).
- Vérifier avec une requête à l’API qu’une route a été ajoutée.

Vous trouverez des requêtes httpie dans le fichier : httpie-collection-url-shortener-local.json

Répondre aux questions de compréhension suivantes :

- Donner les différences entre `npm start` et `npm run prod`.

  Il faut regarder la partie `scripts` de `package.json`

  - `npm start` est lancé avec [nodemon](https://nodemon.io/) qui surveille les fichiers et relance node en cas de changement
  - `npm run prod` a pour vocation d'être lancé sur le serveur

- Quels sont les différents niveaux supportés par server.log() ?

  - Les niveaux de logs de pino sont documentés ici : https://github.com/pinojs/pino/blob/main/docs/api.md#loggerlevels-object
  - `server.log()` supporte deux niveaux de log  
    - Si NODE_ENV est "development", le niveau de log est défini sur "debug", les messages de debug détaillés seront enregistrés.
    - Sinon (en production), le niveau de log est défini sur "warn", seuls les avertissements et les erreurs seront enregistrés.

```js
    pino: { level: process.env.NODE_ENV === "development" ? "debug" : "warn" },
```

  pour autant, possible d'utiliser `info` aussi pour le logging.

- Comment exécuter les tests de tests/server.test.js ?

  - `npm run test` toujours dans `scripts` de `package.json`.

