import { chromium } from "playwright"

const baseUrl = process.env.BASE_URL ?? "http://localhost:3000"

const run = async () => {
  const browser = await chromium.launch()
  const page = await browser.newPage()

  await page.goto(baseUrl, { waitUntil: "domcontentloaded" })

  await page.waitForTimeout(500)
  await page.screenshot({ path: "artifacts/home-0_5s.png", fullPage: true })

  await page.waitForTimeout(3000)
  await page.screenshot({ path: "artifacts/home-3_5s.png", fullPage: true })

  await browser.close()
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
