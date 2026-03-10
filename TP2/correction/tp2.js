/******************************************************************************
  Exercice 0
******************************************************************************/

const reponsesPreparation = `
- 3 scripts dans le head et 1 dans le coprs

- tp2_demo_2.js est defer, il sera exécuté **à la fin** (juste avant le DOMContentLoaded)
- tp2.js est defer, il sera exécuté à la fin, dans l'ordre des defer, juste après tp2_demo_2.js
- tp2_demo_1.js est chargé dans le head et sera immédiatement exécuté
- le script anonymé sera exécuté immédiatement

- tp2_demo_2.js est defer, il a accès au DOM complet (5 liens)
- tp2_demo_1.js est chargé dans le head, le DOM est presque vide à ce moment (le body n'est pas rempli : 0 liens)
- le script anonymé sera exécuté à sa place (2 liens)
`;
console.info(reponsesPreparation);


// on change juste le <a> par le <li>
console.log("Nombre li de la page", document.querySelectorAll("li").length);

/******************************************************************************
  Exercice 1
******************************************************************************/

const $incrementBtn = document.querySelector("#incrementBtn");
const $decrementBtn = document.querySelector("#decrementBtn");

let count = 0;
const $counterDisplay = document.querySelector("#counter");
$incrementBtn.addEventListener("click", () => {
  count++;
  $counterDisplay.textContent = count;
});
$decrementBtn.addEventListener("click", () => {
  count--;
  $counterDisplay.textContent = count;
});

// reset
const $resetButton = document.createElement("button");
$resetButton.textContent = "reset";
$incrementBtn.after($resetButton);

$resetButton.addEventListener("click", () => {
  count = 0;
  $counterDisplay.textContent = count;
});

/******************************************************************************
  Exercice 2
******************************************************************************/

const $emailInput = document.querySelector("#emailInput");
const $errorMessage = document.querySelector("#errorMessage");
const $validateButton = document.querySelector("#validate-btn");

// On surveille l'input :
$emailInput.addEventListener("input", function () {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  errorMessage.textContent = !emailRegex.test(this.value)
    ? "Veuillez entrer une adresse email valide"
    : "";
});

// On surveille un click sur le bouton en question.
$validateButton.addEventListener("click", function () {
  // voir https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/email#basic_validation
  const advancedEmailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  $emailInput.style.backgroundColor = !advancedEmailRegex.test($emailInput.value)
    ? "tomato"
    : "palegreen";
});

/******************************************************************************
  Exercice 3
******************************************************************************/

const $anchors = document.querySelectorAll("ul#images-list > li > a");
const $display = document.querySelector("#image-container");
console.debug($anchors);
for (const $a of $anchors) {
  console.debug("Registering handler to", $a);

  $a.addEventListener("click", function clickButton(event) {
    // prevent default, évite la redirection
    event.preventDefault();

    const $img = document.createElement("img");
    $img.src = $a.href;
    $display.replaceChildren($img);
    // l'alternative à preventDefault est de retourner false, mais c'est moche
    // return false;
  });
}

/******************************************************************************
  Exercice 4
******************************************************************************/

const $grid = document.querySelector("#game-grid");

// On crée dynamiquement une grille de 8x8 (le code est fournit)
for (let y = 0; y < 8; y++) {
  for (let x = 0; x < 8; x++) {
    const cell = document.createElement("div");
    cell.classList.add("grid-cell");
    cell.dataset.x = x;
    cell.dataset.y = y;
    $grid.appendChild(cell);
  }
}

let playerPosition = { x: 4, y: 4 };

function updatePlayerPosition() {
  // On nettoie la grille
  document.querySelector(".player")?.classList.remove("player");

  // Cette cellule correspond au joueur
  const cell = document.querySelector(
    `.grid-cell[data-x="${playerPosition.x}"][data-y="${playerPosition.y}"]`,
  );
  cell.classList.add("player");
}

// Voici la partie à coder :

// Pour l'initialisation
updatePlayerPosition();

// On a un listener générique sur keydown et on traite les différent cas avec un switch
// En 1bis on verra une technique alternative.
document.addEventListener("keydown", (event) => {
  switch (event.key) {
    case "ArrowUp":
      playerPosition.y = Math.max(0, playerPosition.y - 1);
      break;
    case "ArrowDown":
      playerPosition.y = Math.min(7, playerPosition.y + 1);
      break;
    case "ArrowLeft":
      playerPosition.x = Math.max(0, playerPosition.x - 1);
      break;
    case "ArrowRight":
      playerPosition.x = Math.min(7, playerPosition.x + 1);
      break;
  }
  updatePlayerPosition();
});

/******************************************************************************
  Exercice 5 : suivi de souris
******************************************************************************/

// savoir si on a déjà le tracker
let toggleTracker = false;

// une variable privée à la fonction pour se rappeller de la position
const mousePos = { x: 0, y: 0 };
// mise à jour de la position. On nomme la fonction pour la supprimer plus tard
function handleMouse(event) {
  mousePos.x = event.pageX;
  mousePos.y = event.pageY;
}

// on ajoute un petit disque gris au div avec la classe dot qu'on trouve dans la css
// initiallement, on le cache
const circle = document.createElement("div");
circle.classList.add("dot");
document.body.append(circle);
circle.style.display = "none";

// le timer pour la version originale, avant requestAnimationFrame()
// let intervalID;

