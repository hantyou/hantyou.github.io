import assert from "node:assert/strict"
import { existsSync, readFileSync } from "node:fs"
import { isAbsolute, relative, resolve, sep } from "node:path"
import { fileURLToPath } from "node:url"
import test from "node:test"

type FieldPolicy = { type: string | string[]; required: boolean }
type Collection = {
  canonicalSourcePaths: string[]
  stateBehavior: string
  fieldPolicies: Record<string, FieldPolicy>
  rejectUnknownFields: boolean
}
type Contract = {
  schemaVersion: number
  status: string
  sourceOfTruth: {
    rule: string
    canonicalSchema: string
    prohibited: string[]
  }
  sourceWriteBoundary: {
    canonicalRootsOrFiles: string[]
    pathRules: {
      repositoryRelativeOnly: boolean
      normalized: boolean
      nonTraversing: boolean
      clientSelectedPaths: boolean
      writesOutsideContractRoots: boolean
      forbidden: string[]
    }
  }
  collections: Record<string, Collection>
  permittedMetadata: { projects: string[]; bibtex: string[] }
  media: {
    canonicalSourcePaths: string[]
    firstAllowedClasses: Array<{
      name: string
      mimeTypes: string[]
      maxBytes: number
      maxWidth: number
      maxHeight: number
      maxDecodedPixels: number
    }>
    inspection: {
      serverSideDecodedInspectionRequired: boolean
      forbiddenFormats: string[]
      deferredClasses: string[]
    }
    generatedFilename: {
      serverGeneratedOnly: boolean
      pathPattern: string
      noClientFilenameOrPath: boolean
    }
    payloadMapping: {
      imageReferenceFormat: string
      altTextField: string
      altTextRequired: boolean
      altTextMinLength: number
      altTextMaxLength: number
      decorativeImages: {
        allowed: boolean
        flagField: string
        whenTrue: string
        whenFalseOrAbsent: string
      }
    }
    requiredMetadata: string[]
  }
  authorization: {
    jwt: {
      required: boolean
      verifyOnEveryRequest: boolean
      verify: string[]
      jwks: { fetchAndRefresh: boolean; failureMode: string }
      failureMode: string
    }
    ownerIdentity: {
      claim: string
      normalization: string
      match: string
      allowListRole: string
    }
    audit: {
      requiredFields: string[]
      redactSecrets: boolean
      retention: string
      access: string
    }
    conflicts: {
      neverOverwrite: boolean
      requireFreshDiffAndReview: boolean
      onBaseRevisionMismatch: string
    }
    idempotency: {
      required: boolean
      actionId: string
      idempotencyKey: string
      retrySafety: string
    }
  }
}

const repositoryRoot = resolve(fileURLToPath(new URL("../", import.meta.url)))
const contractPath = new URL("../editor/content-contract.json", import.meta.url)
const contract = JSON.parse(readFileSync(contractPath, "utf8")) as Contract

const expectedCollectionPaths = {
  profile: ["src/site.config.ts"],
  posts: ["src/content/blog"],
  projects: ["src/content/projects"],
  publications: ["src/content/publications/main.bib"],
}

const expectedProjectFields = [
  "title",
  "selected",
  "fromDate",
  "toDate",
  "code",
  "doc",
  "paper",
  "url",
  "release",
  "types",
  "skills",
  "description",
  "parentProject",
  "timelineLabel",
  "timelineOrder",
  "researchQuestion",
  "contribution",
  "relatedPublications",
]

const expectedBibtexFields = [
  "title",
  "author",
  "year",
  "month",
  "journal",
  "booktitle",
  "volume",
  "number",
  "pages",
  "doi",
  "url",
  "pdf",
  "publisher",
  "organization",
  "school",
  "note",
  "selected",
  "image",
  "keywords",
  "summary",
  "contribution",
  "project",
]

function assertExactKeys(value: Record<string, unknown>, expected: string[]) {
  assert.deepEqual(Object.keys(value).sort(), [...expected].sort())
}

