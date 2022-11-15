
var config = {
  pieceTheme: 'img/chesspieces/wikipedia/{piece}.png',
  draggable: true,
  position: 'start',
  onDragStart: onDragStart,
  onDrop: onDrop,
  onSnapEnd: onSnapEnd
}
var theme = 0;
var pieceArray = null;
var moraleThreshold = 15;
var allegianceThreshold = 30;
var allegianceDamage = 25;
var initialAllegiance = 70;
var whiteSquareGrey = '#a9a9a9';
var blackSquareGrey = '#696969';
var whiteSquareRed = '#df0334';
var blackSquareRed = '#C60C29';
var player1Score = 0;
var player2Score = 0;
var player1Color = 'w';
var player2Color = 'b';
var gameCount = 1;
var randomComputer = false;
var initialFen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"

var AllPosition = ['a8', 'b8', 'c8', 'd8', 'e8', 'f8', 'g8', 'h8',
                   'a7', 'b7', 'c7', 'd7', 'e7', 'f7', 'g7', 'h7',
                   'a6', 'b6', 'c6', 'd6', 'e6', 'f6', 'g6', 'h6',
                   'a5', 'b5', 'c5', 'd5', 'e5', 'f5', 'g5', 'h5',
                   'a4', 'b4', 'c4', 'd4', 'e4', 'f4', 'g4', 'h4',
                   'a3', 'b3', 'c3', 'd3', 'e3', 'f3', 'g3', 'h3',
                   'a2', 'b2', 'c2', 'd2', 'e2', 'f2', 'g2', 'h2',
                   'a1', 'b1', 'c1', 'd1', 'e1', 'f1', 'g1', 'h1'];

  //all position of pieces in the starting position from left to right
var positionRead = ['a8', 'b8', 'c8', 'd8', 'e8', 'f8', 'g8', 'h8',
                  'a7', 'b7', 'c7', 'd7', 'e7', 'f7', 'g7', 'h7',
                  'a2', 'b2', 'c2', 'd2', 'e2', 'f2', 'g2', 'h2',
                  'a1', 'b1', 'c1', 'd1', 'e1', 'f1', 'g1', 'h1'];

var chessTypeRead = ['bR', 'bN', 'bB', 'bQ', 'bK', 'bB', 'bN', 'bR',
                   'bP', 'bP', 'bP', 'bP', 'bP', 'bP', 'bP', 'bP',
                   'wP', 'wP', 'wP', 'wP', 'wP', 'wP', 'wP', 'wP',
                   'wR', 'wN', 'wB', 'wQ', 'wK', 'wB', 'wN', 'wR'];








//Methods:

class Piece
{
  //board position: string
  //piece type: string
  constructor(boardPosition, pieceType)
  {
    this.boardPosition = boardPosition;
    this.pieceType = pieceType;
    this.color = pieceType[0];
    this.type = pieceType[1];
  }

  changeColor = () =>
  {
    if (this.color === 'w')
    {
      this.pieceType = 'b' + this.type;
      this.color = 'b';
    } else {
      this.color = 'w';
      this.pieceType = 'w' + this.type;
    }
  }

  //Morale attribute: range from 0 to 100
  morale = 100;
  allegiance = initialAllegiance;

  //random morale with no parameter. 
  updateMorale = (num = null) =>
  {
    let type = this.type.toUpperCase();
    if (type != 'K')
    {
      if (num != null)
      {
        this.morale = num;
      } else {
        this.morale = Math.floor(Math.random() * 101);
      }
    } else {
      this.morale = 100;
    }
    
  }

  updatePosition = (newPosition) =>
  {
    if (AllPosition.includes(newPosition))
    {
      this.boardPosition = newPosition;
      return true;
    } else {
      console.log("invalid position", newPosition);
      return false;
    }
  }
}

function updateAllMorale(color)
{
  newPieceArray = [];
  for (piece of pieceArray)
  {
    if (piece.color === color)
    {
      newPieceArray.push(piece);
    } 
  }
  for (piece of newPieceArray)
  {
    piece.updateMorale();
  }
}

