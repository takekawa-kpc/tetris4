import { describe, it, expect } from 'vitest'
import {
  BOARD_WIDTH,
  BOARD_HEIGHT,
  createEmptyBoard,
  isValidPosition,
  placePiece,
  clearLines,
  getGhostPosition,
} from '../../src/lib/board'

describe('createEmptyBoard', () => {
  it('should create a board with correct dimensions', () => {
    const board = createEmptyBoard()
    expect(board.length).toBe(BOARD_HEIGHT)
    for (const row of board) {
      expect(row.length).toBe(BOARD_WIDTH)
    }
  })

  it('should initialize all cells to 0', () => {
    const board = createEmptyBoard()
    for (const row of board) {
      for (const cell of row) {
        expect(cell).toBe(0)
      }
    }
  })
})

describe('isValidPosition', () => {
  it('should return true for valid position', () => {
    const board = createEmptyBoard()
    const shape = [[1]]
    expect(isValidPosition(board, shape, 0, 0)).toBe(true)
  })

  it('should return false for out-of-bounds row', () => {
    const board = createEmptyBoard()
    const shape = [[1]]
    expect(isValidPosition(board, shape, -1, 0)).toBe(false)
    expect(isValidPosition(board, shape, BOARD_HEIGHT, 0)).toBe(false)
  })

  it('should return false for out-of-bounds column', () => {
    const board = createEmptyBoard()
    const shape = [[1]]
    expect(isValidPosition(board, shape, 0, -1)).toBe(false)
    expect(isValidPosition(board, shape, 0, BOARD_WIDTH)).toBe(false)
  })

  it('should return false when colliding with placed piece', () => {
    const board: number[][] = Array.from({ length: BOARD_HEIGHT }, () =>
      Array(BOARD_WIDTH).fill(0)
    )
    board[5][5] = 1
    const shape = [[1]]
    expect(isValidPosition(board, shape, 5, 5)).toBe(false)
  })
})

describe('placePiece', () => {
  it('should place piece on board', () => {
    const board = createEmptyBoard()
    const shape = [[1]]
    const newBoard = placePiece(board, shape, 0, 0, '#ff0000')
    expect(newBoard[0][0]).toBe('#ff0000')
  })

  it('should not modify original board', () => {
    const board = createEmptyBoard()
    const shape = [[1]]
    placePiece(board, shape, 0, 0, '#ff0000')
    expect(board[0][0]).toBe(0)
  })

  it('should place larger piece correctly', () => {
    const board = createEmptyBoard()
    const shape = [
      [1, 1],
      [1, 1],
    ]
    const newBoard = placePiece(board, shape, 0, 0, '#ff0000')
    for (let r = 0; r < 2; r++) {
      for (let c = 0; c < 2; c++) {
        expect(newBoard[r][c]).toBe('#ff0000')
      }
    }
  })
})

describe('clearLines', () => {
  it('should return 0 lines cleared for empty board', () => {
    const board = createEmptyBoard()
    const { linesCleared } = clearLines(board)
    expect(linesCleared).toBe(0)
  })

  it('should clear one line when a row is full', () => {
    const board: number[][] = Array.from({ length: BOARD_HEIGHT }, () =>
      Array(BOARD_WIDTH).fill(0)
    )
    // Fill row 5
    board[5] = Array(BOARD_WIDTH).fill(1)
    const { linesCleared, newBoard } = clearLines(board)
    expect(linesCleared).toBe(1)
    expect(newBoard[5]).toEqual(Array(BOARD_WIDTH).fill(0))
  })

  it('should clear multiple lines when multiple rows are full', () => {
    const board: number[][] = Array.from({ length: BOARD_HEIGHT }, () =>
      Array(BOARD_WIDTH).fill(0)
    )
    board[3] = Array(BOARD_WIDTH).fill(1)
    board[7] = Array(BOARD_WIDTH).fill(1)
    const { linesCleared } = clearLines(board)
    expect(linesCleared).toBe(2)
  })

  it('should not clear lines with empty cells', () => {
    const board: number[][] = Array.from({ length: BOARD_HEIGHT }, () =>
      Array(BOARD_WIDTH).fill(0)
    )
    board[5] = Array(BOARD_WIDTH).fill(1)
    board[5][5] = 0 // Break one cell
    const { linesCleared } = clearLines(board)
    expect(linesCleared).toBe(0)
  })
})

describe('getGhostPosition', () => {
  it('should return current row when piece is on ground', () => {
    const board: number[][] = Array.from({ length: BOARD_HEIGHT }, () =>
      Array(BOARD_WIDTH).fill(0)
    )
    board[BOARD_HEIGHT - 1] = Array(BOARD_WIDTH).fill(1)
    const shape = [[1]]
    const ghostRow = getGhostPosition(board, shape, BOARD_HEIGHT - 2, 0)
    expect(ghostRow).toBe(BOARD_HEIGHT - 2)
  })

  it('should return correct ghost position above obstacles', () => {
    const board: number[][] = Array.from({ length: BOARD_HEIGHT }, () =>
      Array(BOARD_WIDTH).fill(0)
    )
    board[10] = Array(BOARD_WIDTH).fill(1)
    const shape = [[1]]
    const ghostRow = getGhostPosition(board, shape, 5, 0)
    expect(ghostRow).toBe(9)
  })
})
