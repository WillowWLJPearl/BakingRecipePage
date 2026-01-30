
let datamap = new Map();

function readData() {
const paramsString = window.location.search;
const searchParams = new URLSearchParams(paramsString);

for (const p of searchParams) {
  datamap.set(p[0], p[1]);
}
console.log(datamap);
}

readData();
let storageFormat = localStorage.getItem('data') || {};
storageFormat[datamap.text] = datamap
localStorage.setItem('data', storageFormat);


console.log(localStorage.getItem('data')['text']);