const Gameboard = require('../src/gameboard');
const Ship = require('../src/ship');

describe('Gameboard', () => {
  let gameboard;

  beforeEach(() => {
    gameboard = new Gameboard();
  });

  test('should place ship at specific coordinates', () => {
    const ship = new Ship(3);
    gameboard.placeShip(ship, 0, 0, 'horizontal');
    expect(gameboard.getShipAt(0, 0)).toBe(ship);
    expect(gameboard.getShipAt(1, 0)).toBe(ship);
    expect(gameboard.getShipAt(2, 0)).toBe(ship);
    expect(gameboard.getShipAt(3, 0)).toBeNull();
  });

  test('should receive attack and hit ship', () => {
    const ship = new Ship(3);
    gameboard.placeShip(ship, 0, 0, 'horizontal');
    gameboard.receiveAttack(1, 0);
    expect(ship.hits).toBe(1);
  });

  test('should receive attack and miss', () => {
    gameboard.receiveAttack(0, 0);
    expect(gameboard.getMissedAttacks()).toContainEqual([0, 0]);
  });

  test('should report if all ships are sunk', () => {
    const ship1 = new Ship(2);
    const ship2 = new Ship(3);
    gameboard.placeShip(ship1, 0, 0, 'horizontal');
    gameboard.placeShip(ship2, 0, 1, 'horizontal');
    
    gameboard.receiveAttack(0, 0);
    gameboard.receiveAttack(1, 0);
    gameboard.receiveAttack(0, 1);
    gameboard.receiveAttack(1, 1);
    gameboard.receiveAttack(2, 1);
    
    expect(gameboard.allShipsSunk()).toBe(true);
  });
});