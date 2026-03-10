/* === Partie 1: Gestion des événements et manipulation du DOM === */
// TODO: Ajoutez un événement 'change' sur le select#deck-choice
// L'événement doit :
// 1. Récupérer la valeur sélectionnée
// 2. Mettre à jour le titre du deck dans #deck-title
function initDeckSelector() {
  const deckChoice = document.querySelector('#deck-choice')
  const deckTitle = document.querySelector('#deck-title')

  deckChoice.addEventListener('change', (event) => {
    const deckId = event.target.value  // starter, legendaire...
    if (deckId) {
      const deckName = decks[deckId].nom
      deckTitle.textContent = deckName
      afficherGalerie(deckId)
    } else {
      deckTitle.textContent = "Veuillez selectionner un Deck dans le menu déroulant ci-dessus."
    }
  })
}

/* === Partie 2: Affichage de la galerie === */
// TODO: Créez une fonction qui affiche les pokémons du deck sélectionné
// Pour chaque pokémon, créez une card avec :
// - L'image du pokémon
// - Son nom
// - Son type
function afficherGalerie(deckId) {
  const gallery = document.querySelector("#gallery")
  gallery.replaceChildren()
  const pokemonList = decks[deckId].pokemons

  pokemonList.forEach(pokemon => {
    const pokemonCard = document.createElement('div')
    pokemonCard.classList.add('pokemon-card')

    const pokemonImg = document.createElement('img')
    pokemonImg.src = pokemon.image
    pokemonImg.alt = pokemon.nom

    const pokemonTitle = document.createElement('h3')
    pokemonTitle.textContent = pokemon.nom

    const pokemonType = document.createElement('p')
    pokemonType.textContent = `Type: ${pokemon.type}`

    pokemonCard.appendChild(pokemonImg)
    pokemonCard.appendChild(pokemonTitle)
    pokemonCard.appendChild(pokemonType)

    gallery.appendChild(pokemonCard)
  })
}

/* === Partie 3: Navigation clavier === */
// TODO: Ajoutez un listener d'événements pour les touches:
// - Flèche gauche: reculer dans la liste
// - Flèche droite: avancer dans la liste
function initNavigation() {
  let index = 0

  document.addEventListener('keydown', (event) => {
    console.log(event.key)
  
    const deckId = document.querySelector('#deck-choice').value
    const pokemonList = decks[deckId].pokemons
    const maxIndex = pokemonList.length - 1

    switch (event.key) {
      case "ArrowLeft":
        event.preventDefault()
        index = Math.max(0, index - 1)
        refreshSelected(index)
        break;
      case "ArrowRight":
        event.preventDefault()
        index = Math.min(maxIndex, index + 1)
        refreshSelected(index)
        break;
      default:
        return;
    }
  })
}

function refreshSelected(selectedIndex) {
  const pokemonCards = document.querySelectorAll(".pokemon-card")
  pokemonCards.forEach((card, cardIndex) => {
    if (selectedIndex === cardIndex) {
      card.classList.add('selected')
    }
    else {
      card.classList.remove('selected')
    }
  })
}


// Initialisation
document.addEventListener("DOMContentLoaded", () => {
  initDeckSelector();
  initNavigation();
});