void test("editor content contract has enforceable collection policies", () => {
  assert.equal(contract.schemaVersion, 2)
  assert.equal(contract.status, "non-deployed-foundation")
  assert.match(contract.sourceOfTruth.rule, /canonical/i)
  assert.match(contract.sourceOfTruth.canonicalSchema, /Astro/i)
  assert.match(contract.sourceOfTruth.canonicalSchema, /reject unknown fields/i)
  assert.deepEqual(contract.sourceOfTruth.prohibited, [
    "database",
    "authoritative JSON content mirror",
  ])

  assertExactKeys(contract.collections, [
    "profile",
    "posts",
    "projects",
    "publications",
  ])
  for (const [name, expectedPaths] of Object.entries(expectedCollectionPaths)) {
    const collection = contract.collections[name]
    assert.deepEqual(collection.canonicalSourcePaths, expectedPaths)
    assert.match(collection.stateBehavior, /Git/i)
    assert.equal(collection.rejectUnknownFields, true)
    for (const policy of Object.values(collection.fieldPolicies)) {
      assert.ok(policy.type)
      assert.equal(typeof policy.required, "boolean")
    }
  }

  assert.match(contract.collections.profile.stateBehavior, /immediately/i)
  for (const name of ["posts", "projects"]) {
    assert.match(contract.collections[name].stateBehavior, /draft/i)
    assert.match(contract.collections[name].stateBehavior, /review/i)
    assert.match(contract.collections[name].stateBehavior, /publish/i)
  }

  assertExactKeys(contract.collections.profile.fieldPolicies, [
    "name",
    "othernames",
    "tagline",
    "email",
    "location",
    "phone",
    "pronouns",
    "pronunciation",
    "pronunciationAudioPath",
    "links",
    "researchInterests",
    "linksPlacement",
  ])
  assertExactKeys(contract.collections.posts.fieldPolicies, [
    "title",
    "description",
    "createdAt",
    "updatedAt",
    "order",
    "image",
    "tags",
    "authors",
    "draft",
    "stage",
    "audience",
    "body",
  ])
  assertExactKeys(contract.collections.projects.fieldPolicies, [
    ...expectedProjectFields,
    "body",
  ])
  assertExactKeys(contract.collections.publications.fieldPolicies, [
    "entryType",
    "citationKey",
    ...expectedBibtexFields,
  ])
  assert.deepEqual(contract.permittedMetadata.projects, expectedProjectFields)
  assert.deepEqual(contract.permittedMetadata.bibtex, expectedBibtexFields)

  assert.deepEqual(
    contract.collections.posts.fieldPolicies.stage.type,
    "string",
  )
  assert.deepEqual(
    (
      contract.collections.posts.fieldPolicies.stage as FieldPolicy & {
        allowedValues: string[]
      }
    ).allowedValues,
    ["seedling", "budding", "evergreen"],
  )
  assert.deepEqual(
    contract.collections.projects.fieldPolicies.title.type,
    "string",
  )
  assert.deepEqual(
    contract.collections.projects.fieldPolicies.timelineOrder.type,
    "integer",
  )
  assert.deepEqual(
    contract.collections.publications.fieldPolicies.entryType.type,
    "string",
  )
  assert.deepEqual(
    contract.collections.publications.fieldPolicies.citationKey.type,
    "string",
  )
})

void test("editor write boundary permits only exact normalized canonical paths", () => {
  const expectedBoundaryPaths = [
    "src/site.config.ts",
    "src/content/blog",
    "src/content/projects",
    "src/content/publications/main.bib",
    "public/img",
  ]
  assert.deepEqual(
    contract.sourceWriteBoundary.canonicalRootsOrFiles,
    expectedBoundaryPaths,
  )
  assert.deepEqual(contract.sourceWriteBoundary.pathRules, {
    repositoryRelativeOnly: true,
    normalized: true,
    nonTraversing: true,
    clientSelectedPaths: false,
    writesOutsideContractRoots: false,
    forbidden: [
      "absolute paths",
      ".. path segments",
      "arbitrary config files",
      "code files",
      "deployment files",
      "lockfiles",
    ],
  })

  const paths = [
    ...Object.values(contract.collections).flatMap(
      (collection) => collection.canonicalSourcePaths,
    ),
    ...contract.media.canonicalSourcePaths,
  ]
  assert.deepEqual(paths, expectedBoundaryPaths)
  assert.equal(
    new Set(paths).size,
    paths.length,
    "canonical paths must be unique",
  )
  for (const sourcePath of paths) {
    assert.equal(
      isAbsolute(sourcePath),
      false,
      `${sourcePath} must be relative`,
    )
    assert.equal(sourcePath.split(/[\\/]/).includes(".."), false)
    assert.equal(sourcePath, sourcePath.replaceAll("\\", "/"))
    const resolved = resolve(repositoryRoot, sourcePath)
    assert.equal(
      resolved === repositoryRoot ||
        resolved.startsWith(`${repositoryRoot}${sep}`),
      true,
      `${sourcePath} must remain inside the repository`,
    )
    assert.ok(
      existsSync(resolved),
      `Expected canonical source path to exist: ${sourcePath}`,
    )
  }
})