function followMouse() {
  toggleTracker = !toggleTracker;

  if (toggleTracker) {
    circle.style.display = "inline-block";

    // quand la souris bouge, on met à jour
    document.addEventListener("mousemove", handleMouse);

    const updatePosition = (hrTimeStamp) => {
      // dépend de l'écran, mais souvent 60 Hz ~ 16.67ms / cycle
      console.debug(hrTimeStamp);
      circle.style.left = `${mousePos.x - 25}px`;
      circle.style.top = `${mousePos.y - 25}px`;

      // pas besoin avec setTimeout
      if (toggleTracker) requestAnimationFrame(updatePosition);
    };

    requestAnimationFrame(updatePosition);
    // avant requestAnimationFrame
    // toutes les 50ms, on déplace notre <div> qui est rendu par le disque gris
    // intervalID = setInterval(updatePosition, 50);
  } else {
    // avant requestAnimationFrame
    // clearInterval(intervalID);
    document.removeEventListener("mousemove", handleMouse);
    circle.style.display = "none";
  }
}

document.querySelector("#mouse-btn").addEventListener("click", followMouse);

/******************************************************************************
  Exercice 6 : tableau triable
******************************************************************************/

const $table = document.querySelector("#the-table");
const $header = $table.querySelector("thead");
const $body = $table.querySelector("tbody");

$header.addEventListener("click", function (event) {
  // on ne garde que sur <th> (notons les majuscules)
  if (event.target.tagName !== "TH") return;

  // meta données des colonnes
  const colType = event.target.dataset.type;
  const order = event.target.dataset.order === "asc" ? 1 : -1;
  const index = event.target.cellIndex;

  // on utilise le spread operator au lieu de Array.from
  const lines = [...$body.querySelectorAll("tr")];
  const comparators = {
    number: (tr1, tr2) =>
      order * (tr1.children[index].textContent - tr2.children[index].textContent),
    string: (tr1, tr2) =>
      order * tr1.children[index].textContent.localeCompare(tr2.children[index].textContent),
    date: (tr1, tr2) =>
      order *
      (new Date(tr1.children[index].textContent) - new Date(tr2.children[index].textContent)),
  };

  // remplacement par les <tr> triées
  lines.sort(comparators[colType]);
  $body.replaceChildren(...lines);
  event.target.dataset.order = order === 1 ? "desc" : "asc";
});

/******************************************************************************
  Exercice 1 bis
******************************************************************************/
const $incrementBtnBis = document.querySelector("#incrementBtnBis");
const $decrementBtnBis = document.querySelector("#decrementBtnBis");
const $counterDisplayBis = document.querySelector("#counterBis");
const $resetButtonBis = document.createElement("button");
$resetButtonBis.name = "reset";
$resetButtonBis.textContent = "reset";
$incrementBtnBis.after($resetButtonBis);

const countBis = 0;
let historyCursor = 0;

let actionHistory = [];
const actionList = {
  increment: (x) => x + 1,
  decrement: (x) => x - 1,
  reset: (x) => 0,
};

function computerCounter(counter) {
  // reduce permet de parcourir le tableau d'actionHistory et
  // d'appliquer les fonctions stockées à la suite les unes des autres
  // c'est ce que fait React et qui favorise la manipulation de variable
  // immuables (des constantes sur lesquelles on applique des fonctions)
  // Cette approche est souvent utilisée pour faire du undo/redo de manière "naturelle"
  internalCount = actionHistory.slice(0, historyCursor);
  return internalCount.reduce((result, action) => {
    return action(result);
  }, counter);
}

function refreshCounter() {
  $counterDisplayBis.textContent = computerCounter(countBis);
}

function refreshHistoryMenu() {
  // Clear existing options
  $historyMenu.innerHTML = "";

  actionHistory.forEach((func, index) => {
    const option = document.createElement("option");

    option.value = index;
    option.textContent = func.name;
    if (historyCursor == index) option.textContent += " <-";

    $historyMenu.appendChild(option);
  });
}

function handleButtons(event) {
  // La construction d'ActionList ci-dessus permet d'éviter de faire un switch
  // Un switch serait d'ailleurs plus performant...
  // ici on se rapproche d'un mode de fonctionnement interne de React
  // ou on enregistre les actions propres à un composant
  // C'est grossier, mais ça aidera les étudiants les plus avancés
  // à se construire un modèle mental du fonctionnement interne
  // de frameworks web qu'ils utilisent un peu magiquement
  actionHistory.push(actionList[event.target.name]);
  // On récupère souvent l'id de la cible d'un événement, pour faire ses traitements
  // Ici un j'ai dissocié id et name (voir la partie html),
  // ça qui permet d'avoir des id uniques verbeux et des noms qui eux sont clairs
  historyCursor++;
  refreshCounter();
  refreshHistoryMenu();
}

function handleHistory(event) {
  switch (event.target.name) {
    case "undo":
      historyCursor > 0 ? historyCursor-- : (historyCursor = 0);
      break;
    case "redo":
      historyCursor < actionHistory.length
        ? historyCursor++
        : (actionCursor = actionHistory.length);
      break;
    case "history":
      historyCursor = Number(event.target.value);
      break;
  }

  refreshCounter();
  refreshHistoryMenu();
  console.log(historyCursor);
}

$incrementBtnBis.addEventListener("click", handleButtons);
$decrementBtnBis.addEventListener("click", handleButtons);
$resetButtonBis.addEventListener("click", handleButtons);

const $undoBtn = document.querySelector("#undo-btn");
const $redoBtn = document.querySelector("#redo-btn");
const $historyMenu = document.querySelector("#history-list");

$undoBtn.addEventListener("click", handleHistory);
$redoBtn.addEventListener("click", handleHistory);
$historyMenu.addEventListener("click", handleHistory);

/******************************************************************************
  Exercice 4 bis
******************************************************************************/
