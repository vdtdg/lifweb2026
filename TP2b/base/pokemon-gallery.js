/* === Partie 1: Gestion des événements et manipulation du DOM === */
// TODO: Ajoutez un événement 'change' sur le select#deck-choice
// L'événement doit :
// 1. Récupérer la valeur sélectionnée
// 2. Mettre à jour le titre du deck dans #deck-title
function initDeckSelector() {
  // Votre code ici
}

/* === Partie 2: Affichage de la galerie === */
// TODO: Créez une fonction qui affiche les pokémons du deck sélectionné
// Pour chaque pokémon, créez une card avec :
// - L'image du pokémon
// - Son nom
// - Son type
function afficherGalerie(deckId) {
  // Votre code ici
}

/* === Partie 3: Navigation clavier === */
// TODO: Ajoutez un listener d'événements pour les touches:
// - Flèche gauche: reculer dans la liste
// - Flèche droite: avancer dans la liste
function initNavigation() {
  // Votre code ici
}

// Initialisation
document.addEventListener("DOMContentLoaded", () => {
  initDeckSelector();
  initNavigation();
});
