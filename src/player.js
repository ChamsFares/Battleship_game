const Gameboard = require('./gameboard');

class Player {
  constructor(isComputer = false) {
    this.gameboard = new Gameboard();
    this.isComputer = isComputer;
    this.attackedCoordinates = new Set();
  }

  attack(enemyGameboard, x, y) {
    if (this.isComputer) {
      [x, y] = this.getRandomCoordinates();
    }
    
    if (this.attackedCoordinates.has(`${x},${y}`)) {
      return false;
    }

    this.attackedCoordinates.add(`${x},${y}`);
    enemyGameboard.receiveAttack(x, y);
    return true;
  }

  getRandomCoordinates() {
    let x, y;
    do {
      x = Math.floor(Math.random() * 10);
      y = Math.floor(Math.random() * 10);
    } while (this.attackedCoordinates.has(`${x},${y}`));
    return [x, y];
  }
}

module.exports = Player;