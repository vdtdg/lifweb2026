/* === Partie 1: Gestion des événements et manipulation du DOM === */
// TODO: Ajoutez un événement 'change' sur le select#deck-choice
// L'événement doit :
// 1. Récupérer la valeur sélectionnée
// 2. Mettre à jour le titre du deck dans #deck-title
function initDeckSelector() {
  const deckChoice = document.querySelector('#deck-choice')
  const deckTitle = document.querySelector('#deck-title')
  deckChoice.addEventListener('change', (event) => {
    const selectedDeckId = event.target.value
    const selectedDeckName = decks[selectedDeckId]?.nom

    if (selectedDeckId) {
      deckTitle.textContent = selectedDeckName
      afficherGalerie(selectedDeckId)
    }
    else {
      deckTitle.textContent = "Veuillez selectionner un Deck dans le menu déroulant ci-dessus."
      cleanGalerie()
    }
  })
}

function cleanGalerie() {
  const gallery = document.querySelector('#gallery')
  gallery.replaceChildren();
}

/* === Partie 2: Affichage de la galerie === */
// TODO: Créez une fonction qui affiche les pokémons du deck sélectionné
// Pour chaque pokémon, créez une card avec :
// - L'image du pokémon
// - Son nom
// - Son type
function afficherGalerie(deckId) {
  const gallery = document.querySelector('#gallery')
  gallery.replaceChildren();

  decks[deckId].pokemons.forEach(pokemon => {
    const pokemonCard = document.createElement('div')
    pokemonCard.className = "pokemon-card"

    const pokemonImg = document.createElement('img')
    pokemonImg.src = pokemon.image
    const pokemonName = document.createElement('h3')
    pokemonName.textContent = pokemon.nom
    const pokemonType = document.createElement('p')
    pokemonType.textContent = `Type: ${pokemon.type}`

    pokemonCard.appendChild(pokemonImg)
    pokemonCard.appendChild(pokemonName)
    pokemonCard.appendChild(pokemonType)
    gallery.appendChild(pokemonCard)
  })
}

/* === Partie 3: Navigation clavier === */
// TODO: Ajoutez un listener d'événements pour les touches:
// - Flèche gauche: reculer dans la liste
// - Flèche droite: avancer dans la liste
function initNavigation() {
  let cardIndex = 0

  document.addEventListener('keydown', (event) => {
    const deckId = document.querySelector('#deck-choice').value
    const maxIndex = deckId ? decks[deckId].pokemons.length : 0

    switch (event.key) {
      case "ArrowLeft":
        event.preventDefault()
        cardIndex = Math.max(0, cardIndex - 1)
        refreshGalerieCSS(cardIndex)
        break;
      case "ArrowRight":
        event.preventDefault()
        cardIndex = Math.min(maxIndex - 1, cardIndex + 1)
        refreshGalerieCSS(cardIndex)
        break;
      default:
        return;
    }
  })
}

function refreshGalerieCSS(currentIndex) {
  const $gallery = document.querySelector("#gallery");
  const $cards = document.querySelectorAll(".pokemon-card");

  $cards.forEach((_, index) => {
    if (index === currentIndex) {
      $gallery.childNodes[currentIndex].classList.add("selected");
    } else {
      $gallery.childNodes[index].classList.remove("selected");
    }
  });
}

// Initialisation
document.addEventListener("DOMContentLoaded", () => {
  initDeckSelector();
  initNavigation();
});
