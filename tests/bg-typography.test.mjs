import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { test } from "node:test"

const root = new URL("../", import.meta.url)
const read = (path) => readFileSync(new URL(path, root), "utf8")

test("Bulgarian pages load a Cyrillic-friendly font token", () => {
  const layout = read("app/layout.tsx")
  const globals = read("app/globals.css")

  assert.match(layout, /Sofia_Sans/)
  assert.match(layout, /variable:\s*"--font-bg-sans"/)
  assert.match(layout, /bgSans\.variable/)
  assert.match(globals, /html\[lang="bg"\][\s\S]*var\(--font-bg-sans,\s*"Sofia Sans"/)
  assert.match(globals, /html\[lang="bg"\][\s\S]*--default-font-family:\s*var\(--font-bg-sans/)
  assert.ok(
    globals.indexOf('html[lang="bg"] body') > globals.indexOf(".sr-only"),
    "Bulgarian font overrides must live outside the Tailwind base layer",
  )
})

test("Bulgarian typography reduces Latin monospace spacing", () => {
  const globals = read("app/globals.css")

  assert.match(globals, /--bg-heading-tracking-tight:\s*-0\.012em/)
  assert.match(globals, /--bg-label-tracking:\s*0\.08em/)
  assert.match(globals, /--bg-tight-leading:\s*1\.08/)
  assert.match(globals, /html\[lang="bg"\][\s\S]*tracking-\\\[-0\\\.03em\\\]/)
  assert.match(globals, /html\[lang="bg"\][\s\S]*leading-\\\[0\\\.98\\\]/)
})

test("hero copy dictionaries match annotated layout", () => {
  const en = JSON.parse(read("lib/translations/en.json"))
  const bg = JSON.parse(read("lib/translations/bg.json"))

  assert.equal(en.hero.title.line1, "Premium")
  assert.equal(en.hero.title.line2, "Digital Products")
  assert.equal(en.hero.title.line3, "")
  assert.equal(en.hero.sideLabel, "")
  assert.equal(en.hero.sideTitle.line1, "POWERED BY")
  assert.equal(en.hero.sideTitle.line2, "AI")
  assert.equal(en.hero.sideSubtitle, "")

  assert.equal(bg.hero.title.line1, "Premium")
  assert.equal(bg.hero.title.line2, "Дигитални")
  assert.equal(bg.hero.title.line3, "Продукти")
  assert.equal(bg.hero.sideLabel, "")
  assert.equal(bg.hero.sideTitle.line1, "POWERED BY")
  assert.equal(bg.hero.sideTitle.line2, "AI")
  assert.equal(bg.hero.sideSubtitle, "")
})

test("Bulgarian section headings use sentence case", () => {
  const bg = JSON.parse(read("lib/translations/bg.json"))

  assert.equal(bg.services.title, "Нашите услуги")
  assert.equal(bg.services.apps.mobile.title, "Мобилни приложения")
  assert.equal(bg.services.apps.web.title, "Уеб приложения")
  assert.equal(bg.services.apps.desktop.title, "Десктоп приложения")
  assert.equal(bg.about.story.title, "Нашата история")
  assert.equal(bg.contact.title, "Заедно създаваме<br/>успех")
  assert.equal(bg.contact.form.submit, "Изпратете съобщение")
})
