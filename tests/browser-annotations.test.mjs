import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { join } from "node:path"
import { describe, it } from "node:test"

const readSource = (path) => readFileSync(join(process.cwd(), path), "utf8")

describe("browser annotation UI contracts", () => {
  it("keeps the top navigation actions visible on small screens", () => {
    const source = readSource("components/navigation/Navigation.tsx")
    const actionWrapper = source.match(/<div className="([^"]+)">\s*<a\s+href="#contact"/)

    assert.match(source, />PRODIGY CORP<\/span>/)
    assert.doesNotMatch(source, />Prodigy Corp<\/span>/)
    assert.ok(actionWrapper, "expected a wrapper around the contact action and language switcher")
    assert.ok(!actionWrapper[1].split(/\s+/).includes("hidden"), "contact and language actions should not be hidden on mobile")
  })

  it("does not duplicate the contact action inside the expanded menu", () => {
    const source = readSource("components/navigation/Navigation.tsx")
    const menuItemsBlock = source.match(/const menuItems = \[([\s\S]*?)\]/)

    assert.ok(menuItemsBlock, "expected navigation menuItems definition")
    assert.doesNotMatch(menuItemsBlock[1], /key:\s*"contact"/)
    assert.match(source, /href="#contact"/)
  })

  it("uses localized CTA copy for the top navigation contact action", () => {
    const bg = JSON.parse(readSource("lib/translations/bg.json"))
    const en = JSON.parse(readSource("lib/translations/en.json"))

    assert.equal(bg.navigation.contact, "Свържи се")
    assert.equal(en.navigation.contact, "Let’s talk")
  })

  it("keeps the expanded mobile menu inline instead of rendering a second row", () => {
    const source = readSource("components/navigation/Navigation.tsx")

    assert.doesNotMatch(source, /className="hidden min-w-0 items-center[^"]*sm:flex"/)
    assert.doesNotMatch(source, /className="[^"]*sm:hidden[^"]*"/)
    assert.match(source, /isCompactViewport \? "calc\(100vw - 170px\)"/)
  })

  it("balances mobile expanded menu spacing and keeps contact radius controlled", () => {
    const source = readSource("components/navigation/Navigation.tsx")
    const contactLink = source.match(/<a\s+href="#contact"\s+className="([^"]+)"/)

    assert.match(source, /className="flex min-w-0 flex-1 items-center gap-0\.5 pl-2 pr-1 min-\[360px\]:gap-1 min-\[360px\]:pl-4/)
    assert.match(source, /min-\[390px\]:text-\[10px\]/)
    assert.ok(contactLink, "expected mobile contact action")
    assert.match(contactLink[1], /rounded-\[14px\]/)
    assert.match(contactLink[1], /sm:rounded-full/)
    assert.ok(!contactLink[1].split(/\s+/).includes("rounded-full"), "mobile contact should not use rounded-full")
  })

  it("uses SVG flags on mobile instead of emoji fallback flags", () => {
    const source = readSource("components/LanguageSwitcher.tsx")

    assert.match(source, /const FlagComponent = language\.code === "en" \? USFlag : BulgarianFlag/)
    assert.doesNotMatch(source, /isTouchDevice/)
    assert.doesNotMatch(source, /navigator\.maxTouchPoints/)
    assert.doesNotMatch(source, /language\.flag/)
  })

  it("uses a phone icon instead of a plus sign for the phone contact row", () => {
    const source = readSource("components/contact/ContactSection.tsx")

    assert.match(source, /function PhoneIcon\(\)/)
    assert.match(source, /icon:\s*<PhoneIcon\s*\/>/)
    assert.doesNotMatch(source, /icon:\s*"\+"/)
  })

  it("removes the footer brand blurb and places socials above the copyright", () => {
    const source = readSource("components/Footer.tsx")
    const socialIndex = source.indexOf('t("contact.social.followUs")')
    const copyrightIndex = source.indexOf("© {new Date().getFullYear()} Prodigy Corp")

    assert.doesNotMatch(source, /Digital Systems/i)
    assert.doesNotMatch(source, /t\("hero\.subtitle"\)/)
    assert.doesNotMatch(source, /\(c\) \{new Date\(\)\.getFullYear\(\)\} Prodigy Corp/)
    assert.ok(socialIndex !== -1, "expected footer social heading")
    assert.ok(copyrightIndex !== -1, "expected copyright symbol text")
    assert.ok(socialIndex < copyrightIndex, "social links should be rendered before the copyright")
  })
})
