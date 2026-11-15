import { describe, it, expect } from 'vitest'
import { getNextPiece, rotateMatrix, TETROMINOES } from '../../src/lib/tetromino'

describe('TETROMINOES', () => {
  it('should have all 7 tetromino types', () => {
    const shapes = Object.keys(TETROMINOES)
    expect(shapes).toContain('I')
    expect(shapes).toContain('O')
    expect(shapes).toContain('T')
    expect(shapes).toContain('S')
    expect(shapes).toContain('Z')
    expect(shapes).toContain('J')
    expect(shapes).toContain('L')
  })

  it('should have color defined for each tetromino', () => {
    for (const [name, piece] of Object.entries(TETROMINOES)) {
      expect(piece.color).toBeDefined()
      expect(typeof piece.color).toBe('string')
    }
  })
})

describe('getNextPiece', () => {
  it('should return a valid tetromino', () => {
    const piece = getNextPiece()
    expect(piece).toBeDefined()
    expect(piece.shape).toBeDefined()
    expect(piece.color).toBeDefined()
  })
})

describe('rotateMatrix', () => {
  it('should rotate a matrix 90 degrees clockwise', () => {
    const matrix = [
      [1, 2],
      [3, 4],
    ]
    const rotated = rotateMatrix(matrix)
    expect(rotated).toEqual([
      [3, 1],
      [4, 2],
    ])
  })

  it('should rotate a 3x3 matrix correctly', () => {
    const matrix = [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
    ]
    const rotated = rotateMatrix(matrix)
    expect(rotated).toEqual([
      [7, 4, 1],
      [8, 5, 2],
      [9, 6, 3],
    ])
  })
})
