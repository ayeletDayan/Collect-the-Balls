var WALL = 'WALL';
var FLOOR = 'FLOOR';
var BALL = 'BALL';
var GAMER = 'GAMER';
var GLUE = 'GLUE';
var gIntervalBall;
var gIntervalGlue;
var gIntervalClean;
var gBalls = 2;
var ballsCollected = 0;

var GAMER_IMG = '<img src="img/gamer.png" />';
var BALL_IMG = '<img src="img/ball.png" />';
var GLUE_IMG = '&#128169';
var gBoard;
var gGamerPos;
var gIsGlued = false;

function start(){
	gBalls = 2;
	var elBalls = document.querySelector('.balls')
	elBalls.innerHTML = '';
	ballsCollected = 0;
	
	clearInterval(gIntervalBall)
	clearInterval (gIntervalGlue)
	initGame()	
}

function initGame() {
	gGamerPos = { i: 2, j: 9 };
	gBoard = buildBoard();
	renderBoard(gBoard);
	gIntervalBall = setInterval(addBall, 2000)
	gIntervalGlue = setInterval(addGlue, 5000)
}

function addBall() {
	var i = Math.floor(Math.random() * 8) + 1
	var j = Math.floor(Math.random() * 10) + 1
	if (gBoard[i][j].gameElement === null)
		gBoard[i][j].gameElement = BALL;
	renderBoard(gBoard);
	gBalls++
}

function addGlue() {
	var i = Math.floor(Math.random() * 8) + 1
	var j = Math.floor(Math.random() * 10) + 1
	if (gBoard[i][j].gameElement === null)
		gBoard[i][j].gameElement = GLUE;
	renderBoard(gBoard);
	setTimeout(cleanGlue, 3000, i, j)
}

function cleanGlue(idxI, idxJ) {
	if (gBoard[idxI][idxJ].gameElement === GLUE) {
		gBoard[idxI][idxJ].gameElement = null
		renderBoard(gBoard);
	}
}

function buildBoard() {
	// Create the Matrix
	var board = createMat(10, 12)


	// Put FLOOR everywhere and WALL at edges
	for (var i = 0; i < board.length; i++) {
		for (var j = 0; j < board[0].length; j++) {
			// Put FLOOR in a regular cell
			var cell = { type: FLOOR, gameElement: null };

			// Place Walls at edges
			if (i === 0 || i === board.length - 1 || j === 0 || j === board[0].length - 1) {
				cell.type = WALL;
			}

			// Add created cell to The game board
			board[i][j] = cell;
		}
	}

	//passages that take the gamer from left/right or top/bottom
	board[0][6].type = FLOOR;
	board[4][0].type = FLOOR;
	board[4][11].type = FLOOR;
	board[9][6].type = FLOOR;

	// Place the gamer at selected position
	board[gGamerPos.i][gGamerPos.j].gameElement = GAMER;

	// Place the Balls (currently randomly chosen positions)
	board[3][8].gameElement = BALL;
	board[7][4].gameElement = BALL;

	// console.log(board);
	return board;
}

