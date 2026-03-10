function addResizer(_event) {
  const $button = document.createElement("button");
  const $resizerBtns = document.querySelector("#resizer-btns");
  const value = document.querySelector("#size-selector").value;

  $button.textContent = `Taille ${value}`;
  $button.addEventListener("click", function () {
    const $content = document.querySelector("#content");
    $content.style.fontSize = `${value}pt`;
  });
  $resizerBtns.append($button);
}

const $addResizerButton = document.querySelector("#add-resizer");
$addResizerButton.addEventListener("click", addResizer);
