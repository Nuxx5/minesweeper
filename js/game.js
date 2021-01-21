// TODO: 3 Lives + all the bonuses + better CSS design


'use strict'
const MINE = '💣'
const FLAG = '⛳'
const SMILEY = '😀'
const CLOUD = '🤯'
const SUNGLASSES = '😎'
const EMPTY = ''

var gLives = 3;
var gElEmoji = document.querySelector('.emoji');
var gStartTime;
var gTimerInterval;
var gElTimer = document.querySelector('.timer span');
var gBoard;
var gTurn = 0;
var gLevel = {

    SIZE: 4,
    MINES: 2
};
var gGame = {
    isOn: false,
    shownCount: 0, markedCount: 0, secsPassed: 0
};

// disable right click menu
document.addEventListener('contextmenu', event => event.preventDefault());

// initialize the game
function initGame() {
    console.log('hello')
    gGame.isOn = true
    gBoard = buildBoard(gLevel.SIZE)
    setMinesNegsCount(gBoard)
    renderBoard(gBoard)
    resetTimer()
}

// build the board
function buildBoard(size) {
    var board = []
    for (var i = 0; i < size; i++) {
        board[i] = [];
        for (var j = 0; j < size; j++) {
            var cell = { pos: { i: i, j: j }, minesAroundCount: 0, isShown: false, isMine: false, isMarked: false };
            board[i][j] = cell;
        }
    }
    return board;
}

// render the board
function renderBoard(board) {
    var strHTML = '';
    for (var i = 0; i < board.length; i++) {
        strHTML += `<tr class="board" >`
        for (var j = 0; j < board[0].length; j++) {
            var cell = board[i][j];
            var className = ''
            // for cell of type MINE add mine class
            strHTML += `<td id="cell-${i}-${j}" class="cell ${className}"
                            onclick="cellClicked(this, ${i}, ${j})" oncontextmenu="cellMarked(this, ${i}, ${j})" >
                            </td>`
        }
        strHTML += `</tr>`
    }
    var elContainer = document.querySelector('.minesweeper');
    elContainer.innerHTML = strHTML;
}

// set the neighbor mines value per each cell
function setMinesNegsCount(board) {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            if (!board[i][j].isMine) board[i][j].minesAroundCount = cellMineNegsCount(board, i, j);
        }
    }
    return board;
}

// count neighbor mines around each cell
function cellMineNegsCount(board, i, j) {
    var pos = { i: i, j: j }
    var count = 0;
    for (var i = pos.i - 1; i <= pos.i + 1; i++) {
        if (i < 0 || i > board.length - 1) continue
        for (var j = pos.j - 1; j <= pos.j + 1; j++) {
            if (j < 0 || j > board[0].length - 1) continue
            if (i === pos.i && j === pos.j) continue
            var currCell = board[i][j]
            if (currCell.isMine) count++
        }
    }
    return count
}

// Called when a cell (td) is clicked
function cellClicked(elCell, i, j) {
    var cell = gBoard[i][j];
    if (!gGame.isOn) return
    if (cell.isMarked) return
    if (cell.isShown === true) return
    cell.isShown = true
    gTurn++
    gGame.shownCount++
    elCell.classList.add("shown");
    if (cell.isMine === true) elCell.innerText = MINE;
    if (cell.minesAroundCount > 0 && cell.isMine === false) elCell.innerText = cell.minesAroundCount
    if (cell.minesAroundCount === 0) {
        elCell.innerText =''
        expandShown(gBoard, elCell, i, j)
    }
    checkGameOver(cell)
    if (gTurn === 1) {
        startTimer();
        createRandomMines(gLevel);
    }
}

// called when a cell is marked with a flag
function cellMarked(elCell, i, j) {
    var cell = gBoard[i][j]
    if (!gGame.isOn) return
    if (cell.isShown) return
    if (cell.isMarked === true) {
        cell.isMarked = false
        elCell.innerText = ''
        gGame.markedCount--
    }
    else {
        cell.isMarked = true;
        elCell.innerText = FLAG;
        gGame.markedCount++
    }
    checkGameOver(cell)
}
// expand shown cells around clicked cell
function expandShown(board, elCell, i, j) {
    var pos = { i: i, j: j }
    for (var i = pos.i - 1; i <= pos.i + 1; i++) {
        if (i < 0 || i > board.length - 1) continue
        for (var j = pos.j - 1; j <= pos.j + 1; j++) {
            if (j < 0 || j > board[0].length - 1) continue
            if (i === pos.i && j === pos.j) continue
            var currCell = board[i][j]
            if (currCell.isShown === true) continue
            if (currCell.isMarked === true) continue
                currCell.isShown = true
                gGame.shownCount++
                var currElCell = document.getElementById(`cell-${i}-${j}`)
                currElCell.classList.add("shown");
                if (currCell.minesAroundCount > 0) currElCell.innerText = currCell.minesAroundCount;
            
        }
    }
    return
}

// check whether all mines are marked and all cells are shown
function checkGameOver(cell) {
    if (cell.isShown === true && cell.isMine === true) {
        resetTimer()
        showAllMines()
        gElEmoji.innerText = CLOUD;
        gGame.isOn = false
        gTurn = 0
        console.log('Game Over! You lost!')
    }
    var safeCellsCount = gLevel.SIZE ** 2 - gLevel.MINES;
    var totalMinesCount = gLevel.MINES;
    if (gGame.shownCount === safeCellsCount && gGame.markedCount === totalMinesCount) {
        resetTimer()
        gElEmoji.innerText = SUNGLASSES;
        gGame.isOn = false
        gTurn = 0
        console.log('Game Done! You won!')
    }
}

function restartGame() {
    gElEmoji.innerText = SMILEY;
    gTurn = 0
    gGame.markedCount = 0
    gGame.shownCount = 0
    gGame.secsPassed = 0
    initGame();
}
// create randomly located mines
function createRandomMines(gLevel) {
    var counter = 0
    while (counter < gLevel.MINES) {
        var randomPosI = getRandomIntInclusive(0, gLevel.SIZE - 1)
        var randomPosJ = getRandomIntInclusive(0, gLevel.SIZE - 1)
        if (gBoard[randomPosI][randomPosJ].isMine === false) {
            gBoard[randomPosI][randomPosJ].isMine = true
            // var currElCell = document.getElementById(`cell-${randomPosI}-${randomPosJ}`)
            // currElCell.classList.add("mine")
            counter++
        }
        continue
    }
}
// change between 3 difficulty levels
function changeDiffLevel(elBtn) {
    var size = elBtn.dataset.size;
    var mines = elBtn.dataset.mines;
    gLevel.SIZE = size;
    gLevel.MINES = mines;
    restartGame()
}
// show all mines when game over
function showAllMines() {
    for (var i = 0; i < gBoard.length; i++) {
      for (var j = 0; j < gBoard[0].length; j++) {
          var currCell = gBoard[i][j];
        if (currCell.isMine === true) {
          currCell.isShown = true;
          var currElCell = document.getElementById(`cell-${i}-${j}`)
          currElCell.innerText = MINE
          
        }
      }
    }
  }