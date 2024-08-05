// src/game.js
const Player = require('./player');
const Ship = require('./ship');

const game = (() => {
  let player;
  let computer;
  let currentPlayer;
  const ships = [
    { name: 'Carrier', length: 5 },
    { name: 'Battleship', length: 4 },
    { name: 'Cruiser', length: 3 },
    { name: 'Submarine', length: 3 },
    { name: 'Destroyer', length: 2 }
  ];
  let currentShipIndex = 0;

  const init = () => {
    player = new Player();
    computer = new Player(true);
    currentPlayer = player;
    renderGameboards();
    setupShipPlacement();
  };

  const setupShipPlacement = () => {
    const form = document.createElement('form');
    form.innerHTML = `
      <h2>Place your ${ships[currentShipIndex].name} (length: ${ships[currentShipIndex].length})</h2>
      <input type="number" id="x-coord" placeholder="X coordinate" min="0" max="9" required>
      <input type="number" id="y-coord" placeholder="Y coordinate" min="0" max="9" required>
      <select id="orientation">
        <option value="horizontal">Horizontal</option>
        <option value="vertical">Vertical</option>
      </select>
      <button type="submit">Place Ship</button>
    `;
    form.addEventListener('submit', placeShip);
    document.body.appendChild(form);
  };

  const placeShip = (e) => {
    e.preventDefault();
    const x = parseInt(document.getElementById('x-coord').value);
    const y = parseInt(document.getElementById('y-coord').value);
    const orientation = document.getElementById('orientation').value;
    const ship = new Ship(ships[currentShipIndex].length);
    
    if (player.gameboard.placeShip(ship, x, y, orientation)) {
      currentShipIndex++;
      renderGameboards();
      if (currentShipIndex < ships.length) {
        setupShipPlacement();
      } else {
        document.body.removeChild(document.querySelector('form'));
        placeComputerShips();
        startGame();
      }
    } else {
      alert('Invalid placement. Try again.');
    }
  };

  const placeComputerShips = () => {
    ships.forEach(shipInfo => {
      let placed = false;
      while (!placed) {
        const x = Math.floor(Math.random() * 10);
        const y = Math.floor(Math.random() * 10);
        const orientation = Math.random() < 0.5 ? 'horizontal' : 'vertical';
        const ship = new Ship(shipInfo.length);
        placed = computer.gameboard.placeShip(ship, x, y, orientation);
      }
    });
  };

  const startGame = () => {
    const computerBoard = document.getElementById('computer-board');
    computerBoard.addEventListener('click', handleAttack);
  };

  const handleAttack = (e) => {
    if (currentPlayer !== player) return;
    const cell = e.target;
    const x = parseInt(cell.dataset.x);
    const y = parseInt(cell.dataset.y);
    playTurn(x, y);
  };

  const playTurn = (x, y) => {
    const targetGameboard = currentPlayer === player ? computer.gameboard : player.gameboard;
    if (currentPlayer.attack(targetGameboard, x, y)) {
      renderGameboards();
      if (checkGameOver()) {
        announceWinner();
      } else {
        switchPlayer();
      }
    }
  };

  const switchPlayer = () => {
    currentPlayer = currentPlayer === player ? computer : player;
    if (currentPlayer === computer) {
      setTimeout(computerPlay, 500);
    }
  };

  const computerPlay = () => {
    playTurn();
  };

  const checkGameOver = () => {
    return player.gameboard.allShipsSunk() || computer.gameboard.allShipsSunk();
  };

  const announceWinner = () => {
    const winner = player.gameboard.allShipsSunk() ? 'Computer' : 'Player';
    document.getElementById('message').textContent = `${winner} wins!`;
  };

  const renderGameboards = () => {
    renderGameboard('player-board', player.gameboard, true);
    renderGameboard('computer-board', computer.gameboard, false);
  };

  const renderGameboard = (boardId, gameboard, isPlayerBoard) => {
    const board = document.getElementById(boardId);
    board.innerHTML = '';

    for (let y = 0; y < 10; y++) {
      for (let x = 0; x < 10; x++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');

        const ship = gameboard.getShipAt(x, y);
        if (ship && (isPlayerBoard || ship.isSunk())) {
          cell.classList.add('ship');
        }

        if (gameboard.getMissedAttacks().some(([mx, my]) => mx === x && my === y)) {
          cell.classList.add('missed');
        }

        if (ship && ship.hits > 0) {
          cell.classList.add('hit');
        }

        if (!isPlayerBoard) {
          cell.addEventListener('click', () => playTurn(x, y));
        }

        board.appendChild(cell);
      }
    }
  };

  return {
    init,
    setupShipPlacement,
    placeShip,
    startGame,
  };

})();

module.exports = game