function updateAllAllegiance(num)
{
  for (piece of pieceArray)
  {
    piece.allegiance += num;
    if (piece.allegiance > 100)
    {
      piece.allegiance = 100;
    }
  }
}


//get all the pieces position. Specify color if needed.
function getAllPiecesPosition(color = null)
{
  position = [];
  if (color === null)
  {
    for (let i = 0; i < pieceArray.length; i++)
    {
      position.push(pieceArray[i].boardPosition);
    }
  } else if (color === 'w')
  {
    for (let i = 0; i < pieceArray.length; i++)
    {
      if (pieceArray[i].color === 'w')
      {
        position.push(pieceArray[i].boardPosition);
      }
    }
  } else if (color === 'b')
  {
    for (let i = 0; i < pieceArray.length; i++)
    {
      if (pieceArray[i].color === 'b')
      {
        position.push(pieceArray[i].boardPosition);
      }
    }
  } else {
    console.log("invalid color");
    return null;
  }
  return position;
}

//get all the available moves of a square
function getAvailableMoves(square)
{
  if (findPiece(square) === null)
  {
    console.log("getAvailableMoves Error: square", square, "has no piece.");
    return null;
  }
  var moves = game.moves({
    square: square,
    verbose: true
  })

  moveArr = [];
  for (move of moves)
  {
    let a = move['to'];
    moveArr.push(a);
  }
  return moveArr;
}


function removeGreySquares () {
  $('#myBoard .square-55d63').css('background', '')
}

function greySquare(square) {
  var $square = $('#myBoard .square-' + square)

  var background = whiteSquareGrey
  if ($square.hasClass('black-3c85d')) {
    background = blackSquareGrey
  }

  $square.css('background', background)
}

function greySquareArray(squareArray)
{
  for (square of squareArray)
  {
    greySquare(square);
  }
}

function redSquare(square) {
  var $square = $('#myBoard .square-' + square)

  var background = whiteSquareRed
  if ($square.hasClass('black-3c85d')) {
    background = blackSquareRed
  }

  $square.css('background', background)
}

function redSquareArray(squareArray)
{
  for (square of squareArray)
  {
    redSquare(square);
  }
}



function getAllSquare(pieceArray)
{
  squareArr = [];
  for (piece of pieceArray)
  {
    squareArr.push(piece.boardPosition);
  }
  return squareArr;
}

function getAllLowMorale(color = null)
{
  let pieceArray = getAllPiece(color);

  let newPieceArray = []
  for (piece of pieceArray)
  {
    if (piece.morale < moraleThreshold)
    {
      newPieceArray.push(piece);
    }
  }
  return newPieceArray;
}

function getAllLowAllegiance(color = null)
{
  let pieceArray = getAllPiece(color);

  let newPieceArray = []
  for (piece of pieceArray)
  {
    if (piece.allegiance < allegianceThreshold + allegianceDamage)
    {
      newPieceArray.push(piece);
    }
  }
  return newPieceArray;
}

function getAllPiece(color = null)
{
  let pieceArr = [];
  if (color === null)
  {
    return pieceArray;
  } else if (color != 'w' && color != 'b')
  {
    console.log("getAllPiece Error: no such color");
  }

  for (piece of pieceArray)
  {
    if (piece.color === color)
    {
      pieceArr.push(piece);
    }
  }
  return pieceArr;
}



//returning a list of positions of pieces from enemy that are capable of capturing the target square
function getDanger(square, enemyColor)
{
  posArray = getAllPiecesPosition(enemyColor);
  dangerArray = [];
  for (const position of posArray)
  {
    var moves = game.moves({
      square: position,
      verbose: true
    })
    for (let i = 0; i < moves.length; i++)
    {
      if (moves[i]['to'] === square)
      {
        dangerArray.push(moves[i]['from']); 
      }
    }
  }
  return dangerArray;
}


