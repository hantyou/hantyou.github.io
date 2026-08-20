# Editor foundation

This directory is a **non-deployed foundation** for a future owner-only editor.
It adds no dashboard, API, authentication route, Cloudflare binding, dependency,
or deployment behavior. The public Astro site remains static.

`content-contract.json` is machine-readable policy for the only canonical
sources a future editor may change. Markdown/front matter and `main.bib` remain
portable sources of truth; this JSON file is not content storage. The full
canonical schema remains the Astro schemas and BibTeX parser, and a service
must reject unknown fields.

## Future implementation sequence

1. Build a separate private editor service or Worker; do not add write handling
   to the static Astro asset deployment.
2. Put its route behind Cloudflare Access. On every request, verify the JWT
   signature, issuer, audience, expiry, and applicable claims using fetched and
   refreshed JWKS. Fail closed for absent/invalid JWTs or JWKS failures.
3. Normalize the verified `email` claim to lowercase and require an exact owner
   allow-list match. Do not trust client identity, a header, or an unverified
   JWT payload.
4. Enforce the contract server-side: permit only its exact repository-relative,
   normalized, non-traversing canonical paths; derive paths server-side; reject
   duplicate targets, unknown fields, and all config/code/deployment/lockfile
   writes outside the contract roots.
5. Implement only contract-compliant image uploads. Decode and inspect JPEG,
   PNG, WebP, or AVIF server-side; enforce byte, width, height, and decoded
   pixel limits; reject SVG, PDF, and video; generate filenames server-side;
   and bind every reference to bounded alt text (or explicit decorative empty
   alt text).
6. Create protected Git branches or pull requests for post and project drafts.
   On conflicts, never overwrite: require reload, a fresh diff, and review.
   Use server action IDs and owner-scoped idempotency keys so retries cannot
   create duplicate Git changes.
7. Store a least-privilege publishing credential in the service secret manager,
   not this repository. Record redacted audit events with defined retention and
   restricted operator access. Add CSRF/origin protections and rate limits.
8. Confirm that merged changes trigger the existing static build and that no
   editor code or controls reach public visitors.

## Implementation gates

Do not deploy until a threat review approves all of the following:

- request-time Access JWT/JWKS fail-closed verification and exact normalized
  owner allow-list enforcement;
- canonical-source/write-boundary and unknown-field enforcement;
- least-privilege credential scope, server-side media inspection, and accessible
  image-reference/alt-text mapping;
- audit field set, redaction, retention, and authorized access;
- conflict, fresh-diff/review, idempotency, and retry-safety behavior; and
- protected-branch workflow and static-build publishing path.

Keep public analytics aggregate-only and free of visitor profiles or cookies.
Never commit owner emails, Access audiences, credentials, storage tokens, or
deployment IDs here.

## Contract test

After implementing contract changes, run:

```bash
pnpm test:editor-contract
```

The Node built-in-only test parses under the existing
`node --experimental-strip-types --test` command. It checks canonical files,
exact path boundaries, field allowlists/types, media limits and rejections, and
structured security, conflict, audit, and retry policy.