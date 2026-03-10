// Exo 1

const resizeBtnCreator = document.querySelector('#resize-btn')
resizeBtnCreator.addEventListener('click', () => {
  const newResizeBtn = document.createElement('button')
  const fontSize = document.querySelector('#size-selector').value
  newResizeBtn.textContent = `${fontSize}px`

  newResizeBtn.addEventListener('click', (event) => {
    const content = document.querySelector('#content')
    content.style.fontSize = `${fontSize}px`
  })

  const zoneResizeBtn = document.querySelector('#zone-resize-btn')
  zoneResizeBtn.append(newResizeBtn)
})


// Exo 2

const database = [
  { name: "Alice", age: 40, sal: 2500 },
  { name: "Bob", age: 17, sal: -1 },
  { name: "Charlie", age: 30, sal: 1800 },
  { name: "Denise", age: 12, sal: -1 },
];

const personnesMajeurs = [];
for (let i = 0; i < database.length; i++) {
  if (database[i].age >= 18) {
    personnesMajeurs.push(database[i])
  }
}

database.filter(element => element.age >= 18)  // [ { name: "Alice", age: 40, sal: 2500 }, { name: "Charlie", age: 30, sal: 1800 } ]
database.map(element => element.sal)  // [ 2500, -1, 1800, -1 ]
database.find(element => element.name === "Alice")  // { name: "Alice", age: 40, sal: 2500 }
database.every(element => element.age > 10)     // true
database.every(element => element.sal > 0)      // false
database.some(element => element.sal > 2000)    // true
database.some(element => element.age > 50)      // false
database.reduce((acc, cur) => acc + cur.sal, 0) // 4298
database.reduce((acc, cur) => acc + 1, 0)       // 4
database.reduce((acc, cur) => ({ count: acc.count + 1, sum: acc.sum + cur.sal }), { count: 0, sum: 0 })
[1, 2, 3, 4].reduce((acc, cur) => acc + cur, 0)   // 10


database.filter(element => element.age >= 18)   //  [ { name: "Alice", age: 40, sal: 2500 }, { name: "Charlie", age: 30, sal: 1800 } ]
        .map(element => element.sal)  // [ 2500, 1800 ]
        .reduce((acc, cur) => acc + cur, 0)  // 4300

// Retourner true ssi toutes les personnes majeures ont un salaire supérieur à 1500.
database.filter(element => element.age >= 18)   //  [ { name: "Alice", age: 40, sal: 2500 }, { name: "Charlie", age: 30, sal: 1800 } ]
        .every(element => element.sal > 1500)

database.filter(element => element.age >= 18)   //  [ { name: "Alice", age: 40, sal: 2500 }, { name: "Charlie", age: 30, sal: 1800 } ]
        .map(element => element.sal)        
        .every(element => element > 1500)

// Retourner un tableau de chaines de la forme nom: age ne contenant que les personnes majeures.
database.filter(element => element.age >= 18)
        .map(element => `${element.name}: ${element.age}`)

// Calculer le salaire moyen des personnes majeures, avec un reduce qui compte la somme des salaires 
// et en parallèle le nombre de majeurs et une division finale.
const res = database.filter(element => element.age >= 18)
  .reduce((acc, cur) => ({ count: acc.count + 1, sum: acc.sum + cur.sal }), { count: 0, sum: 0 })
console.log(res.sum / res.count)


// Calculer l’écart type des salaires des personnes majeurs avec un reduce. On pourra utiliser 
// pour cela une équation entre la moyenne des écarts quadratiques et la moyenne des carrés pour 
// éviter de calculer la moyenne.
//
































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
