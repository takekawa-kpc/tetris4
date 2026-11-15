import { test, expect } from '@playwright/test'

test.describe('Tetris Game', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should display the title screen', async ({ page }) => {
    await expect(page.locator('h1', { hasText: 'TETRIS' })).toBeVisible()
    await expect(page.getByText('Press START to begin')).toBeVisible()
  })

  test('should show START button', async ({ page }) => {
    await expect(page.getByRole('button', { name: /START/i })).toBeVisible()
  })

  test('should start game when START is clicked', async ({ page }) => {
    await page.getByRole('button', { name: /START/i }).click()
    // Game board should be visible
    await expect(page.locator('.inline-block.border-2')).toBeVisible()
  })

  test('should display score after game starts', async ({ page }) => {
    await page.getByRole('button', { name: /START/i }).click()
    // Score display should be visible
    await expect(page.getByText('SCORE', { exact: true })).toBeVisible()
  })
})
