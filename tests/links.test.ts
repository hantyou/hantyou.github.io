import assert from "node:assert/strict"
import test from "node:test"

import { joinBase } from "../src/lib/links.ts"

void test("the site root resolves to the base without a trailing slash", () => {
  // `trailingSlash: "never"` is configured, and the dev server enforces it:
  // "/zhai/" 404s there even though static hosts serve the directory index.
  assert.equal(joinBase("/zhai", "/"), "/zhai")
  assert.equal(joinBase("/", "/"), "/")
  assert.equal(joinBase("", "/"), "/")
})

void test("internal paths are prefixed with the base", () => {
  assert.equal(joinBase("/zhai", "/talks"), "/zhai/talks")
  assert.equal(
    joinBase("/zhai", "/assets/pdf/slides.pdf"),
    "/zhai/assets/pdf/slides.pdf",
  )
  assert.equal(joinBase("zhai/", "/talks"), "/zhai/talks")
})

void test("a root base leaves paths untouched", () => {
  assert.equal(joinBase("/", "/talks"), "/talks")
  assert.equal(joinBase("", "/talks"), "/talks")
})

void test("paths already carrying the base are left alone", () => {
  assert.equal(joinBase("/zhai", "/zhai"), "/zhai")
  assert.equal(joinBase("/zhai", "/zhai/talks"), "/zhai/talks")
  assert.equal(joinBase("/zhai", "/zhai#top"), "/zhai#top")
  assert.equal(joinBase("/zhai", "/zhai?q=1"), "/zhai?q=1")
})

void test("external, protocol-relative, and fragment hrefs are untouched", () => {
  assert.equal(
    joinBase("/zhai", "https://example.com/x"),
    "https://example.com/x",
  )
  assert.equal(joinBase("/zhai", "//cdn.example.com/x"), "//cdn.example.com/x")
  assert.equal(joinBase("/zhai", "#section"), "#section")
  assert.equal(joinBase("/zhai", "mailto:a@b.c"), "mailto:a@b.c")
})

void test("query and fragment survive prefixing", () => {
  assert.equal(joinBase("/zhai", "/talks#slides"), "/zhai/talks#slides")
  assert.equal(
    joinBase("/zhai", "/publications?project=spear"),
    "/zhai/publications?project=spear",
  )
})
