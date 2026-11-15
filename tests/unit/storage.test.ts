import { describe, it, expect, beforeEach } from 'vitest'
import { getHighScore, saveHighScore } from '../../src/lib/storage'

describe('localStorage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  describe('getHighScore', () => {
    it('should return 0 when no high score is stored', () => {
      expect(getHighScore()).toBe(0)
    })

    it('should return stored high score', () => {
      localStorage.setItem('tetris.highScore', '5000')
      expect(getHighScore()).toBe(5000)
    })

    it('should return 0 for invalid stored value', () => {
      localStorage.setItem('tetris.highScore', 'invalid')
      expect(getHighScore()).toBe(0)
    })
  })

  describe('saveHighScore', () => {
    it('should save high score when it is higher', () => {
      saveHighScore(1000)
      expect(getHighScore()).toBe(1000)
    })

    it('should not save high score when it is lower than existing', () => {
      localStorage.setItem('tetris.highScore', '5000')
      saveHighScore(3000)
      expect(getHighScore()).toBe(5000)
    })

    it('should overwrite when score is equal', () => {
      saveHighScore(1000)
      saveHighScore(1000)
      expect(getHighScore()).toBe(1000)
    })
  })
})
