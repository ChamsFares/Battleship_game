const Ship = require('../src/ship');

describe('ship', () => {
    let ship;
    
    beforeEach(() => {
        ship = new Ship(3);
    });

    test('should create a ship with the correct length', () => {
        expect(ship.length).toBe(3);
    });
    test('should starts with 0 hits', () => {
        expect(ship.hits).toBe(0);
    });
    test('hit() should increase the number of hit', () => {
        ship.hit();
        expect(ship.hits).toBe(1);
    });
    test('isSunk() should return false when hits are less than length', () => {
        ship.hit();
        ship.hit();
        expect(ship.isSunk()).toBe(false);
    });
    test('isSunk() should return true when hits equal length', () => {
        ship.hit();
        ship.hit();
        ship.hit();
        expect(ship.isSunk()).toBe(true);
    })
});