import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { join } from "node:path"
import { test } from "node:test"

test("proxy forwards pathname to server components for locale detection", () => {
  const source = readFileSync(join(process.cwd(), "proxy.ts"), "utf8")

  assert.match(source, /new Headers\(request\.headers\)/)
  assert.match(source, /requestHeaders\.set\("x-pathname", pathname\)/)
  assert.match(source, /NextResponse\.next\(\{\s*request:\s*\{\s*headers:\s*requestHeaders\s*\},?\s*\}\)/)
})
