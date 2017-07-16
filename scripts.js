'use strict';

const MOVE_SPEED_MS = 10;
let towers;
let firstSelected;
let cancelAutoSolve = () => {};

document.querySelector('#num-towers').addEventListener('change', createTowersAndRings);
document.querySelector('#num-rings').addEventListener('change', createTowersAndRings);
document.querySelector('#do-auto-solve').addEventListener('click', () => {
  createTowersAndRings();
  cancelAutoSolve = startAutoSolve(getNumberOfRings(), towers, moveRing, isWinState, showWinState);
  document.querySelector('#stop-auto-solve').classList.remove('action-hidden');  
  document.querySelector('#do-auto-solve').classList.add('action-hidden');  
});
document.querySelector('#stop-auto-solve').addEventListener('click', () => {
  cancelAutoSolve();
  showError();
  document.querySelector('#do-auto-solve').classList.remove('action-hidden');  
  document.querySelector('#stop-auto-solve').classList.add('action-hidden');  
});

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
  cancelAutoSolve();
  let numTowers = getNumberOfTowers();
  let numRings = getNumberOfRings();

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
  resetMoveCounter();
  displayMessages();
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
  const isWin = isWinState();
  showWinState(isWin);
  if (isWin) {
    resetMoveCounter();
  }
}

function moveRing(from, to) {
  let fromRings = from.rings;
  let toRings = to.rings;

  if (!toRings[0] || fromRings[0] < toRings[0]) {
    toRings.unshift(fromRings.shift());
    displayRings();
    showError();
    incrementMoveCounter();
  } else {
    showError('Illegal move');
  }

  // Used to ensure proper timing between moves.
  return new Promise((resolve, reject) => {
    setTimeout(resolve, MOVE_SPEED_MS);
  });
}

let errorTimeout;
function showError(message = '') {
  clearTimeout(errorTimeout);
  document.querySelector('#error').innerHTML = message;
  errorTimeout = setTimeout(() => document.querySelector('#error').innerHTML = '', 3000);
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
      ring.style['background-color'] = `rgb(${255 - (20 * ringNum)}, ${184 + (ringNum * 20)}, ${162 + (ringNum * 20)})`;
    });
  });
}

function incrementMoveCounter() {
  document.querySelector('#move-counter').innerHTML = (Number(document.querySelector('#move-counter').innerHTML) || 0) + 1;
}

function resetMoveCounter() {
  document.querySelector('#move-counter').innerHTML = 0;
}

/**
 * A winning state is defined as having all rings on a single non-zero tower
 * @return {Boolean} true if and only if the current configuraiton of rings
 * is a winning configuration.
 */
function isWinState() {
  const numRings = getNumberOfRings();
  return towers.some((tower, cnt) => {
    if (cnt === 0) {
      return;
    }
    return tower.rings.length === numRings;
  });
}

function getNumberOfRings() {
  return Number(document.querySelector('#num-rings').value) || 0;
}

function getNumberOfTowers() {
  return Number(document.querySelector('#num-towers').value) || 0;
}

function showWinState(isWin) {
  const toAdd = isWin ? 'show-win' : 'hide-win';
  const toRemove = isWin ? 'hide-win' : 'show-win';
  document.querySelector('#you-win').classList.add(toAdd);
  document.querySelector('#you-win').classList.remove(toRemove);
}