import assert from "node:assert/strict"
import { test } from "node:test"
import { buildImageKitUrl, getProjectImageSrcSet } from "../lib/utils/imagekit.ts"

test("ImageKit URLs encode spaces inside path segments", () => {
  const url = buildImageKitUrl("/prodigy corp/88shots_so.png", ["w-640", "q-82"])

  assert.equal(url.includes(" "), false)
  assert.match(url, /\/prodigy%20corp\/88shots_so\.png$/)
})

test("project srcset candidates keep one URL and one descriptor", () => {
  const candidates = getProjectImageSrcSet("/prodigy corp/88shots_so.png", 82)

  assert.equal(candidates.every((candidate) => !/\s/.test(candidate.src)), true)
  assert.equal(candidates.every((candidate) => /^\d+w$/.test(candidate.descriptor)), true)
})
