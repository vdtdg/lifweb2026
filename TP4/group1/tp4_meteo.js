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

