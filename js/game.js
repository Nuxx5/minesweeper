'use strict'
const MINE = '💣'
const FLAG = '⛳'
const SMILEY = '😀'
const SAD_FACE = '😔'
const SUNGLASSES = '😎'
const EMPTY = ''

var gBoard ;
var gLevel = {
 
    SIZE: 4,
    MINES: 2 };

var gGame = {
    isOn: false,
    shownCount: 0, markedCount: 0, secsPassed: 0
    };


// initialize the game
function initGame(){
console.log('hello')
gBoard = buildBoard()
loopSetMinesNegsCount(gBoard)
renderBoard(gBoard)
}

// build the board
function buildBoard(size = 4){
    var board = []
    for (var i = 0; i < size; i++) {
        board[i] = [];
        for (var j = 0; j < size; j++) {
            var cell = {minesAroundCount: 0, isShown: true, isMine: false, isMarked: false};
            board[i][j] = cell;
        }
    }
    board[0][2].isMine = true
    board[2][0].isMine = true
    board[1][1].isMarked = true
    console.table(board)
    return board;
}

// render the board
function renderBoard(board){
    var strHTML = '';
    for (var i = 0; i < board.length; i++) {
        strHTML += `<tr class="board" >`
        for (var j = 0; j < board[0].length; j++) {
            var cell = board[i][j];
            var className = ''
            var symbol = ''
            if (cell.isShown) className = 'shown';
            if (cell.isMine)  symbol = MINE;
            if (cell.isMarked) symbol = FLAG;
            
            // for cell of type MINE add mine class
      
            strHTML += `<td class="cell ${className}" 
                            onclick="cellClick(this, ${i}, ${j})" >${symbol}
                         </td>`
        }
        strHTML += `</tr>`
    }
    // console.log(strHTML)

    var elCells = document.querySelector('.minesweeper');
    elCells.innerHTML = strHTML;
}

function loopSetMinesNegsCount(board){ 
for (var i=0; i < board.length; i++) {
    for (var j=0; j < board[0].length; j++) {
        var pos = {i: i, j: j}
        setMinesNegsCount(board, pos)
    }
}
}
// count neighbor mines around each cell
function setMinesNegsCount(board, pos){
    var count = 0;
    for (var i = pos.i - 1; i <= pos.i + 1; i++) {
        if (i < 0 || i > board.length - 1) continue
        for (var j = pos.j - 1; j <= pos.j + 1; j++) {
            if (j < 0 || j > board[0].length - 1) continue
            if (i === pos.i && j === pos.j) continue
            var currCell = board[i][j]
            if (currCell.isMine === true) count++
        }
    }
    return count
}

// Called when a cell (td) is clicked
function cellClicked(elCell, i, j){

}

// called when a cell is marked with a flag
function cellMarked(elCell){}

// expand shown cells around clicked cell
function expandShown(board, elCell, i, j){}

// check whether all mines are marked and all cells are shown
function checkGameOver(){}