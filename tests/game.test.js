const game = require('../src/game');
const Player = require('../src/player');
const Ship = require('../src/ship');
const Gameboard = require('../src/gameboard');

jest.mock('../src/player');
jest.mock('../src/ship');
jest.mock('../src/gameboard');

describe('Game', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();

    document.body.innerHTML = `
      <div id="message"></div>
      <div id="player-board"></div>
      <div id="computer-board"></div>
    `;

    Gameboard.prototype.placeShip = jest.fn().mockReturnValue(true);
    Gameboard.prototype.getShipAt = jest.fn();
    Gameboard.prototype.getMissedAttacks = jest.fn(() => []);
    Gameboard.prototype.allShipsSunk = jest.fn(() => false);
    Gameboard.prototype.receiveAttack = jest.fn();

    Ship.prototype.isSunk = jest.fn(() => false);

    Player.prototype.attack = jest.fn(() => true);
    Player.prototype.gameboard = new Gameboard();
  });

  afterEach(() => {
    jest.useRealTimers();
  });
  test('init should create players and place ships', () => {
    game.init();
    expect(Player).toHaveBeenCalledTimes(2);
    expect(Gameboard.prototype.placeShip).toHaveBeenCalled();
  });

  test('renderGameboards should create cells for both boards', () => {
    game.init();
    const playerBoard = document.getElementById('player-board');
    const computerBoard = document.getElementById('computer-board');
    expect(playerBoard.children.length).toBe(100);
    expect(computerBoard.children.length).toBe(100);
  });

  test('clicking on computer board should trigger an attack', () => {
    game.init();
    const computerBoard = document.getElementById('computer-board');
    const firstCell = computerBoard.firstChild;
    firstCell.click();
    expect(Player.prototype.attack).toHaveBeenCalled();
  });

  test('game should switch players after a successful attack', () => {
    game.init();
    const computerBoard = document.getElementById('computer-board');
    const firstCell = computerBoard.firstChild;
    firstCell.click();
    expect(setTimeout).toHaveBeenCalledTimes(0);
    expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 500);
  });

  test('game should announce winner when all ships are sunk', () => {
    game.init();
    Gameboard.prototype.allShipsSunk.mockReturnValueOnce(true);
    const computerBoard = document.getElementById('computer-board');
    const firstCell = computerBoard.firstChild;
    firstCell.click();
    const message = document.getElementById('message');
    expect(message.textContent).toBe('Player wins!');
  });
  test('setupShipPlacement should create a form for ship placement', () => {
    game.init();
    const form = document.querySelector('form');
    expect(form).toBeTruthy();
    expect(form.innerHTML).toContain('Place your Carrier (length: 5)');
  });

  test('placeShip should place a ship and move to the next ship', () => {
    game.init();
    const form = document.querySelector('form');
    const event = new Event('submit');
    
    document.getElementById('x-coord').value = '0';
    document.getElementById('y-coord').value = '0';
    document.getElementById('orientation').value = 'horizontal';
    
    form.dispatchEvent(event);

    expect(Gameboard.prototype.placeShip).toHaveBeenCalledWith(expect.any(Ship), 0, 0, 'horizontal');
    expect(form.innerHTML).toContain('Place your Battleship (length: 4)');
  });

  test('placeShip should show an alert for invalid placement', () => {
    game.init();
    const form = document.querySelector('form');
    const event = new Event('submit');
    
    Gameboard.prototype.placeShip.mockReturnValueOnce(false);
    
    document.getElementById('x-coord').value = '9';
    document.getElementById('y-coord').value = '9';
    document.getElementById('orientation').value = 'horizontal';
    
    const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});
    
    form.dispatchEvent(event);

    expect(alertMock).toHaveBeenCalledWith('Invalid placement. Try again.');
    expect(form.innerHTML).toContain('Place your Carrier (length: 5)');
    
    alertMock.mockRestore();
  });

  test('game should start after all ships are placed', () => {
    game.init();
    const form = document.querySelector('form');
    const event = new Event('submit');
    
    for (let i = 0; i < 5; i++) {
      document.getElementById('x-coord').value = i.toString();
      document.getElementById('y-coord').value = '0';
      document.getElementById('orientation').value = 'horizontal';
      form.dispatchEvent(event);
    }

    expect(document.querySelector('form')).toBeNull();
    expect(document.getElementById('computer-board').onclick).toBeTruthy();
  });
});