function renderBoard(board) {
	var strHTML = '';
	for (var i = 0; i < board.length; i++) {
		strHTML += '<tr>\n';
		for (var j = 0; j < board[0].length; j++) {
			var currCell = board[i][j];

			var cellClass = getClassName({ i: i, j: j })

			cellClass += (currCell.type === FLOOR) ? ' floor' : ' wall';

			strHTML += '<td class="cell ' + cellClass + '" onclick="moveTo(' + i + ',' + j + ')" >';

			switch (currCell.gameElement) {
				case GAMER:
					strHTML += GAMER_IMG;
					break;
				case BALL:
					strHTML += BALL_IMG;
					break;
				case GLUE:
					strHTML += GLUE_IMG;
			}
			strHTML += '\t</td>\n';
		}
		strHTML += '</tr>\n';
	}
	var elBoard = document.querySelector('.board');
	elBoard.innerHTML = strHTML;
}
// Move the player to a specific location
function moveTo(i, j) {
	if (gIsGlued) return;
	var targetCell = gBoard[i][j]
	if (targetCell.gameElement === GLUE) {
		gIsGlued = true;
		setTimeout(function () {
			gIsGlued = false;
		}, 3000)
	}
// var onkeyup: === 'ArrowLeft') console.log('hi')

onkeyup

	if (gGamerPos.i === 0 && gGamerPos.j === 6) {
		// Model:
		gBoard[gGamerPos.i][gGamerPos.j].gameElement = null;
		// Dom:
		renderCell(gGamerPos, '');
		gGamerPos.i = 9;
		gGamerPos.j = 6;
		gBoard[9][6] = GAMER;
		renderCell(gGamerPos, GAMER_IMG);
	}
	else if (gGamerPos.i === 4 && gGamerPos.j === 0) {
		// Model:
		console.log('Ani kan');
		gBoard[gGamerPos.i][gGamerPos.j].gameElement = null;
		// Dom:
		renderCell(gGamerPos, '');
		gGamerPos.i = 4;
		gGamerPos.j = 11;
		gBoard[4][11] = GAMER;
		renderCell(gGamerPos, GAMER_IMG);
	}
	else if (i === 9 && j === 6) {
		// Model:
		gBoard[gGamerPos.i][gGamerPos.j].gameElement = null;
		// Dom:
		renderCell(gGamerPos, '');
		gGamerPos.i = 0;
		gGamerPos.j = 6;
		gBoard[0][6] = GAMER;
		renderCell(gGamerPos, GAMER_IMG);
	}
	else if (i === 4 && j === 11) {
		// Model:
		gBoard[gGamerPos.i][gGamerPos.j].gameElement = null;
		// Dom:
		renderCell(gGamerPos, '');
		gGamerPos.i = 4;
		gGamerPos.j = 0;
		gBoard[4][0] = GAMER;
		renderCell(gGamerPos, GAMER_IMG);
	}

	var targetCell = gBoard[i][j];
	if (targetCell.type === WALL) return;

	// Calculate distance to make sure we are moving to a neighbor cell
	var iAbsDiff = Math.abs(i - gGamerPos.i);
	var jAbsDiff = Math.abs(j - gGamerPos.j);

	// If the clicked Cell is one of the four allowed
	if ((iAbsDiff === 1 && jAbsDiff === 0) || (jAbsDiff === 1 && iAbsDiff === 0)) {

		if (targetCell.gameElement === BALL) {
			var audio = new Audio('pop.wav')
			audio.play()
			ballsCollected ++
			var elBalls = document.querySelector('.balls')
			var strHTML = ''
			strHTML = ballsCollected
			elBalls.innerHTML = strHTML;
			if (ballsCollected=== gBalls) {
				alert('You Win!')
				start()
			}  
		}

		// MOVING from current position
		// Model:
		gBoard[gGamerPos.i][gGamerPos.j].gameElement = null;
		// Dom:
		renderCell(gGamerPos, '');

		// MOVING to selected position
		// Model:
		gGamerPos.i = i;
		gGamerPos.j = j;
		gBoard[gGamerPos.i][gGamerPos.j].gameElement = GAMER;
		// DOM:
		renderCell(gGamerPos, GAMER_IMG);

	} // else console.log('TOO FAR', iAbsDiff, jAbsDiff);

	// renderCell(gGamerPos, GAMER_IMG);

}

// Convert a location object {i, j} to a selector and render a value in that element
function renderCell(location, value) {
	var cellSelector = '.' + getClassName(location)
	var elCell = document.querySelector(cellSelector);
	elCell.innerHTML = value;
}

// Move the player by keyboard arrows
function handleKey(event) {

	var i = gGamerPos.i;
	var j = gGamerPos.j;

	switch (event.key) {
		case 'ArrowLeft':
			moveTo(i, j - 1);
			break;
		case 'ArrowRight':
			moveTo(i, j + 1);
			break;
		case 'ArrowUp':
			moveTo(i - 1, j);
			break;
		case 'ArrowDown':
			moveTo(i + 1, j);
			break;

	}

}

// Returns the class name for a specific cell
function getClassName(location) {
	var cellClass = 'cell-' + location.i + '-' + location.j;
	return cellClass;
}