function getCountInArray(arr)
{
  const counts = {};
  for (const num of arr) {
    counts[num] = (counts[num] || 0) + 1
  }
  return counts;
}



//find the piece object by board position. Return false if piece not found.
function findPiece(square) //boardPosition: string
{
  for (let i = 0; i < pieceArray.length; i++)
  {
    if (pieceArray[i].boardPosition === square)
    {
      return pieceArray[i];
    }
  }
  console.log("Can't find the piece on ", square);
  return null;
}



//initialize pieces for start position
function piecesInitStart()
{
  pieceArray = [];
  for (let i = 0; i < 32; i++)
  {
    m_chesspiece = new Piece(positionRead[i], chessTypeRead[i]);
    pieceArray.push(m_chesspiece);
  }
}

//add function for primitive string to replace substring with index, target, and length
String.prototype.replaceAt = function(index, replacement, length) {
  return this.substring(0, index) + replacement + this.substring(index + length);
}


//Skip a term. Need to used in onDrop before game.move
function skipTerm()
{
  let fen = game.fen();
  const arr = game.fen().split(" ");
  let turnIndex = arr[0].length + 1;
  let startIndex = arr[0].length + arr[1].length + arr[2].length + 3;
  if (fen[turnIndex] === 'b')
  {
    fen = fen.replaceAt(turnIndex, 'w', 1);
  }else {
    fen = fen.replaceAt(turnIndex, 'b', 1)
  }
  if (fen[startIndex] != '-')
  {
    fen = fen.replaceAt(startIndex, '-', 2);
  }

  game.load(fen);
}


function isLetter(str) {
  return str.length === 1 && str.match(/[a-z]/i);
}

function isLowerLetter(str) {
  return str.length === 1 && str.match(/[a-z]/);
}

function isCapLetter(str) {
  return str.length === 1 && str.match(/[A-Z]/);
}

function isNumber(str)
{
  return !isNaN(str)
}

//change color of a square
function changeColor(square)
{
  let fen = game.fen();
  let fenArr = fen.split('/');
  let tmp = [7, 6, 5, 4, 3, 2, 1, 0];
  let rowIndex = tmp[parseInt(square[1]) - 1];
  
  let row = fenArr[rowIndex];

  let l = 0;
  for (let i = 0; i < rowIndex; i++)
  {
    l += fenArr[i].length + 1;
  }

  letter = square[0].toUpperCase();
  tmp = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  column = tmp.indexOf(letter) + 1;

  let count = 1;
  let change = 0;
  let counter = 0;
  for (let i = 0; i < 8; i++)
  {
    if (column === count)
    {
      if (isLowerLetter(row[i]))
      {
        change = row[i].toUpperCase();
        break;
      } else if (isCapLetter(row[i]))
      {
        change = row[i].toLowerCase();

        break;
      } else {
        console.log("error");
      }
    } else if (isLetter(row[i]))
    {
      count += 1;
    } else if (isNumber(row[i]))
    {
      let num = parseInt(row[i]);
      count += num;
    }
    counter += 1;
  }

  
  let index = l + counter;
  fen = fen.replaceAt(index, change, 1);

  game.load(fen);
  

}



//Destroy all instances of Pieces
function destroyAllPieces()
{
  pieceArray = null;
}

//Destroy a specific piece by square
function destroyPiece(square)
{
  const index = pieceArray.indexOf(findPiece(square));
  if (index > -1) //check if the piece still exist in pieceArray
  {
    pieceArray.splice(index, 1);
    return true;
  }
  console.log("No piece found on", square);
  return false;
}



