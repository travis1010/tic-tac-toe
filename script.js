const userPlayer = createPlayer('Player', 'X', 0);
const computerPlayer = createPlayer('Computer', 'O', 0);

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
          tileDiv.setAttribute('onclick', `game.playRound(this, '${game.currentPlayer.char}')`);
          tileDiv.addEventListener('mouseover', function(e) {
            e.target.classList.add('hover-tile');
            e.target.textContent = game.currentPlayer.char;
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

  const isGameOver = (currentPlayer) => {
    adjustVictoryLine('0px', '0deg', '1');
    //check rows
    for (let i = 0; i < 3; i++) {
      if (grid[i].every(tile => tile == 'X') || grid[i].every(tile => tile == 'O')) {
        if (i == 0) {
          adjustVictoryLine('-100px');
        } else if (i == 2) {
          adjustVictoryLine('100px');
        }
        showVictoryLine();
        currentPlayer.addToScore();
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
        currentPlayer.addToScore();
        return true;
      }
      
    }
    //check diagonals
    if ((grid[0][0] === grid[1][1]) && (grid[1][1] === grid[2][2]) && (grid[1][1] != '')) {
      adjustVictoryLine('0px', '45deg', '1.3');
      showVictoryLine();
      currentPlayer.addToScore();
      return true;
    }
    if ((grid[0][2] === grid[1][1]) && (grid[1][1] === grid[2][0]) && (grid[1][1] != '')){ 
      adjustVictoryLine('0px', '-45deg', '1.3');
      showVictoryLine();
      currentPlayer.addToScore();
      return true;
    }
    //check if all tiles are filled
    if (grid.flat().every((tile) => tile != '')) {
      userPlayer.addToScore(0.5);
      computerPlayer.addToScore(0.5);
      return true;
    }
    return false;
  }

  const resetGrid = () => {
    hideVictoryLine();
    clearGrid();
    for(let i = 0; i < 3; i++) {
      for(let j = 0; j < 3; j++) {
        grid[i][j] = '';
      }
    }
    printGrid();
  }

  const showVictoryLine = () => {
    document.getElementById('victory-line').style.display = 'flex';
  }

  const hideVictoryLine = () => {
    document.getElementById('victory-line').style.display = 'none';
  }

  const adjustVictoryLine = (moveY, rotate='0deg', length='1') => {
    let victoryLine = document.getElementById('victory-line');
    victoryLine.style.transform = `rotate(${rotate}) translateY(${moveY}) scaleX(${length})`;
  }
  return { 
    printGrid,
    addCharToGrid,
    updateTile,
    isGameOver,
    grid,
    resetGrid
  }
})();

function createPlayer(name, char, score) {
  return { 
    name, 
    char, 
    score,
    changeName(newName) {
      this.name = newName;
    },
    addToScore(num = 1) {
      this.score += num;
    } 
  }
}

const AI = (() => {

    //to check if move would be a win
    const resultsInWin = (char, y, x) => {
      let grid = deepCopy(gameBoard.grid);
      grid[y][x] = char;
      
      //check rows
      for (let i = 0; i < 3; i++) {
        if (grid[i].every(tile => tile == char)) {
          return true;
        }
      }
      //check columns 
      for (let i = 0; i < 3; i++) {
        const column = [];
        for (let j = 0; j < 3; j++) {
          column.push(grid[j][i]);
        }
        if (column.every(tile => tile == char)) {
          return true;
        }
        
      }
      //check diagonals
      if ((grid[0][0] === char) && (grid[1][1] === char) && (grid[2][2] === char)) {
        return true;
      }
      if ((grid[0][2] === char) && (grid[1][1] === char) && (grid[2][0] === char)){ 
        return true;
      }

      return false;
    }

    const checkForWin = (char) => {
      let moves = getLegalMoves();
      let winningMove = null;
      moves.forEach((move) => {
        console.log('testing', move);
        if (resultsInWin(char, move[0], move[1])) {
          winningMove = move;
        }
      })
      return winningMove;
    }

    const getLegalMoves = () => {
      let grid = deepCopy(gameBoard.grid);
      let legalMoves = [];
      grid.forEach((row, yIndex) => {
        row.forEach((tile, xIndex) => {
          if (tile === '') legalMoves.push([yIndex, xIndex]);
        })
      })
      return legalMoves;
    }

    const checkCorners = () => {
      let grid = deepCopy(gameBoard.grid);
      const corners = [[0,0], [0,2], [2,0], [2,2]];
      for (let i = 0; i < 4; i++) {
        [y,x] = corners[i];
        if (grid[y][x] === '') {
          return [y,x];
        }
      }
      return null;
    }

    return {
      checkForWin,
      checkCorners
    }
})();