void test("editor media policy is image-only, bounded, and accessible", () => {
  assert.deepEqual(contract.media.canonicalSourcePaths, ["public/img"])
  assert.deepEqual(contract.media.firstAllowedClasses, [
    {
      name: "jpeg",
      mimeTypes: ["image/jpeg"],
      maxBytes: 10485760,
      maxWidth: 8192,
      maxHeight: 8192,
      maxDecodedPixels: 40000000,
    },
    {
      name: "png",
      mimeTypes: ["image/png"],
      maxBytes: 10485760,
      maxWidth: 8192,
      maxHeight: 8192,
      maxDecodedPixels: 40000000,
    },
    {
      name: "webp",
      mimeTypes: ["image/webp"],
      maxBytes: 10485760,
      maxWidth: 8192,
      maxHeight: 8192,
      maxDecodedPixels: 40000000,
    },
    {
      name: "avif",
      mimeTypes: ["image/avif"],
      maxBytes: 10485760,
      maxWidth: 8192,
      maxHeight: 8192,
      maxDecodedPixels: 40000000,
    },
  ])
  assert.deepEqual(contract.media.inspection, {
    serverSideDecodedInspectionRequired: true,
    forbiddenFormats: ["image/svg+xml", "svg"],
    deferredClasses: ["pdf", "video"],
  })
  assert.deepEqual(contract.media.generatedFilename, {
    serverGeneratedOnly: true,
    pathPattern:
      "public/img/[a-z0-9][a-z0-9-]{0,79}-(?:[a-f0-9]{16})\\.(?:jpg|png|webp|avif)",
    noClientFilenameOrPath: true,
  })
  assert.deepEqual(contract.media.requiredMetadata, ["altText"])
  assert.deepEqual(contract.media.payloadMapping, {
    imageReferenceFormat: "/img/<generated-filename>",
    altTextField: "altText",
    altTextRequired: true,
    altTextMinLength: 1,
    altTextMaxLength: 250,
    decorativeImages: {
      allowed: true,
      flagField: "decorative",
      whenTrue: "altText must be exactly empty",
      whenFalseOrAbsent: "altText must be nonempty descriptive text",
    },
  })
})

void test("editor authorization, audit, conflict, and retry policies fail closed", () => {
  assert.deepEqual(contract.authorization.jwt, {
    required: true,
    verifyOnEveryRequest: true,
    verify: ["signature", "issuer", "audience", "expiry", "applicable claims"],
    jwks: {
      fetchAndRefresh: true,
      failureMode:
        "fail-closed for absent, invalid, unavailable, or refresh-failed JWKS",
    },
    failureMode: "fail-closed for absent or invalid JWT",
  })
  assert.deepEqual(contract.authorization.ownerIdentity, {
    claim: "email",
    normalization: "lowercase",
    match: "exact allow-list match after verified JWT",
    allowListRole: "defense in depth",
  })
  assert.deepEqual(contract.authorization.audit.requiredFields, [
    "timestamp",
    "actionId",
    "idempotencyKey",
    "authenticatedOwnerEmail",
    "operation",
    "canonicalPaths",
    "baseRevision",
    "result",
    "failureReason",
  ])
  assert.equal(contract.authorization.audit.redactSecrets, true)
  assert.match(contract.authorization.audit.retention, /defined/i)
  assert.match(contract.authorization.audit.access, /authorized/i)
  assert.deepEqual(contract.authorization.conflicts, {
    neverOverwrite: true,
    requireFreshDiffAndReview: true,
    onBaseRevisionMismatch: "reject and require reload, fresh diff, and review",
  })
  assert.equal(contract.authorization.idempotency.required, true)
  assert.match(contract.authorization.idempotency.actionId, /server-generated/i)
  assert.match(
    contract.authorization.idempotency.idempotencyKey,
    /authenticated owner/i,
  )
  assert.match(
    contract.authorization.idempotency.retrySafety,
    /never create a second Git change/i,
  )
})
