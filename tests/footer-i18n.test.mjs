import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { join } from "node:path"
import { describe, it } from "node:test"

const readSource = (path) => readFileSync(join(process.cwd(), path), "utf8")

describe("footer internationalization", () => {
  it("has localized footer social copy in both dictionaries", () => {
    const en = JSON.parse(readSource("lib/translations/en.json"))
    const bg = JSON.parse(readSource("lib/translations/bg.json"))

    assert.equal(en.contact.social.followUs, "Follow us")
    assert.equal(bg.contact.social.followUs, "Последвайте ни")
  })

  it("lets the explicit pathname choose server locale before cookies or Accept-Language", () => {
    const source = readSource("lib/translations/server.ts")

    assert.match(source, /const pathnameHeader = headersList\.get\('x-pathname'\)/)
    assert.match(
      source,
      /if \(pathnameHeader\) \{[\s\S]*return pathnameHeader === '\/bg' \|\| pathnameHeader\.startsWith\('\/bg\/'\) \? 'bg' : 'en'[\s\S]*\}/,
    )
  })
})