const game = (() => {
  
  let currentPlayer = userPlayer;
  let difficulty = 'Easy';
  
  const printCards = () => {
    document.getElementById('user-score').textContent = `${userPlayer.name}: ${userPlayer.score}`;
    document.getElementById('computer-score').textContent = `${computerPlayer.name}: ${computerPlayer.score}`;
  }


  const computerMove = () => {
    let x;
    let y;
    //easy mode for random placement
    if (difficulty === 'Easy') {
      x = Math.floor(Math.random() * 3);
      y = Math.floor(Math.random() * 3);
      while (gameBoard.grid[y][x] != '') {
        x = Math.floor(Math.random() * 3);
        y = Math.floor(Math.random() * 3);
      } 
    }
    
    if (difficulty === 'Hard') {
      // first try to place in the center
      if (gameBoard.grid[1][1] === '') {
        x = 1;
        y = 1;
      } else {
        //if theres a win available do it, then try to block a win from opponent, then try to play a corner, otherwise do random.
        if(AI.checkForWin('O')) {
          [y, x] = AI.checkForWin('O');
        } else if(AI.checkForWin('X')) {
          [y, x] = AI.checkForWin('X');
        } else if(AI.checkCorners()){
          [y, x] = AI.checkCorners();
        } else {
          x = Math.floor(Math.random() * 3);
          y = Math.floor(Math.random() * 3);
          while (gameBoard.grid[y][x] != '') {
            x = Math.floor(Math.random() * 3);
            y = Math.floor(Math.random() * 3);
          } 
        }
      }
    }
    gameBoard.addCharToGrid(computerPlayer.char, y, x);
  }

  const startGame = () => {
    gameBoard.resetGrid();
    printCards();
    //player goes first in even games, computer in odd games
    if (computerGoesFirst()) {
      computerMove();
      gameBoard.printGrid();
    }
  }

  const computerGoesFirst = () => {
    let totalGames = userPlayer.score + computerPlayer.score;
    console.log(totalGames);
    return totalGames % 2 != 0;
  }



  const playRound = (divTile) => {
    gameBoard.updateTile(divTile, userPlayer.char)
    gameBoard.printGrid();
    currentPlayer = userPlayer;
    if(gameBoard.isGameOver(currentPlayer)) {
      printCards();
      let tiles = document.querySelectorAll('.game-tile');
      [...tiles].forEach((tile) => tile.removeAttribute('onclick'));
      return;
    }
    computerMove();
    gameBoard.printGrid();
    currentPlayer = computerPlayer;
    if (gameBoard.isGameOver(currentPlayer)) {
      printCards();
      let tiles = document.querySelectorAll('.game-tile');
      [...tiles].forEach((tile) => tile.removeAttribute('onclick'));
      return;
    }
  }

 

  const hideNameForm = () => {
    document.getElementById('pop-up-name-form').style.display = 'none';
  }

  const showNameForm = () => {
    document.getElementById('pop-up-name-form').style.display = 'flex';
  }

  const changeName = (e) => {
    e.preventDefault();
    userPlayer.changeName(e.target.name.value);
    hideNameForm();
    printCards();
  }

  const toggleDifficulty = () => {
    if (difficulty === 'Easy') {
      difficulty = "Hard";
    } else {
      difficulty = 'Easy';
    }
    document.getElementById('difficulty-btn').textContent = `Difficulty: ${difficulty}`
  }

  return {
    currentPlayer,
    printCards,
    startGame,
    computerMove,
    playRound,
    hideNameForm,
    showNameForm,
    toggleDifficulty,
    changeName
  }
})();

const deepCopy = (arr) => {
  let copy = [];
  arr.forEach(elem => {
    if(Array.isArray(elem)){
      copy.push(deepCopy(elem))
    }else{
      if (typeof elem === 'object') {
        copy.push(deepCopyObject(elem))
    } else {
        copy.push(elem)
      }
    }
  })
  return copy;
}

document.getElementById('change-name-form').addEventListener('submit', game.changeName);


game.startGame();


