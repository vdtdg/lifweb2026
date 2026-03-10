/* eslint-disable no-console */
// ici l'adresse et le port DU SERVEUR NODE
import { html, render } from "https://esm.run/lit-html";

const apiServer = "http://localhost:8000";
const $description = document.querySelector("#app-subtitle");
const $footer = document.querySelector("footer");
const $form = document.querySelector("#create-link");

async function getAPI(path = "/") {
  const url = new URL(path, apiServer);
  const resp = await fetch(url, {
    headers: {
      Accept: "application/json",
    },
  });
  if (!resp.ok) {
    throw new Error(`HTTP error! status: ${resp.status}`);
  }
  return await resp.json();
}

async function updateFooter() {
  const { version, name, serverUri } = await getAPI("/health");
  const { links_count } = await getAPI("/api");

  $description.textContent = `Already ${links_count} links!`;

  const result = html`
    <div @click=${() => console.log("ok")}>
      <p>
        Served on ${new Date().toLocaleString()} from
        <a href="${window.location.origin}">${window.location.origin}</a>. API
        <span>${name}</span> v.${version} on <a href="${serverUri}">${serverUri}</a>.
      </p>
      <p>
        See the
        <a href="http://lifweb.pages.univ-lyon1.fr/TP6-WebApp/">LIFWEB homepage</a>
        for more information.
      </p>
    </div>
  `;
  render(result, $footer);
}

$form.addEventListener("submit", async (event) => {
  event.preventDefault();
  console.warn("Submitting form... TODO");
});

await updateFooter();
