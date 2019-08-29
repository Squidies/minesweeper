import * as UI from './ui.js'
import * as _MS from './ms.js'

const checkAllMinesFlagged = (board, $board) => {
  const mined = board.flat().filter(cell => cell.mined).length
  const flagged = board.flat().filter(cell => cell.flagged && cell.mined).length

  if (mined === flagged) {
    UI.GameOver('WIN', board)
  }
}

const toggleFlag = (position, board, $board) => {
  const x = position[0]
  const y = position[1]
  const isFlagged = board[x][y].flagged
  const isNotRevealed = !board[x][y].revealed
  const mined = board.flat().filter(cell => cell.mined).length
  const flagged = board.flat().filter(cell => cell.flagged).length

  if (isFlagged) {
    board[x][y].flagged = false
    const $cell = UI.getCellUI(position)
    $cell.classList.remove('flagged')
  } else {
      if (flagged < mined) {
        if (isNotRevealed) {
          board[x][y].flagged = true
          const $cell = UI.getCellUI(position)
          $cell.classList.add('flagged')
          checkAllMinesFlagged(board, $board)
        }
      } else {
        alert('No more flags left and not all mines found...')
      }
  }
}

const clickedCell = (position, board, $board) => {
  // console.log(position, board)
  const x = position[0]
  const y = position[1]
  const cell = board[x][y]
  const notFlagged = !cell.flagged
  const isMined = cell.mined

  if (notFlagged) {
    if (isMined) {
      UI.GameOver('LOSE', board, $board)
    } else {
      const neighbors = cell.neighbors_mined
      if (neighbors !== 0) {
        UI.showNeighborCount(neighbors, position, board, $board)
        _MS.checkGameState(board, $board)
      } else {
        UI.revealBlankTiles(position, board, $board)
        _MS.checkGameState(board, $board)
      }
    }
  }
}

export { clickedCell, toggleFlag }
