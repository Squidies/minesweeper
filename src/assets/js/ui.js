import * as _AC from './actions.js'
import * as _MS from './ms.js'

const gameWon = (board) => {
  console.log('✨YOU WON!!✨')
}

const gameLost = (board, $board) => {
  console.log('❌YOU LOST❌')
  const mines = board.flat().filter(cell => cell.mined)
  mines.forEach(cell => {
    const $mine = getCellUI(cell.position)
    $mine.classList = 'cell explode'
    $mine.innerText = '❌'
  })

  const $gameover = document.createElement('div')
        $gameover.classList.add('gameover')
  const $reset = document.createElement('button')
        $reset.classList.add('reset')
        $reset.innerText = 'New Game'
  $gameover.appendChild($reset)
  $board.appendChild($gameover)
}

const GameOver = (state, board, $board) => {
  console.log($board)
  const hasWon = state === 'WIN' ? true : false
  if (hasWon) {
    gameWon()
  } else {
    gameLost(board, $board)
  }
}

const revealBlankTiles = (position, board, $board) => {
  const x = position[0]
  const y = position[1]

  // show board blank tile //
  board[x][y].revealed = true
  getCellUI(position).classList.add('blank')

  const area = _MS.getArea(position, board)
  const _area = area.filter(cell => { return cell !== null && cell.revealed !== true }) // filter out edges and revealed tiles
  const blankTiles = _area.filter(cell => { return cell.neighbors_mined === 0 })
  const adjecentToMines = _area.filter(cell => { return cell.neighbors_mined > 0 })

  // ✨ reveal tile magic ✨
  adjecentToMines.forEach(cell => { showNeighborCount(cell.neighbors_mined, cell.position, board) })
  blankTiles.forEach(cell => { revealBlankTiles(cell.position, board, $board) })
}

const showNeighborCount = (neighbors, position, board, $board) => {
  const x = position[0]
  const y = position[1]
  board[x][y].revealed = true

  const cell = getCellUI(position)
  cell.classList.add(`n${neighbors}`)
  cell.innerText = neighbors
}

const getCellUI = (position) => {
  const x = position[0]
  const y = position[1]
  return document.querySelector(`[data-cell="${x},${y}"]`)
}

const createCell = (position, board, $board, debug) => {
  const x = position[0]
  const y = position[1]
  const cell = document.createElement('div')
        cell.classList.add('cell')
        cell.setAttribute('data-cell', `${x},${y}`)
  // add action listeners
  cell.onclick = function() { _AC.clickedCell(position, board, $board) }
  cell.oncontextmenu = function(e) { e.preventDefault(); _AC.toggleFlag(position, board, $board) }
  // debug show mine positions
  if (debug && board[x][y].mined) {
    cell.innerHTML = '&times;' // x
  }

  return cell
}

const createRow = () => {
  const row = document.createElement('div')
        row.classList.add('row')

  return row
}

const createBoardUI = (board, $board, debug) => {
  // console.log(board, $board, debug)
  const rows = board.length
  const cols = board[0].length

  for (let x = 0; x < rows; x++) {
    const $row = createRow()
    for (let y = 0; y < cols; y++) {
      const $cell = createCell([x, y], board, $board, debug)
      $row.appendChild($cell)
    }
    $board.appendChild($row)
  }
}

export { createBoardUI, showNeighborCount, revealBlankTiles, getCellUI, GameOver }
