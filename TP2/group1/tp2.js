"use strict";
// Exercice 1
function handleIncrement() {
    const $counterSpan = document.querySelector('#counter')
    let counterValue = parseInt($counterSpan.textContent)
    counterValue += 1
    $counterSpan.textContent = counterValue
}

function handleDecrement() {
    const $counterSpan = document.querySelector('#counter')
    let counterValue = parseInt($counterSpan.textContent)
    counterValue -= 1
    $counterSpan.textContent = counterValue
}

const $incrementBtn = document.querySelector('#incrementBtn')
const $decrementBtn = document.querySelector('#decrementBtn')
$incrementBtn.addEventListener("click", handleIncrement)
$decrementBtn.addEventListener("click", handleDecrement)


// Reset button 
const $resetBtn = document.createElement("button")
$resetBtn.textContent = "Reset"
$incrementBtn.after($resetBtn)

function resetCounter() {
    document.querySelector('#counter').textContent = 0
}
$resetBtn.addEventListener('click', resetCounter)


// Exercice 2
const $emailInput = document.querySelector('#emailInput')
const $validateBtn = document.querySelector('#validate-btn')
const $errorMessage = document.querySelector('#errorMessage')

function testEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const emailInputValue = email
    const emailCorrectementFormatte = emailRegex.test(emailInputValue);
    return emailCorrectementFormatte
}


$validateBtn.addEventListener('click', () => {
    if (testEmail($emailInput.value)) {
        $emailInput.style.borderColor = "#22c322ff"
    }
    else {
        $emailInput.style.borderColor = "red"
    }
})

$emailInput.addEventListener('input', () => {
    if (!testEmail($emailInput.value)) {
        $errorMessage.textContent = 'Email is invalid.'
    } else {
        $errorMessage.textContent = ""
    }
})


// Exercice 3
const $imagesList = document.querySelector('#images-list')
const $liElements = $imagesList.querySelectorAll('li')
const $imageContainer = document.querySelector('#image-container')

// pour chaque element de la liste imageList, recuperer pour chaque li 
// le premier lien et lui mettre un eventListener
for (const $li of $liElements) {
    const $firstLink = $li.querySelector('a')
    $firstLink.addEventListener("click", (event) => {
        event.preventDefault()
        const $img = document.createElement('img')
        $img.src = $firstLink.href
        $img.style.width = '80%'
        $imageContainer.replaceChildren($img)
    })
}


// Exercice 4 
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

updatePlayerPosition();

document.addEventListener('keydown', (event) => {
    if (event.key === "ArrowUp") {
        event.preventDefault()
        playerPosition.y = Math.max(0, playerPosition.y - 1)
        updatePlayerPosition();
    } else if (event.key === "ArrowDown") {
        event.preventDefault()
        playerPosition.y = Math.min(7, playerPosition.y + 1)
        updatePlayerPosition();
    } else if (event.key === "ArrowLeft") {
        event.preventDefault()
        playerPosition.x = Math.max(0, playerPosition.x - 1)
        updatePlayerPosition();
    } else if (event.key === "ArrowRight") {
        event.preventDefault()
        playerPosition.x = Math.min(7, playerPosition.x + 1)
        updatePlayerPosition();
    } else {
        console.log(event.key)
    }
})


// Exercice 5
let mousePos = { x: 0, y: 0 }
const $dot = document.querySelector('#dot')

const updatePosition = (hrTimeStamp) => {
    // dépend de l'écran, mais souvent 60 Hz ~ 16.67ms / cycle
    if (followMouseActivated) {
        $dot.style.display = 'inline-block'
        $dot.style.left = `${mousePos.x - 25}px`;
        $dot.style.top = `${mousePos.y - 25}px`;
    } else {
        $dot.style.display = 'none'
    }
    // pas besoin avec setTimeout
    requestAnimationFrame(updatePosition);
};
requestAnimationFrame(updatePosition);

function followMouse(event) {
    console.log({event})
    mousePos.x = event.pageX
    mousePos.y = event.pageY
}

document.addEventListener("mousemove", followMouse)

const $followButton = document.querySelector('#mouse-btn')
let followMouseActivated = true;

$followButton.addEventListener('click', (event) => {
    followMouseActivated = !followMouseActivated
})