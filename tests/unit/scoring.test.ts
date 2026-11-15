import { describe, it, expect } from 'vitest'
import { calculateScore, calculateLevel, SCORE_TABLE } from '../../src/lib/scoring'

describe('SCORE_TABLE', () => {
  it('should have scores for 1-4 lines', () => {
    expect(SCORE_TABLE[1]).toBe(100)
    expect(SCORE_TABLE[2]).toBe(300)
    expect(SCORE_TABLE[3]).toBe(500)
    expect(SCORE_TABLE[4]).toBe(800)
  })
})

describe('calculateScore', () => {
  it('should return correct score for 1 line at level 0', () => {
    expect(calculateScore(1, 0)).toBe(100)
  })

  it('should return correct score for 4 lines at level 0', () => {
    expect(calculateScore(4, 0)).toBe(800)
  })

  it('should multiply score by level + 1', () => {
    expect(calculateScore(1, 1)).toBe(200)
    expect(calculateScore(1, 2)).toBe(300)
  })

  it('should return 0 for unknown line count', () => {
    expect(calculateScore(5, 0)).toBe(0)
  })
})

describe('calculateLevel', () => {
  it('should return 0 for less than 10 lines', () => {
    expect(calculateLevel(0)).toBe(0)
    expect(calculateLevel(9)).toBe(0)
  })

  it('should return correct level for multiples of 10', () => {
    expect(calculateLevel(10)).toBe(1)
    expect(calculateLevel(20)).toBe(2)
    expect(calculateLevel(100)).toBe(10)
  })
})
