/****************************************************************/
/* Exo 1 + 5                                                    */
/****************************************************************/

/**
 * Récupère les données météorologiques à partir des coordonnées géographiques.
 * Cette fonction effectue une requête à l'API Met.no et gère différents types d'erreurs.
 *
 * @param {number} lat - Latitude (entre -90 et 90)
 * @param {number} lon - Longitude (entre -180 et 180)
 * @returns {Promise<Object>} - Un objet contenant la température et le symbole météo
 * @throws {Error} - Lance une erreur en cas de problème avec la requête ou les données
 */
async function getMeteoLatLon(lat, lon) {
  try {
    // Validation des paramètres d'entrée
    if (lat === undefined || lon === undefined) {
      throw new Error("Paramètres manquants : la latitude et la longitude sont requises");
    }

    if (isNaN(lat) || isNaN(lon) || lat < -90 || lat > 90 || lon < -180 || lon > 180) {
      throw new Error(
        "Coordonnées invalides : la latitude doit être entre -90 et 90, la longitude entre -180 et 180",
      );
    }

    // Création de l'URL pour la requête API
    const url = `https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=${lat}&lon=${lon}`;

    // Exécution de la requête API
    const response = await fetch(url);

    // Gestion des différents codes de statut HTTP
    if (response.status === 429) {
      // Trop de requêtes - traitement spécial pour la limitation du taux de requêtes
      const retryAfter = response.headers.get("Retry-After");
      throw new Error(
        `Limite de requêtes dépassée (429). Réessayer après ${retryAfter || "un certain temps"}`,
      );
    }

    if (!response.ok) {
      // Gestion des autres réponses d'erreur
      throw new Error(
        `Échec de la requête API avec le statut ${response.status}: ${response.statusText}`,
      );
    }

    // Traitement de la réponse réussie
    const data = await response.json();

    // Vérification de l'existence de la structure de données attendue
    if (!data.properties?.timeseries?.[0]?.data?.instant?.details) {
      throw new Error(
        "Format de réponse API inattendu : données météorologiques requises manquantes",
      );
    }

    // Extraction des données météorologiques
    const temperature = data.properties.timeseries[0].data.instant.details.air_temperature;
    const meteoSymbol = data.properties.timeseries[0].data.next_1_hours?.summary?.symbol_code;

    return { temperature, meteoSymbol };
  } catch (error) {
    console.error(`Erreur API met.no: ${error.message}`);
    throw error;
  }
}

// Pour l'exo 5 il est possible de tester de mauvaises coordonnées et
// traiter l'erreur retournée par exemple en remplaçant lat par -100.
async function exo1MeteoOslo(lat, lon) {
  getMeteoLatLon(lat, lon)
    .then(function ({ temperature, meteoSymbol }) {
      document.querySelector("#meteo-oslo .temperature").innerText = temperature;
      document.querySelector("#meteo-oslo .meteo-icon").data = `svg/${meteoSymbol}.svg`;
    })
    .catch((erreur) => console.error("Échec de récupération des données météo:", erreur.message));
}

/****************************************************************/
/* Exo 2 + 5                                                    */
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

/***************************
 * EXO 5                   *
 ***************************/

function csvToArray(str, delimiter = ",") {
  // slice from start of text to the first \n index
  // use split to create an array from string by delimiter
  const headers = str.slice(0, str.indexOf("\n")).split(delimiter);

  // slice from \n index + 1 to the end of the text
  // use split to create an array of each csv value row
  const rows = str.slice(str.indexOf("\n") + 1).split("\n");

  // Map the rows
  // split values from each row into an array
  // use headers.reduce to create an object
  // object properties derived from headers:values
  // the object passed as an element of the array
  const arr = rows.map(function (row) {
    const values = row.split(delimiter);
    const el = headers.reduce(function (object, header, index) {
      object[header] = values[index];
      return object;
    }, {});
    return el;
  });

  // return the array
  return arr;
}

async function exo5GeocodageCSV() {
  try {
    // On récupère le fichier CSV
    const csvResponse = await fetch("liste_villes.csv");

    if (!csvResponse.ok) {
      throw new Error(
        `Échec de récupération du CSV: ${csvResponse.status} ${csvResponse.statusText}`,
      );
    }

    // On lit le contenu du CSV comme Blob
    const csvBlob = await csvResponse.blob();

    // Créer un objet File à partir du Blob
    const csvFile = new File([csvBlob], "liste_villes.csv", { type: "text/csv" });

    // On prépare le FormData pour l'API de géocodage
    const form = new FormData();
    form.append("columns", "city");
    form.append("data", csvFile);
    // form.append("delimiter", ";");
    form.append("encoding", "UTF-8");
    // form.append("crs", "EPSG:4326");

    const options = {
      method: "POST",
      body: form,
    };

    // Requête à l'API de géocodage
    const response = await fetch("https://data.geopf.fr/geocodage/search/csv", options);

    if (!response.ok) {
      const errorText = await response.text();
      try {
        const errorJson = JSON.parse(errorText);
        throw new Error(`Erreur API: ${errorJson.code} - ${errorJson.message}`);
      } catch (e) {
        throw new Error(`Erreur API: ${response.status} ${response.statusText}\n${errorText}`);
      }
    }

    // Analyser la réponse
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("text/csv")) {
      const csvData = await response.text();
      // on transforme le csv en tableau JavaScript avant de le renvoyer.
      return { success: true, data: csvToArray(csvData) };
    }
  } catch (error) {
    console.error("Erreur lors du géocodage:", error);
    return { success: false, error: error.message };
  }
}

async function exo5() {
  const $dashboard = document.querySelector("#meteo-dashboard");
  const template = document.querySelector("#meteo-card-template");

  const res = await exo5GeocodageCSV();
  if (res.success) {
    for (ville of res.data) {
      if (ville.latitude != "") {
        const { temperature, meteoSymbol } = await getMeteoLatLon(ville.latitude, ville.longitude);

        $cardRoot = creeWidgetMeteoVilleFromTemplate(
          template,
          ville.city,
          { lat: ville.latitude, lon: ville.longitude },
          temperature,
          meteoSymbol,
        );
        $dashboard.append($cardRoot);
      } else {
        $cardRoot = creeWidgetMeteoVilleFromTemplate(
          template,
          ville.city,
          { lat: "undefined", lon: "undefined" },
          "erreur",
          "fog",
        );
        $dashboard.append($cardRoot);
      }
    }
  }
}

async function exo6() {
  const inputVille = document.getElementById("choix-ville");
  const listeVille = document.getElementById("liste-villes");

  // Afficher la meteo de la ville
  inputVille.addEventListener("change", function () {
    if (this.value) {
      exo2MeteoLyon(this.value);
    }
  });

  csvResponse = await fetch("liste_villes.csv");

  if (!csvResponse.ok) {
    throw new Error(
      `Échec de récupération du CSV: ${csvResponse.status} ${csvResponse.statusText}`,
    );
  }

  // On lit le contenu du CSV comme text
  csvContent = await csvResponse.text();

  // initialisation de datalist
  const fragment = new DocumentFragment();
  csvContent.split("\n").forEach((country) => {
    const option = document.createElement("option");
    option.value = country;
    fragment.appendChild(option);
  });
  listeVille.append(fragment);
}

/**************************************************
 * Remplissage au chargement de la page           *
 **************************************************/

exo1MeteoOslo(59.8939243, 10.6203135);
exo2MeteoLyon("Lyon");
// exo3MeteoTableauTemplate();
// exo5GeocodageCSV();
// exo5();
exo6();
