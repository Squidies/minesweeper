import settings from './js/settings.js'
import * as _MS from './js/ms.js'

const $board = settings.$board
const rows = settings.rows
const cols = settings.cols
const mines = settings.mines
const debug = settings.debug

_MS.load(rows, cols, mines, $board, debug)

