

let towers;
let firstSelected;


document.querySelector('#num-towers').addEventListener('change', createTowersAndRings);
document.querySelector('#num-rings').addEventListener('change', createTowersAndRings);
createTowersAndRings();
displayMessages();

function addTowerListeners() {
  towers.forEach(tower => {
    tower.addEventListener('click', event => {
      if (!firstSelected) {
        firstSelected = tower;
        displayMessages(firstSelected);
      } else if (firstSelected === tower) {
        firstSelected = undefined;
        displayMessages();
      } else {
        moveRing(firstSelected, tower);
        firstSelected = undefined;
        displayMessages();
      }
    });
  });
}



function createTowersAndRings() {
  let numTowers = document.querySelector('#num-towers').value;
  let numRings = document.querySelector('#num-rings').value;

  // delete all old
  let canvas = document.querySelector('.canvas');
  document.querySelectorAll('.tower').forEach(tower => canvas.removeChild(tower));
  document.querySelectorAll('.ring').forEach(ring => canvas.removeChild(ring));

  towers = [];
  for (let cnt = 1; cnt <= numTowers; cnt++) {
    towers.push(createTower(cnt, canvas));
  }
  for (let cnt = 1; cnt <= numRings; cnt++) {
    createRing(cnt, canvas);
  }
  // all rings on tower 0 initially
  for (let cnt = 1; cnt <= numRings; cnt++) {
    towers[0].rings.push(cnt);
  }

  addTowerListeners();
  displayRings();
}


function createTower(num, parent) {
  let base = document.createElement('div');
  base.classList.add('base');
  
  let tower = document.createElement('div');
  tower.classList.add('tower');
  tower.id = `tower${num}`;
  tower.style.left = `${100 + (num * 300)}px`;
  tower.appendChild(base);

  parent.appendChild(tower);
  tower.rings = [];
  return tower;
}

function createRing(num, parent) {
  let ring = document.createElement('div');
  ring.classList.add('ring');
  ring.id = `ring${num}`;

  parent.appendChild(ring);
  return ring;
}

function displayMessages(selected) {
  let selectedDisplayer = document.querySelector('#selected');
  towers.forEach(tower => tower.classList.remove('selected'));
  if (selected) {
    selectedDisplayer.innerHTML = `Move a ring from ${selected.title}`;
    selected.classList.add('selected');
  } else {
    selectedDisplayer.innerHTML = `Nothing selected`;
  }
}

function moveRing(from, to) {
  let fromRings = from.rings;
  let toRings = to.rings;

  if (!toRings[0] || fromRings[0] < toRings[0]) {
    toRings.unshift(fromRings.shift());
    displayRings();
    showError();
  } else {
    showError('Illegal move');
  }
}

function showError(message = '') {
  document.querySelector('#error').innerHTML = message;
  setTimeout(() => document.querySelector('#error').innerHTML = '', 3000);
}

function displayRings() {
  towers.forEach((tower, i) => {
    tower.style.left = `${200 + (300 * i)}px`;
    let numRings = tower.rings.length;
    tower.rings.forEach((ringNum, j) => {
      let ring = document.querySelector(`#ring${ringNum}`);
      ring.style.top = `${410 + (-30 * (numRings - j))}px`;
      ring.style.width = `${80 + (20 * ringNum)}px`;
      ring.style.left = `${170 + (-10 * ringNum) + (300 * i)}px`;
      ring.style['background-color'] = `rgba(${255 - (20 * ringNum)}, ${184 + (ringNum * 20)}, ${162 + (ringNum * 20)})`;
    });
  });
}