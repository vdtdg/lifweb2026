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
  const result = await fetch(`https://data.geopf.fr/geocodage/search?&q=${address}`)
  const apiResponse = await result.json()
  const coord = apiResponse.features[0].geometry.coordinates
  return { "lon": coord[0], "lat": coord[1] }
}

async function getTemperatureForCoord(coord) {
  const meteoUrl = `https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=${coord.lat}&lon=${coord.lon}`;
  const meteoCallResponse = await fetch(meteoUrl)
  const meteoLyon = await meteoCallResponse.json()
  return meteoLyon.properties.timeseries[0].data.instant.details.air_temperature
}

(async function () {
  const lyonCoord = await getGeoCoordinates("Lyon")
  const lyonCurrentTemp = await getTemperatureForCoord(lyonCoord)
  console.log(lyonCurrentTemp)
})();
