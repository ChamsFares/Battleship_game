class Gameboard {
  constructor() {
    this.ships = [];
    this.missedAttacks = [];
    this.board = Array(10).fill(null).map(() => Array(10).fill(null));
  }

  placeShip(ship, x, y, orientation) {
    if (this.isValidPlacement(ship, x, y, orientation)) {
      if (orientation === 'horizontal') {
        for (let i = 0; i < ship.length; i++) {
          this.board[y][x + i] = ship;
        }
      } else {
        for (let i = 0; i < ship.length; i++) {
          this.board[y + i][x] = ship;
        }
      }
      this.ships.push(ship);
      return true;
    }
    return false;
  }

  isValidPlacement(ship, x, y, orientation) {
    if (orientation === 'horizontal') {
      if (x + ship.length > 10) return false;
      for (let i = 0; i < ship.length; i++) {
        if (this.board[y][x + i] !== null) return false;
      }
    } else {
      if (y + ship.length > 10) return false;
      for (let i = 0; i < ship.length; i++) {
        if (this.board[y + i][x] !== null) return false;
      }
    }
    return true;
  }

  getShipAt(x, y) {
    return this.board[y][x];
  }

  receiveAttack(x, y) {
    const ship = this.board[y][x];
    if (ship) {
      ship.hit();
    } else {
      this.missedAttacks.push([x, y]);
    }
  }

  getMissedAttacks() {
    return this.missedAttacks;
  }

  allShipsSunk() {
    return this.ships.every(ship => ship.isSunk());
  }
}

module.exports = Gameboard;