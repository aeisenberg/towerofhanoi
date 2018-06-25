'use strict';

// Auto solving only works with 3 towers
function startAutoSolve(startingRing, towers, moveRing, isWinState, showWinState) {
  let cancelled = false;
  const cancelAutoSolve = () => {
    cancelled = true;
  };

  /**
   * Moves a ring and all rings smaller from a tower to another tower.
   * This is the main part of the algorithm. In order to move ring N,
   * we must first move all rings above it. After ring N is moved,
   * we must move all other rings back.
   * 
   * @param  {number} number       The ring to move
   */
  async function moveN(ringNumber) {
    if (ringNumber < 1 || cancelled) {
      return;
    }

    // Use async-await in order to ensure proper timing between moves
    await moveN(ringNumber - 1);
    await moveRing(getTower(ringNumber), getTo(ringNumber));
    await moveN(ringNumber - 1);

    if (isWinState()) {
      showWinState(true);
      return;
    }
  }

  /**
   * Finds the tower that this ringNUmber is on
   * @param  {number} ringNumber the ring to look for
   * @return {tower}            the tower that holds this ring
   */
  function getTower(ringNumber) {
    return towers.find(tower => tower.rings.includes(ringNumber));
  }

  /**
   * Determines which tower this ring should be moved to.
   * 
   * @param  {number} ringNumber the ring number to move
   * @return {tower}  the tower to move to
   */
  function getTo(ringNumber) {
    let tower = getTower(ringNumber);
    let towerNum = towers.indexOf(tower);

    // if ring is even, go to next tower.
    // if odd, go to previous tower
    let isEven = Number.isInteger(ringNumber / 2);
    let nextTowerNumber = isEven ? towerNum + 1 : towerNum - 1;
    nextTowerNumber = nextTowerNumber < 0 ? towers.length - 1 : nextTowerNumber;
    nextTowerNumber = nextTowerNumber >= towers.length ? 0 : nextTowerNumber;
    return towers[nextTowerNumber];
  }

  moveN(startingRing);
  return cancelAutoSolve;



// Don't need these any more

  /**
   * A ring is considered blocked if:
   *   1. there are smaller rings on top of it
   *   2. no tower exists with only larger rings on it
   * @param  {number}  ringNumber the ring number to check
   * @return {Boolean} true if and only if this ring is blocked from being moved
   */
  function isBlocking(ringNumber, toTower) {
    let tower = getTower(ringNumber);
    return tower.rings.indexOf(ringNumber) !== 0 && 
      toTower.rings[0] <= ringNumber;
  }

  /**
   * A ring is considered blocked if:
   *   1. there are smaller rings on top of it
   *   2. no tower exists with only larger rings on it
   * @param  {number}  ringNumber the ring number to check
   * @return {number} the smallest ring number that is blocking this ring
   * or {null} if unblocked
   */
  function getBlocking(ringNumber) {
    let tower = getTower(ringNumber);
    let topMostRing = tower.rings[0];

    // top ring on current tower is smaller than this ring
    if (topMostRing !== ringNumber) {
      return topMostRing;
    }

    return toTower.rings[0] < ringNumber ? toTower.rings[0] : null;
  }

}


