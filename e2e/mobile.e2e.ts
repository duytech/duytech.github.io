import { expect, test, type Page } from '@playwright/test'

async function expectNoHorizontalScroll(page: Page) {
  // Compare against the device width, not innerWidth: mobile browsers widen the layout viewport to fit overflowing content.
  const screenWidth = page.viewportSize()!.width
  const contentWidth = await page.evaluate(() => document.documentElement.scrollWidth)
  expect(contentWidth, 'page is wider than the screen').toBeLessThanOrEqual(screenWidth)
}

for (const path of ['/', '/salary-calculator', '/loan-calculator', '/cagr-calculator']) {
  test(`${path} fits the screen`, async ({ page }) => {
    await page.goto(path)
    await expect(page.locator('h1')).toBeVisible()
    await expectNoHorizontalScroll(page)
  })
}

test('loan schedule scrolls inside its box, not the whole page', async ({ page }) => {
  await page.goto('/loan-calculator')
  await page.getByLabel('Số tiền vay (VNĐ)').fill('5000000000')
  await page.getByLabel('Lãi suất (%/năm)').fill('10')
  await page.getByLabel('Thời gian vay (tháng)').fill('240')

  const scrollBox = page.locator('.table-scroll')
  await expect(scrollBox).toBeVisible()
  await expectNoHorizontalScroll(page)
  const boxWidths = await scrollBox.evaluate((element) => ({ content: element.scrollWidth, visible: element.clientWidth }))
  expect(boxWidths.content, 'schedule table should be wider than the screen and scroll').toBeGreaterThan(boxWidths.visible)
})

test('salary results fit the screen with a very large salary', async ({ page }) => {
  await page.goto('/salary-calculator')
  await page.getByLabel('Lương Gross (VNĐ/tháng)').fill('999999999999')
  await expect(page.locator('.salary-results')).toBeVisible()
  await expectNoHorizontalScroll(page)
})
