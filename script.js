const suits = ['♥', '♦', '♣', '♠'];
const RED_CLASS = 'red';
const EMPTY_STRING = '';

function getRandomSuit() {
  return suits[Math.floor(Math.random() * suits.length)];
}

class GameBoard {
  constructor(rows, cols) {
    this.rows = rows;
    this.cols = cols;
    this.resetBoard();
    this.render();

    const resetButton = document.createElement('button');
    resetButton.classList.add('restart-button');
    resetButton.textContent = 'Restart Game';
    resetButton.addEventListener('click', () => this.resetBoardAndRender());
    document.body.appendChild(resetButton);
  }

  resetBoard() {
    this.board = this.generateRandomBoard();
  }

  resetBoardAndRender() {
    this.resetBoard();
    this.render();
  }

  generateRandomBoard() {
    const board = [];

    for (let row = 0; row < this.rows; row++) {
      const rowCells = [];
      for (let col = 0; col < this.cols; col++) {
        const randomSuit = getRandomSuit();
        rowCells.push({
          id: `${row}-${col}`,
          suit: randomSuit,
        });
      }
      board.push(rowCells);
    }

    return board;
  }

  isValidCell(row, col, clickedSuit) {
    const cell = this.board[row] && this.board[row][col];
    return (
      row >= 0 && col >= 0 &&
      row < this.rows && col < this.cols &&
      cell && cell.suit === clickedSuit
    );
  }

  findGroup(row, col, clickedSuit) {
    const group = [];
    const stack = [{ row, col }];

    while (stack.length > 0) {
      const { row, col } = stack.pop();

      if (this.isValidCell(row, col, clickedSuit)) {
        group.push({ row, col });
        this.board[row][col] = null;

        stack.push({ row: row + 1, col });
        stack.push({ row: row - 1, col });
        stack.push({ row, col: col + 1 });
        stack.push({ row, col: col - 1 });
      }
    }

    return group;
  }

  handleCellClick(row, col) {
    const clickedSuit = this.board[row][col].suit;
    const groupToRemove = this.findGroup(row, col, clickedSuit);

    groupToRemove.forEach(({ row, col }) => {
      this.board[row][col] = null;
    });

    this.render();
  }

  render() {
    const gameBoardElement = document.getElementById('game-board');
    gameBoardElement.innerHTML = EMPTY_STRING;

    this.board.forEach((row, rowIndex) => {
      const rowElement = document.createElement('div');
      rowElement.className = 'row';

      row.forEach((cell, colIndex) => {
        const cellElement = document.createElement('div');
        cellElement.className = `cell ${cell && (
          cell.suit === '♥' || cell.suit === '♦'
        ) && RED_CLASS}`;

        cellElement.textContent = cell ? cell.suit : EMPTY_STRING;

        cellElement.addEventListener('click',
          () => cell && this.handleCellClick(rowIndex, colIndex));

        rowElement.appendChild(cellElement);
      });

      gameBoardElement.appendChild(rowElement);
    });
  }
}

const game = new GameBoard(7, 6);
