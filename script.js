const gameBoard = (() => {
  const grid = [['', '', ''],
                ['', '', ''],
                ['', '', '']];

  const printGrid = () => {
    clearGrid();
    grid.forEach((row, rowIndex) => {
      row.forEach((tile, columnIndex) => {
        let tileDiv = document.createElement('div');
        tileDiv.classList.add('game-tile');
        tileDiv.setAttribute('data-y', rowIndex);
        tileDiv.setAttribute('data-x', columnIndex);
        tileDiv.textContent = tile;
    
        //add onclick attriburte and hover effect for blank tiles
        if(tile === ''){
          tileDiv.setAttribute('onclick', `gameBoard.updateTile(this, '${currentPlayer}')`);
          tileDiv.addEventListener('mouseover', function(e) {
            e.target.classList.add('hover-tile');
            e.target.textContent = currentPlayer;
          });
          tileDiv.addEventListener('mouseout', function(e) {
            e.target.classList.remove('hover-tile');
            e.target.textContent = '';
          });
        }
        document.getElementById('game-board').appendChild(tileDiv);
      })
    })
  };

  const updateTile = (tileDiv, char) => {
    addCharToGrid(char, tileDiv.getAttribute('data-y'), tileDiv.getAttribute('data-x'))
    printGrid();
    console.log(isGameOver());
  };

  const clearGrid = () => {
    const gameGrid = document.getElementById('game-board');
    while (gameGrid.firstChild) {
      gameGrid.removeChild(gameGrid.firstChild)
    }
  };

  const addCharToGrid = (char, row, column) => {
    grid[row][column] = char;
  };

  const isGameOver = () => {
    //check rows
    for (let i = 0; i < 3; i++) {
      if (grid[i].every(tile => tile == 'X') || grid[i].every(tile => tile == 'O')) {
        if (i == 0) {
          adjustVictoryLine('-100px');
        } else if (i == 2) {
          adjustVictoryLine('100px');
        }
        
        showVictoryLine();
        return true;
      }
    }
    //check columns 
    for (let i = 0; i < 3; i++) {
      const column = [];
      for (let j = 0; j < 3; j++) {
        column.push(grid[j][i]);
      }
      if (column.every(tile => tile == 'X') || column.every(tile => tile == 'O')) {
        if (i == 0) {
          adjustVictoryLine('-100px', '-90deg');
        } else if (i == 1) {
          adjustVictoryLine('0px', '-90deg');
        } else if (i == 2) {
          adjustVictoryLine('100px', '-90deg');
        }
        showVictoryLine();
        return true;
      }
      
    }
    //check diagonals
    if ((grid[0][0] == grid[1][1]) && (grid[1][1] == grid[2][2]) && (grid[1][1] != '')) {
      adjustVictoryLine('0px', '45deg', '1.3');
      showVictoryLine();
      return true;
    }
    if ((grid[0][2] == grid[1][1]) && (grid[1][1] == grid[2][0]) && (grid[1][1] != '')){ 
      adjustVictoryLine('0px', '-45deg', '1.3');
      showVictoryLine();
      return true;
    }
    return false;
  }

  const showVictoryLine = () => {
    document.getElementById('victory-line').style.display = 'flex';
  }

  const adjustVictoryLine = (moveY, rotate='0deg', length='1') => {
    let victoryLine = document.getElementById('victory-line');
    victoryLine.style.transform = `rotate(${rotate}) translateY(${moveY}) scaleX(${length})`;
  }
  return { 
    printGrid,
    addCharToGrid,
    updateTile,
    isGameOver }
})();

let currentPlayer = 'O';

gameBoard.printGrid();




