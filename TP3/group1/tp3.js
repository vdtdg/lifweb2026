// Exo 1 - avec fermetures
const resizeBtn = document.querySelector('#resize-btn')
resizeBtn.addEventListener('click', (createResizeButtonEvent) => {
  const newResizeBtn = document.createElement('button')
  const sizeSelectorValue = document.querySelector('#size-selector').value

  newResizeBtn.textContent = `${sizeSelectorValue}px`

  newResizeBtn.addEventListener('click', (resizeEvent) => {
    const content = document.querySelector('#content')
    content.style.fontSize = `${sizeSelectorValue}px`
  })

  const btnZone = document.querySelector('#resize-btn-zone')
  btnZone.append(newResizeBtn)
})


// Exo 2
const database = [
  { name: "Alice", age: 40, sal: 2500 },
  { name: "Bob", age: 17, sal: -1 },
  { name: "Charlie", age: 30, sal: 1800 },
  { name: "Denise", age: 12, sal: -1 },
];

// Exemples
database.forEach(element => {})
database.every(element => element.sal > 0) // false
database.some(element => element.sal > 0) // true
database.find(element => element.name === 'Alice')  // { name: "Alice", age: 40, sal: 2500 }
database.filter(element => element.age >= 18)     // [ { name: "Alice", age: 40, sal: 2500 }, { name: "Charlie", age: 30, sal: 1800 }]
database.map(element => element.sal)  // [ 2500, -1, 1800, -1 ]
database.reduce((current, accumulator) => {}, 0)



// Retourner true ssi toutes les personnes majeures ont un salaire supérieur à 1500.
database.filter(element => element.age >= 18)  // [ { name: "Alice", age: 40, sal: 2500 }, { name: "Charlie", age: 30, sal: 1800 }]
        .map(element => element.sal)           // [ 2500, 1800 ]
        .every(sal => sal > 1500)              // true

// Retourner un tableau de chaines de la forme nom: age ne contenant que les personnes majeures.
// Valeur attendue sur l’exemple : [ 'Alice: 40', 'Charlie: 30' ]
let res = database.filter(element => element.age >= 18)  // [ { name: "Alice", age: 40, sal: 2500 }, { name: "Charlie", age: 30, sal: 1800 }]
                    .map(element => `${element.name}: ${element.age}`) 


// Calculer le salaire moyen des personnes majeures, avec un reduce qui compte la somme des salaires et en parallèle 
// le nombre de majeurs et une division finale.
console.log("Exo 2")
res = database.filter(element => element.age >= 18)  // [ { name: "Alice", age: 40, sal: 2500 }, { name: "Charlie", age: 30, sal: 1800 }]
              .reduce(({ sum, count }, person) => ({ sum: sum + person.sal, count: count + 1 }), { sum: 0, count: 0 })
console.log(res.sum / res.count)


















// Exo 3
function chrono(fct) {
  // c.f. https://javascript.info/rest-parameters-spread
  return function (...args) {
    const start = Date.now();
    const res = fct(...args);
    const end = Date.now();
    console.info(`${fct.name}(...) executed in ${end - start}ms`);
    return res;
  };
}

/**
 * Fonctions utilisables pour tester les décorateurs de l'exo 4
 */
function add(a, b) {
  return a + b;
}

function sayHello(name) {
  if (name != undefined) return "Hello " + name;
  return undefined;
}
