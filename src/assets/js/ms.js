import * as UI from './ui.js'

const checkGameState = (board, $board) => {
  const cells = board.flat()
  const numberOfCells = cells.length
  const mined = cells.filter(cell => cell.mined).length
  const revealed = cells.filter(cell => cell.revealed).length

  if (numberOfCells - revealed === mined) {
    UI.GameOver('WIN', board, $board)
  }
}

const getArea = (cell, board) => {
  const x = cell[0]
  const y = cell[1]

  const north = x > 0 ? board[x-1][y] : null
  const northeast = x > 0 && y < board[x].length - 1 ? board[x-1][y+1] : null
  const east = y < board[x].length - 1 ? board[x][y+1] : null
  const southeast = x < board.length - 1 && y < board[x].length - 1 ? board[x+1][y+1] : null
  const south = x < board.length - 1 ? board[x+1][y] : null
  const southwest = x < board.length - 1 && y > 0 ? board[x+1][y-1] : null
  const west = y > 0 ? board[x][y-1] : null
  const northwest = x > 0 && y > 0 ? board[x-1][y-1] : null

  return [north, northeast, east, southeast, south, southwest, west, northwest]
}

const setMinedNeighborsCount = (board) => {
  for (let x = 0; x < board.length; x++) {
    for (let y = 0; y < board[0].length; y++) {
      const area = getArea([x,y], board)
      const _area = area.filter(cell => { return cell !== null })
      const count = _area.filter(cell => { return cell.mined === true }).length
      board[x][y].neighbors_mined = count
    }
  }
}

const placeMines = (rows, cols, mines, board) => {
  // place mines randomly on board
  for (let i = 0; i < mines; i++) {
    const x = Math.floor(Math.random() * rows)
    const y = Math.floor(Math.random() * cols)
    const isMined = board[x][y].mined
    if (isMined) {
      // rerun iteration to place new mine
      i -= 1
    } else {
      board[x][y].mined = true
    }
  }

  setMinedNeighborsCount(board)

  return board
}

const createBoard = (rows, cols, mines, debug) => {
  const board = []

  // create board array from rows/cols
  for (let x = 0; x < rows; x++) {
    const row = []
    for (let y = 0; y < cols; y++) {
      const cell = {
        position: [x, y],
        mined: false,
        flagged: false,
        revealed: false,
        neighbors_mined: 0
      }
      row.push(cell)
    }
    board.push(row)
  }

  // add mines to board
  placeMines(rows, cols, mines, board)

  console.log(board)
  return board
}

const load = (rows, cols, mines, $board, debug) => {
  const board = createBoard(rows, cols, mines, debug)
  UI.createBoardUI(board, $board, debug)
}

export { load, getArea, checkGameState }
