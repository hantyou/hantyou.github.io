import { spawn } from "node:child_process"

const checks = [
  { label: "format", args: ["format:check"] },
  { label: "lint", args: ["lint"] },
  { label: "style lint", args: ["lint:styles"] },
  { label: "Markdown tests", args: ["test:markdown"] },
  { label: "Astro check", args: ["astro", "check"] },
  { label: "production build", args: ["build"] },
]

const pnpm = process.platform === "win32" ? "pnpm.cmd" : "pnpm"

function runCheck({ label, args }) {
  return new Promise((resolve, reject) => {
    const child = spawn(pnpm, args, {
      cwd: process.cwd(),
      stdio: ["ignore", "pipe", "pipe"],
    })
    const output = []

    child.stdout.on("data", (chunk) => output.push(chunk))
    child.stderr.on("data", (chunk) => output.push(chunk))
    child.on("error", reject)
    child.on("close", (code) => resolve({ code, label, output }))
  })
}

for (const check of checks) {
  let result
  try {
    result = await runCheck(check)
  } catch (error) {
    console.error(`Verification could not start ${check.label}.`)
    console.error(error instanceof Error ? error.message : error)
    process.exitCode = 1
    break
  }

  if (result.code !== 0) {
    console.error(`Verification failed during ${result.label}.`)
    process.stderr.write(Buffer.concat(result.output))
    process.exitCode = result.code ?? 1
    break
  }
}

if (process.exitCode === undefined) {
  console.log(`Verification passed (${checks.length} checks).`)
}
