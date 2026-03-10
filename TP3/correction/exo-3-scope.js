
// Code naif
for (var i = 0; i < 3; i++) {
  setTimeout(function() {
    console.log(i);
  }, i * 100);
}
// Sortie attendue : 0, 1, 2 (affichés à 0ms, 100ms, 200ms)  
// Sortie réelle  3, 3, 3

// var a une portée de fonction, pas de portée de bloc
// i est partagée entre toutes les itérations de la boucle.
// Les callbacks de setTimeout s'exécutent après la fin de la boucle
// Au moment où le premier timeout se déclenche (même à 0ms), la boucle s'est déjà terminée et i a été incrémenté à 3. 
// Les trois callbacks référencent le même i, qui contient maintenant 3.
// -> https://www.jsv9000.app/ permet de voir comment s'empilent des callback dans l'event loop de javascript
// possible de copier / coller le code
// 
// - La boucle s'exécute : `i=0` → planifie un callback, `i=1` → planifie un callback, `i=2` → planifie un callback
// - La condition de la boucle échoue : `i=3`
// - La boucle se termine
// - **Maintenant** les callbacks commencent à s'exécuter, et ils cherchent tous `i`, qui vaut `3`

// Solution 1 : Utiliser `let`
for (let i = 0; i < 3; i++) {
  setTimeout(function() {
    console.log(i);
  }, i * 100);
}

// `let` a une portée de bloc. Chaque callback obtient sa propre copie de i de son itération spécifique.

// Solution 2 : Créer une Closure Immediately Invoked Function Expression (IIFE) - vu en cours

for (var i = 0; i < 3; i++) {
  (function(capturedI) {
    setTimeout(function() {
      console.log(capturedI);
    }, capturedI * 100);
  })(i);
}

// Une IIFE crée une nouvelle portée pour chaque itération. 
// La valeur de i est passée comme capturedI, qui est une nouvelle variable dans la portée de la fonction. 
// Le callback du timeout ferme sur capturedI, pas sur i, chaque callback a sa propre copie privée.

// Solution 2 Alternative : Fonction Factory

function makeLogger(value) {
  return function() {
    console.log(value);
  };
}

for (var i = 0; i < 3; i++) {
  setTimeout(makeLogger(i), i * 100);
}

// Montre le pattern factory que vous enseignez. `makeLogger` crée une fermeture qui capture value, 
// donnant à chaque callback sa propre copie indépendante.
