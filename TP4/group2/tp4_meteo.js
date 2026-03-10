// Exercice 1

const OSLO_COORDS = {
  lat: 59.8939243,
  lon: 10.6203135,
};

const osloContainer = document.querySelector("#meteo-oslo");
const osloTemperature = osloContainer?.querySelector(".temperature");
const osloIcon = osloContainer?.querySelector(".meteo-icon");

const osloUrl = `https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=${OSLO_COORDS.lat}&lon=${OSLO_COORDS.lon}`;

fetch(osloUrl)
  .then((response) => {
    if (!response.ok) {
      throw new Error(`Meteo API error: ${response.status}`);
    }
    return response.json();
  })
  .then((data) => {
    const firstTimeserie = data?.properties?.timeseries?.[0];
    const temperature = firstTimeserie?.data?.instant?.details?.air_temperature;
    const symbol =
      firstTimeserie?.data?.next_1_hours?.summary?.symbol_code ||
      firstTimeserie?.data?.next_6_hours?.summary?.symbol_code ||
      firstTimeserie?.data?.next_12_hours?.summary?.symbol_code;

    if (osloTemperature && typeof temperature === "number") {
      osloTemperature.textContent = `${temperature} °C`;
    }

    if (osloIcon && symbol) {
      osloIcon.data = `weathericons/svg/${symbol}.svg`;
    }
  })
  .catch((error) => {
    console.error("Erreur meteo Oslo:", error);
  });

// Exercice 2

async function getGeoCoordinates(address) {
  const apiResponse = await fetch(`https://data.geopf.fr/geocodage/search?&q=${address}`)
  const jsonResponse = await apiResponse.json()
  const coord = jsonResponse.features[0].geometry.coordinates
  return { lon: coord[0], lat: coord[1] }
}

async function getMeteoFromCoordinates(coord) {
  const meteoUrl = `https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=${coord.lat}&lon=${coord.lon}`;
  const meteoResponse = await fetch(meteoUrl)
  const meteoJson = await meteoResponse.json()
  const firstTimeserie = meteoJson?.properties?.timeseries?.[0];

  return {
    temperature: firstTimeserie?.data?.instant?.details?.air_temperature,
    symbol: firstTimeserie?.data?.next_1_hours?.summary?.symbol_code ||
      firstTimeserie?.data?.next_6_hours?.summary?.symbol_code ||
      firstTimeserie?.data?.next_12_hours?.summary?.symbol_code
  }
}

(async function () {
  const city = 'Lyon'
  const lyonCoord = await getGeoCoordinates(city)
  const lyonMeteo = await getMeteoFromCoordinates(lyonCoord)
  
  const symbolIconPath = `weathericons/svg/${lyonMeteo.symbol}.svg`

  const lyonContainer = document.querySelector("#meteo-lyon");
  lyonContainer.innerHTML = `
      <h3>
        <span class="ville">${city}</span> <span class="coord">lat: ${lyonCoord.lat}, lon: ${lyonCoord.lon}</span>
      </h3>
      <span class="temperature">${lyonMeteo.temperature}</span>
      <object class="meteo-icon" type="image/svg+xml" data="${symbolIconPath}"></object>
  `
})();



// Exercice 3

(async function () {
  const template = document.querySelector("#meteo-card-template");
  const meteoContainer = document.querySelector("#meteo-dashboard");

  const villesFavorites = ["Paris", "Marseille", "Toulouse", "Villeurbanne", "Lille"];
  villesFavorites.forEach(async (city) => {
    const cityCoord = await getGeoCoordinates(city)
    const cityMeteo = await getMeteoFromCoordinates(cityCoord)
    const symbolIconPath = `weathericons/svg/${cityMeteo.symbol}.svg`

    const cityCard = template.content.cloneNode(true)
    cityCard.querySelector(".ville").innerText = city;
    cityCard.querySelector(".coord").innerText = `lat: ${cityCoord.lat},lon: ${cityCoord.lon}`;
    cityCard.querySelector(".temperature").innerText = cityMeteo.temperature;
    cityCard.querySelector(".meteo-icon").data = symbolIconPath;

    meteoContainer.append(cityCard)
  })
})();