//Change Theme
function changeTheme()
{
  value = getValue();
  if (value === "Default")
  {
    config.pieceTheme = 'img/chesspieces/wikipedia/{piece}.png';
  } else if (value === "maestro_bw")
  {
    config.pieceTheme = 'img/chess_maestro_bw/{piece}.svg';
  } else if (value === "Kbyte")
  {
    config.pieceTheme = 'img/chess_1Kbyte_gambit/{piece}.svg';
  } else if (value === "kaneo_midnight")
  {
    config.pieceTheme = 'img/chess_kaneo_midnight/{piece}.svg'
  } else if (value === "sittuyin")
  {
    config.pieceTheme = 'img/sittuyin_green_red/{piece}.svg'
  }
  board = Chessboard('myBoard', config);
  onSnapEnd();
}



// Make Random Move
function makeRandomMove () {
  var possibleMoves = game.moves()

  // exit if the game is over
  if (game.game_over()) return

  var randomIdx = Math.floor(Math.random() * possibleMoves.length)
  game.move(possibleMoves[randomIdx])
  board.position(game.fen())

  
}





function onDragStart (source, piece, position, orientation) {
  // do not pick up pieces if the game is over
  if (game.game_over()) return false;
  if (randomComputer === true && game.turn() === player2Color) return false;

  // only pick up pieces for the side to move
  if ((game.turn() === 'w' && piece.search(/^b/) !== -1) ||
      (game.turn() === 'b' && piece.search(/^w/) !== -1)) {
    return false
  }



}

function onDrop (source, target) {

  //TODO: check morale, check allegiance 
  //skipTerm();

  let availableMoves = getAvailableMoves(source);

  //if the target is not a legal moves
  if (!availableMoves.includes(target))
  {
    return 'snapback';
  }

  let m_piece = findPiece(source);
  
  if (m_piece.boardPosition != source)
  {
    console.log("m_pieces:", m_piece.boardPosition, "source:", source);
  }

  if (m_piece.morale < moraleThreshold)
  {
    document.getElementById("Message").innerHTML = m_piece.boardPosition + " refuse to move because of low morale!"
    skipTerm();

    removeGreySquares();
    updateAllMorale(game.turn());
    updateAllAllegiance(5);
    lowMoralePieces = getAllLowMorale(game.turn());
    lowMoralePiecesSquare = getAllSquare(lowMoralePieces);
    console.log(lowMoralePiecesSquare)
    greySquareArray(lowMoralePiecesSquare);

    return 'snapback';
  }
  

  // see if the move is legal
  var move = game.move({
    from: source,
    to: target,
    promotion: 'q' // NOTE: always promote to a queen for example simplicity
  })

  $('#againstRandom').hide();
  $('#flipOrientationBtn').hide();
  $('#submit').hide();
  $('#resetScore').hide();
  // illegal move
  if (move === null)
  {
    return 'snapback';
  } else {
    if (findPiece(target) != null)
    {
      destroyPiece(target);
    }
    m_piece.updatePosition(target);
    if (m_piece.pieceType === 'wK')
    {
      if (source === "e1" && target === "c1")
      {
        findPiece("a1").updatePosition("d1");
      } else if (source === "e1" && target === "g1")
      {
        findPiece("h1").updatePosition("f1");
      }
    } else if (m_piece.pieceType === 'bK')
    {
      if (source === "e8" && target === "c8")
      {
        findPiece("a8").updatePosition("d8");
      } else if (source === "e8" && target === "g8")
      {
        findPiece("h8").updatePosition("f8");
      }
    }

    let dangerList = getDanger(target, game.turn()); 
    m_piece.allegiance -= dangerList.length * allegianceDamage;
    if (m_piece.allegiance < 0)
    {
      m_piece.allegiance = 0;
    }
    console.log(m_piece.allegiance)
    if (m_piece.allegiance < allegianceThreshold)
    {
      if (m_piece.type != 'k' && m_piece.type != 'K')
      {
        document.getElementById("Message").innerHTML = m_piece.boardPosition + " change color because of low allegiance. Don't suicide your pieces!"
        changeColor(m_piece.boardPosition);
        m_piece.allegiance = initialAllegiance;
        m_piece.changeColor();
        
      }
    }

    removeGreySquares();
    updateAllMorale(game.turn());
    updateAllAllegiance(5);
    let lowMoralePieces = getAllLowMorale(game.turn());
    let lowMoralePiecesSquare = getAllSquare(lowMoralePieces);
    console.log(lowMoralePiecesSquare)
    greySquareArray(lowMoralePiecesSquare);


    let lowAllegiancePieces = getAllLowAllegiance();
    let lowAllegiancePiecesSquare = getAllSquare(lowAllegiancePieces);
    redSquareArray(lowAllegiancePiecesSquare);

    if (game.in_checkmate()) {
      if (player1Color === game.turn())
      {
        gameCount += 1;
        player2Score += 1;
      } else {
        gameCount += 1;
        player1Score += 1;
      }
      changePlayerScore();
    }

    if (!game.in_checkmate())
    {
      if (randomComputer)
      {
        removeGreySquares();
        fen = game.fen();
        window.setTimeout(game.load(fen), 900);
        window.setTimeout(makeRandomMove, 1000);
      }
    }
  }
  

  updateStatus();

  
}


