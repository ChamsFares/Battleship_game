const Player = require('../src/player');
const Gameboard = require('../src/gameboard');

describe('Player', () => {
  let player;
  let enemyGameboard;

  beforeEach(() => {
    player = new Player();
    enemyGameboard = new Gameboard();
  });

  test('should create a player with a gameboard', () => {
    expect(player.gameboard).toBeInstanceOf(Gameboard);
  });

  test('should attack enemy gameboard', () => {
    const attackSpy = jest.spyOn(enemyGameboard, 'receiveAttack');
    player.attack(enemyGameboard, 0, 0);
    expect(attackSpy).toHaveBeenCalledWith(0, 0);
  });

  test('should not allow attacking the same coordinates twice', () => {
    player.attack(enemyGameboard, 0, 0);
    expect(player.attack(enemyGameboard, 0, 0)).toBe(false);
  });

  test('computer player should make random legal moves', () => {
    const computerPlayer = new Player(true);
    const attackSpy = jest.spyOn(enemyGameboard, 'receiveAttack');
    
    for (let i = 0; i < 100; i++) {
      computerPlayer.attack(enemyGameboard);
    }

    expect(attackSpy).toHaveBeenCalledTimes(100);
    expect(computerPlayer.attackedCoordinates.size).toBe(100);
  });
});