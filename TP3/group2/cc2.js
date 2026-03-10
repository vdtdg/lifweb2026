const database = [
  { city: "CUSHMAN", pop: 36_963, state: "MA" },
  { city: "BARRE", pop: 4546, state: "MA" },
  { city: "CHICOPEE", pop: 31_495, state: "MA" },
  { city: "WESTOVER AFB", pop: 1764, state: "MA" },
  { city: "BELLFLOWER", pop: 702, state: "IL" },
  { city: "CARLOCK", pop: 1066, state: "IL" },
  { city: "CHENOA", pop: 2898, state: "IL" },
  { city: "CLINTON", pop: 10_043, state: "IL" },
  { city: "COLFAX", pop: 1391, state: "IL" },
  { city: "CONGERVILLE", pop: 802, state: "IL" },
  { city: "COOKSVILLE", pop: 478, state: "IL" },
  { city: "DECATUR", pop: 9323, state: "TX" },
  { city: "ERA", pop: 264, state: "TX" },
  { city: "FORESTBURG", pop: 805, state: "TX" },
  { city: "LAKE KIOWA", pop: 24_108, state: "TX" },
  { city: "GORDONVILLE", pop: 1664, state: "TX" },
];

// Exercice 1
//
// ComplÃ©ter la fonction suivante qui calcule la population totale
// de l'Illinois (state: "IL").
//
// Pour avoir la totalitÃ© des points, l'Ã©crire de la faÃ§on la plus
// concise et fonctionnelle possible.
//
// La moitiÃ© des points est attribuÃ©e pour une solution correcte mais
// qui utilise des variables mutables ou des boucles.

const totalPopulationIL = (data) => data.filter(element => element.state === "IL")
        .map(element => element.pop)
        .reduce((acc, cur) => acc + cur, 0)
        

console.assert(totalPopulationIL(database) === 17_380);