import { expect, test, type Locator, type Page } from '@playwright/test'

// Expected amounts are the hand-checked cases from src/*.test.ts, so unit and E2E tests agree.

function resultValue(scope: Page | Locator, label: string): Locator {
  // `has` is matched inside each row, so the row header locator must start from the page, not from `scope`.
  const page = 'page' in scope ? scope.page() : scope
  return scope.locator('tr').filter({ has: page.getByRole('rowheader', { name: label }) }).locator('td')
}

// Compare digits only, so the test does not depend on how the browser formats ₫, spaces or the minus sign.
async function expectMoney(cell: Locator, amount: number) {
  await expect(cell).toHaveText(/\d/)
  expect((await cell.innerText()).replace(/\D/g, '')).toBe(String(amount))
}

test.describe('salary calculator', () => {
  const employee = (page: Page) => page.locator('section').filter({ hasText: 'Người lao động' })
  const employer = (page: Page) => page.locator('section').filter({ hasText: 'Công ty đóng' })

  test.beforeEach(async ({ page }) => {
    await page.goto('/salary-calculator')
    await page.getByLabel('Lương Gross (VNĐ/tháng)').fill('30000000')
  })

  test('30M, region I, no dependents', async ({ page }) => {
    await expectMoney(resultValue(employee(page), 'Bảo hiểm xã hội'), 2_400_000)
    await expectMoney(resultValue(page, 'Thuế thu nhập cá nhân'), 635_000)
    await expectMoney(resultValue(page, 'Lương Net'), 26_215_000)
    await expectMoney(resultValue(employer(page), 'Tổng chi phí công ty'), 36_450_000)
  })

  test('tax per bracket', async ({ page }) => {
    const bracketRows = page.locator('section').filter({ hasText: 'Chi tiết thuế TNCN theo bậc' }).locator('tbody tr')
    await expect(bracketRows).toHaveCount(2)
    await expectMoney(bracketRows.nth(0).locator('td').last(), 500_000)
    await expectMoney(bracketRows.nth(1).locator('td').last(), 135_000)
  })

  test('1 dependent lowers the tax', async ({ page }) => {
    await page.getByLabel('Số người phụ thuộc').fill('1')
    await expectMoney(resultValue(page, 'Thuế thu nhập cá nhân'), 257_500)
    await expectMoney(resultValue(page, 'Lương Net'), 26_592_500)
  })

  test('separate insurance salary', async ({ page }) => {
    await page.getByLabel('Lương đóng bảo hiểm (VNĐ/tháng)').fill('10000000')
    await expectMoney(resultValue(page, 'Thuế thu nhập cá nhân'), 845_000)
    await expectMoney(resultValue(page, 'Lương Net'), 28_105_000)
  })

  test('all-inclusive salary', async ({ page }) => {
    await page.getByLabel('Lương trọn gói').check()
    await expectMoney(resultValue(page, 'Lương Net'), 20_155_000)
    await expectMoney(resultValue(page, 'Tổng chi phí công ty'), 30_000_000)
  })

  test('region changes the unemployment insurance cap', async ({ page }) => {
    await page.getByLabel('Lương Gross (VNĐ/tháng)').fill('120000000')
    await page.getByLabel('Vùng', { exact: true }).selectOption({ label: 'Vùng IV' })
    await expectMoney(resultValue(employee(page), 'Bảo hiểm thất nghiệp'), 740_000)
  })
})

test.describe('loan calculator', () => {
  async function fillLoan(page: Page, principal: string, rate: string, months: string) {
    await page.goto('/loan-calculator')
    await page.getByLabel('Số tiền vay (VNĐ)').fill(principal)
    await page.getByLabel('Lãi suất (%/năm)').fill(rate)
    await page.getByLabel('Thời gian vay (tháng)').fill(months)
  }

  test('reducing balance: 120M, 12%, 12 months', async ({ page }) => {
    await fillLoan(page, '120000000', '12', '12')
    await expectMoney(resultValue(page, 'Số tiền trả tháng đầu'), 11_200_000)
    await expectMoney(resultValue(page, 'Tổng lãi phải trả'), 7_800_000)
    await expectMoney(resultValue(page, 'Tổng gốc và lãi phải trả'), 127_800_000)

    const scheduleRows = page.locator('table.schedule tbody tr')
    await expect(scheduleRows).toHaveCount(12)
    await expectMoney(scheduleRows.last().locator('td').last(), 0)
  })

  test('equal payments: 100M, 12%, 12 months', async ({ page }) => {
    await fillLoan(page, '100000000', '12', '12')
    await page.getByLabel('Phương pháp tính').selectOption({ label: 'Gốc, lãi chia đều hàng tháng' })
    await expectMoney(resultValue(page, 'Số tiền trả tháng đầu'), 8_884_879)
  })
})

test.describe('CAGR calculator', () => {
  async function fillCagr(page: Page, startValue: string, endValue: string, periods: string) {
    await page.goto('/cagr-calculator')
    await page.getByLabel('Giá trị ban đầu (VNĐ)').fill(startValue)
    await page.getByLabel('Giá trị cuối kỳ (VNĐ)').fill(endValue)
    await page.getByLabel('Số kỳ').fill(periods)
  }

  test('doubling in 5 periods', async ({ page }) => {
    await fillCagr(page, '100000000', '200000000', '5')
    await expect(resultValue(page, 'Tổng tăng trưởng')).toHaveText(/^100\s?%$/)
    await expect(resultValue(page, 'CAGR (%/kỳ)')).toHaveText(/^14,87\s?%$/)
  })

  test('halving in 2 periods', async ({ page }) => {
    await fillCagr(page, '100000000', '50000000', '2')
    await expect(resultValue(page, 'CAGR (%/kỳ)')).toHaveText(/^[-−]29,29\s?%$/)
  })
})

for (const [path, hint] of [
  ['/salary-calculator', 'Nhập lương Gross để xem kết quả.'],
  ['/loan-calculator', 'Nhập số tiền vay, lãi suất và thời gian vay để xem kết quả.'],
  ['/cagr-calculator', 'Nhập giá trị ban đầu, giá trị cuối kỳ và số kỳ để xem kết quả.'],
]) {
  test(`${path} shows a hint and no results before input`, async ({ page }) => {
    await page.goto(path)
    await expect(page.getByText(hint)).toBeVisible()
    await expect(page.locator('.salary-results')).toHaveCount(0)
  })
}
