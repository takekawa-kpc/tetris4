export const BOARD_WIDTH = 10
export const BOARD_HEIGHT = 20

export type Board = Array<Array<string | number>>

export function createEmptyBoard(): Board {
  return Array.from({ length: BOARD_HEIGHT }, () => Array(BOARD_WIDTH).fill(0))
}

export function isValidPosition(
  board: Board,
  shape: number[][],
  row: number,
  col: number,
): boolean {
  for (let r = 0; r < shape.length; r++) {
    for (let c = 0; c < shape[0].length; c++) {
      if (shape[r][c]) {
        const boardRow = row + r
        const boardCol = col + c
        if (boardRow < 0 || boardRow >= BOARD_HEIGHT || boardCol < 0 || boardCol >= BOARD_WIDTH) {
          return false
        }
        if (board[boardRow]?.[boardCol] !== 0 && board[boardRow]?.[boardCol] !== undefined) {
          return false
        }
      }
    }
  }
  return true
}

export function placePiece(board: Board, shape: number[][], row: number, col: number, value: string): Board {
  const newBoard = board.map((r) => [...r])
  for (let r = 0; r < shape.length; r++) {
    for (let c = 0; c < shape[0].length; c++) {
      if (shape[r][c]) {
        const boardRow = row + r
        const boardCol = col + c
        if (boardRow >= 0 && boardRow < BOARD_HEIGHT && boardCol >= 0 && boardCol < BOARD_WIDTH) {
          newBoard[boardRow][boardCol] = value
        }
      }
    }
  }
  return newBoard
}

export function clearLines(board: Board): { newBoard: Board; linesCleared: number } {
  const newBoard = board.filter((row) => row.some((cell) => cell === 0))
  const linesCleared = BOARD_HEIGHT - newBoard.length
  while (newBoard.length < BOARD_HEIGHT) {
    newBoard.unshift(Array(BOARD_WIDTH).fill(0))
  }
  return { newBoard, linesCleared }
}

export function getGhostPosition(board: Board, shape: number[][], row: number, col: number): number {
  let ghostRow = row
  while (isValidPosition(board, shape, ghostRow + 1, col)) {
    ghostRow++
  }
  return ghostRow
}
