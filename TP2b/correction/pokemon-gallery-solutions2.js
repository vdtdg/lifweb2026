/* === Solution Partie 1: Gestion des événements === */
function initDeckSelector() {
  const $selectDeck = document.querySelector("#deck-choice");
  const $titleElement = document.querySelector("#deck-title");

  $selectDeck.addEventListener("change", (event) => {
    const deckId = event.target.value;
    console.log(deckId, $titleElement, $selectDeck);
    if (deckId && decks[deckId]) {
      $titleElement.innerText = decks[deckId].nom;
      afficherGalerieCSS(deckId); // Sera rajouté dans la partie 3
      afficherGalerieJS(deckId, 1); // Sera rajouté dans la partie 3
    } else {
      $titleElement.innerText = "";
      document.querySelector(".flex-row-container").replaceChildren(); // Sera rajouté dans la partie 3
      /* On préfère .replaceChildren() à innerHTML = "";
        1. pour des raisons de sécurité
        2. pour des raisons de perf, on manipule directement le DOM 
          alors qu'avec innerHTML le contenu va devoir être reconstruit 
          pour ensuite être injecté dans le DOM
       */
    }
  });
}

/* === Solution Partie 2: CSS Flexbox === */
/*
.deck-title-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100px;
}
*/

/* === Solution Partie 3: Affichage galerie === */
function afficherGalerieCSS(deckId) {
  const $gallery = document.querySelector("#pokemon-gallery");
  $gallery.replaceChildren();

  if (!decks[deckId]) return;

  decks[deckId].pokemons.forEach((pokemon, index) => {
    const card = document.createElement("div");
    card.classList.add("pokemon-card");

    card.innerHTML = `
            <img src="${pokemon.image}" alt="${pokemon.nom}">
            <h3>${pokemon.nom}</h3>
            <p>Type: ${pokemon.type}</p>
        `;

    $gallery.appendChild(card);
  });
  refreshGalerieCSS(1);
}

function refreshGalerieCSS(currentIndex) {
  const $gallery = document.querySelector("#pokemon-gallery");
  const $cards = document.querySelectorAll(".pokemon-card");

  $cards.forEach((_, index) => {
    if (index === currentIndex) {
      $gallery.childNodes[currentIndex].classList.add("selected");
    } else {
      $gallery.childNodes[index].classList.remove("selected");
    }
  });
}

/* === Solution Partie 4: Navigation gallerie CSS === */
function initNavigationCSS() {
  // Les variables déclarées ici seront accessibles dans le event handler ci-dessous, mais pas dans le scope global
  let currentDeck = "";
  let currentIndex = 0;

  // On capture les événements clavier
  document.addEventListener("keydown", (event) => {
    const deckId = document.querySelector("#deck-choice").value;
    if (!deckId || !decks[deckId]) return;

    if (currentDeck !== deckId) {
      currentDeck = deckId;
      currentIndex = 0;
    }

    const maxIndex = decks[deckId].pokemons.length;

    // On filtre sur les flèches gauches et droite
    switch (event.key) {
      // Les modulos servent à rendre la gallerie circulaire, quand on arrive à la fin, l'index revient vers le début du tableau.
      case "ArrowLeft":
        // Dand ce cas ci, on fait "+ maxIndex",
        // pour être sûr d'avoir un index positif
        currentIndex = (currentIndex - 1 + maxIndex) % maxIndex;
        break;
      case "ArrowRight":
        currentIndex = (currentIndex + 1) % maxIndex;
        break;
      default:
        return;
    }

    refreshGalerieCSS(currentIndex);
  });
}

/* === Solution Partie 3: Affichage galerie modifié pour le bonus 4 === */
function afficherGalerieJS(deckId, position) {
  const $gallery = document.querySelector("#jsgallery-container");
  $gallery.replaceChildren();

  if (!decks[deckId]) return;

  const maxIndex = decks[deckId].pokemons.length;
  previousPokemon = decks[deckId].pokemons[(position - 1 + maxIndex) % maxIndex];
  currentPokemon = decks[deckId].pokemons[position];
  nextPokemon = decks[deckId].pokemons[(position + 1) % maxIndex];

  miniList = [previousPokemon, currentPokemon, nextPokemon];

  miniList.forEach((pokemon, index) => {
    const card = document.createElement("div");
    card.classList.add("jscard-item");

    card.innerHTML = `
            <img src="${pokemon.image}" alt="${pokemon.nom}">
            <h3>${pokemon.nom}</h3>
            <p>Type: ${pokemon.type}</p>
        `;

    // on gère la rotation en js
    if (index === 0) {
      card.style.transform = "rotate(-5deg)";
    } else if (index === 1) {
      card.style.transform = "scale(1.15)";
    } else if (index === 2) {
      card.style.transform = "rotate(5deg)";
    }

    $gallery.appendChild(card);

    /**
     * En pratique il serait bien plus efficace de ne pas supprimer
     * et re-créer des éléments du DOM à chaque événement
     * https://stackoverflow.com/questions/9732624/how-to-swap-dom-child-nodes-in-javascript
     */
  });
}

/* === Solution Partie 4: Navigation gallerie JS === */
function initNavigationJS() {
  // Les variables déclarées ici seront accessibles dans le event handler ci-dessous, mais pas dans le scope global
  let currentIndex = 0;
  let currentDeck = null;

  document.addEventListener("keydown", (event) => {
    const deckId = document.querySelector("#deck-choice").value;
    if (!deckId || !decks[deckId]) return;

    if (currentDeck !== deckId) {
      currentDeck = deckId;
      currentIndex = 0;
    }

    const maxIndex = decks[deckId].pokemons.length;
    switch (event.key) {
      case "ArrowLeft":
        currentIndex = (currentIndex - 1 + maxIndex) % maxIndex;
        break;
      case "ArrowRight":
        currentIndex = (currentIndex + 1) % maxIndex;
        break;
      default:
        return;
    }

    afficherGalerieJS(deckId, currentIndex);
  });
}

// Initialisation
document.addEventListener("DOMContentLoaded", () => {
  initDeckSelector();
  initNavigationCSS();
  initNavigationJS();
});
