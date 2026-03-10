"use strict";

// Exercice 1
const $decrementBtn = document.querySelector('#decrementBtn')
const $incrementBtn = document.querySelector('#incrementBtn')
const $counter = document.querySelector('#counter')

function decrementCounter() {
    let counterValue = parseInt($counter.textContent)
    counterValue -= 1
    $counter.textContent = counterValue
}

function incrementCounter() {
    let counterValue = parseInt($counter.textContent)
    counterValue += 1
    $counter.textContent = counterValue
}

$decrementBtn.addEventListener("click", decrementCounter)
$incrementBtn.addEventListener("click", incrementCounter)

const $resetBtn = document.createElement('button')
$resetBtn.textContent = "Reset"
$incrementBtn.after($resetBtn)

function resetCounter() {
    $counter.textContent = 0
}

$resetBtn.addEventListener('click', resetCounter)


// Exercice 2
const $emailInput = document.querySelector('#emailInput')
const $validateBtn = document.querySelector('#validate-btn')
const $errorMessageParagraph = document.querySelector('#errorMessage')


function isEmailCorrect(value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let emailCorrectementFormatte = emailRegex.test(value);
    return emailCorrectementFormatte
}

$validateBtn.addEventListener('click', () => {
    if (isEmailCorrect($emailInput.value)) {
        $emailInput.style.borderColor = "#20ca39ff"
    }
    else {
        $emailInput.style.borderColor = "red"
    }
})

$emailInput.addEventListener('input', () => {
    if (!isEmailCorrect($emailInput.value)) {
        $errorMessageParagraph.textContent = "Email is INcorrectly formated"
    } else {
        $errorMessageParagraph.textContent = ""
    }
})


// Exercice 3
const imageContainer = document.querySelector('#image-container')   // TODO, isn't there is a better way? like 'ul#images-list > li > a'
const imageList = document.querySelector('#images-list')
const imageListChildren = imageList.querySelectorAll('li')

imageListChildren.forEach(imageListElement => {
    const links = imageListElement.querySelectorAll('a')
    const firstLink = links[0]

    firstLink.addEventListener('click', (event) => {
        event.preventDefault()
        const image = document.createElement('img')
        image.src = firstLink.href
        image.style.width = "80%"
        imageContainer.replaceChildren(image)
    })
})

// Exercice 4
const $grid = document.querySelector("#game-grid");

// Create 8x8 grid
for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
        const cell = document.createElement("div");
        cell.classList.add("grid-cell");
        cell.dataset.x = x;
        cell.dataset.y = y;
        $grid.appendChild(cell);
    }
}

let playerPosition = { x: 3, y: 6 };

function updatePlayerPosition() {
    // Remove previous player cell
    document.querySelector(".player")?.classList.remove("player");

    // Add player to new cell
    const cell = document.querySelector(
        `.grid-cell[data-x="${playerPosition.x}"][data-y="${playerPosition.y}"]`,
    );
    cell.classList.add("player");
}

updatePlayerPosition()

document.addEventListener('keydown', (event) => {
    if (event.key === "ArrowUp") {
        event.preventDefault()
        playerPosition.y = Math.max(0, playerPosition.y - 1)
        updatePlayerPosition()
    }
    else if (event.key === "ArrowDown") {
        event.preventDefault()
        playerPosition.y = Math.min(7, playerPosition.y + 1)
        updatePlayerPosition()
    }
    else if (event.key === "ArrowLeft") {
        event.preventDefault()
        playerPosition.x = Math.max(0, playerPosition.x - 1)
        updatePlayerPosition()
    }
    else if (event.key === "ArrowRight") {
        event.preventDefault()
        playerPosition.x = Math.min(7, playerPosition.x + 1)
        updatePlayerPosition()
    } else {

    }
})


// Exercice 5
const $dot = document.querySelector('.dot')
let mousePos = { x: 0, y: 0 }
let mouseFollowActivated = false
$dot.style.display = 'none'

function updateMousePos(event) {
    mousePos.x = event.pageX
    mousePos.y = event.pageY
    $dot.style.left = `${mousePos.x - 25}px`
    $dot.style.top = `${mousePos.y - 25}px`
}

document.addEventListener('mousemove', (event) => {
    updateMousePos(event)
})

document.querySelector('#mouse-btn').addEventListener('click', (event) => {
    mouseFollowActivated = !mouseFollowActivated
    if (mouseFollowActivated) {
        $dot.style.display = 'inline-block'
    }
    else {
        $dot.style.display = 'none'
    }
})


// Exercice 6
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