// update the board position after the piece snap
// for castling, en passant, pawn promotion
function onSnapEnd () {
  board.position(game.fen())
}

function updateStatus () {
  var status = ''

  var moveColor = 'White'
  if (game.turn() === 'b') {
    moveColor = 'Black'
  }

  // checkmate?
  if (game.in_checkmate()) {
    status = 'Game over, ' + moveColor + ' is in checkmate.'
    
  }

  // draw?
  else if (game.in_draw()) {
    status = 'Game over, drawn position'
  }

  // game still on
  else {
    status = moveColor + ' to move'

    // check?
    if (game.in_check()) {
      status += ', ' + moveColor + ' is in check'
    }
  }

  document.getElementById('status').innerHTML = status;
  document.getElementById('fen').innerHTML = game.fen();
}








function changeSide()
{
  let tmp = player1Color;
  player1Color = player2Color;
  player2Color = tmp;
  board.flip();
}



function changePlayer1Name() {
  let text;
  let tmp = document.getElementById("player1").innerHTML;
  let person = prompt("Please enter your name:", tmp);
  if (person == null || person == "") {
    text = tmp;
  } else if (person.length > 30) {
    text = tmp;
    alert("Player name too long");
  } else {
    text = person;
  }
  document.getElementById("player1").innerHTML = text;
}

function changePlayer2Name() {
  let text;
  let tmp = document.getElementById("player2").innerHTML;
  let person = prompt("Please enter your name:", tmp);
  if (person == null || person == "") {
    text = tmp;
  } else if (person.length > 30) {
    text = tmp;
    alert("Player name too long");
  } else {
    text = person;
  }
  document.getElementById("player2").innerHTML = text;
}

function getValue()
{
  let e = document.getElementById("pieceTheme");
  let value = e.value;
  return value;
}





function changePlayerScore()
{
  let p1 = document.getElementById("player1Score");
  let p2 = document.getElementById("player2Score");
  let p1Score = "Score: " + player1Score;
  let p2Score = "Score: " + player2Score;
  p1.innerHTML = p1Score;
  p2.innerHTML = p2Score;
  let game = document.getElementById("GameCount");
  game.innerHTML = "Game: " + gameCount;
}

function resetScore()
{
  player1Score = 0;
  player2Score = 0;
  gameCount = 1;
  changePlayerScore();
}


function changeThreshold()
{
  e = document.getElementById("Mthreshold");
  mt = e.value;
  if (mt != '')
  {
    if (!isNaN(mt))
    {
      mt = parseInt(mt);
      moraleThreshold = mt;
    }
  }
  

  e = document.getElementById("Athreshold");
  at = e.value;
  if (at != '')
  {
    if (!isNaN(at))
    {
      at = parseInt(at);
      allegianceThreshold = at;
    }
  }


  document.getElementById("MoraleShow").innerHTML = "Morale Threshold: " + moraleThreshold;
  document.getElementById("AllegianceShow").innerHTML = "Allegiance Threshold: " + allegianceThreshold;
}