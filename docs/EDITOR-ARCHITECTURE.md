# Owner-only editor architecture

## Status and deployment decision

**Decision: do not deploy an editor in this repository yet.** This document and
`editor/content-contract.json` are a contract for a later implementation, not a
running dashboard, API, or deployment configuration.

The application is a static Astro site. Static assets have no request-time
application code, durable authenticated session, or safe write path to the Git
working tree. A future editor must therefore be a separate Cloudflare
Access-protected service or Worker; it must not change public Astro rendering,
deployment configuration, or the static-first model.

A separate service is justified only after browser-based owner writes, reviewed
least-privilege Git credentials outside the repository, upload storage and
limits, and the Git build/deploy path are approved and operationally tested.

## Canonical sources and write boundary

The portable, published sources are exactly:

- Profile: `src/site.config.ts`
- Posts: `src/content/blog/`
- Projects: `src/content/projects/`
- Publications: `src/content/publications/main.bib`
- Images: `public/img/`

Markdown bodies/front matter, project Markdown, and `main.bib` remain the
source of truth. The contract is validation metadata, not a content store. The
complete canonical schema remains the Astro schemas and BibTeX parser; the
service must enforce both and reject unknown fields.

A service may write only the contract's exact roots/files. Every path must be
repository-relative, normalized, non-traversing, and resolved server-side from
an allowed operation—not selected by the client. It must reject absolute paths,
`..` segments, duplicate targets, and writes outside those roots. It must never
write arbitrary configuration, code, deployment files, or lockfiles.

Drafts are protected Git branches or pull requests using those same canonical
paths. Posts and projects move through **draft → review → publish**; publishing
means merging the approved change and letting the existing static build deploy
it. Profile changes may take an explicitly approved immediate Git path, but
still change only `src/site.config.ts`.

## Future editor authorization and operational controls

Cloudflare Access at the edge is necessary but insufficient. On every write
request, the service must verify the Access JWT signature, issuer, audience,
expiry, and applicable claims against current JWKS. It must fetch and refresh
JWKS and fail closed for absent/invalid JWTs and absent, invalid, unavailable,
or refresh-failed JWKS.

After successful verification, it must read the `email` claim, lowercase it,
and require an exact configured owner allow-list match. Never trust a header, an
unverified JWT payload, or client-supplied identity/path. Keep Access settings,
audiences, owner addresses, Git credentials, and storage tokens outside this
repository.

Each action needs a server-generated action ID and an idempotency key scoped to
the verified owner and operation. Safe retries must return the original result,
not create a second Git change. Record redacted audit events with timestamp,
action and idempotency IDs, verified owner email, operation, canonical paths,
base revision, result, and failure reason. Define retention before deployment
and restrict audit access to authorized operators.

Never overwrite on a revision conflict. Reject the request and require reload,
a fresh diff, and review before a new attempt. Use same-origin/CSRF protections,
rate and payload limits, and a narrowly scoped publishing credential.

## Media policy

The first upload capability is images only: JPEG, PNG, WebP, and AVIF, each at
most 10 MiB, 8192×8192 pixels, and 40,000,000 decoded pixels. The service must
perform server-side decoded inspection; it must reject SVG, PDFs, and video.

The server, not the client, generates a safe `public/img/` filename and maps it
to a `/img/` reference. Each image reference must bind to bounded descriptive
alt text. Empty alt text is permitted only when an explicit `decorative` flag is
true; otherwise it is rejected. The exact filename, MIME, dimension, pixel,
and alt-text rules are in the contract.

## Privacy and analytics

The public site remains privacy-first and aggregate-only: no visitor profiles,
advertising identifiers, cross-site tracking, or analytics cookies. Private
editor audit events are operational records, not public analytics.
