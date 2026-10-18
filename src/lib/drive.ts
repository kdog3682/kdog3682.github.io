// Build-time Google Drive listing for the worksheets page.
//
// Drive layout expected:
//   <DRIVE_WORKSHEETS_FOLDER_ID>/
//     G4/  *.pdf
//     G5/  *.pdf
//     G6/  *.pdf
//
// The PDFs are downloaded into public/worksheets/<grade>/ (git-ignored) and linked from there,
// so visitors get a direct file from GitHub Pages, never a Drive page or Drive's download quota.
//
// Two ways to reach Drive, tried in this order:
//   1. DRIVE_API_KEY set (GitHub Actions): the public Drive REST API. The root folder must be
//      shared as "anyone with the link can view"; restrict the key to the Drive API only.
//   2. otherwise @paladin/gapi, which signs in with the local OAuth credentials
//      (see paladin/packages/gapi/docs/API.md), so it only works on your machine.
// If neither works the sections render empty instead of failing the build.
//
// syncWorksheets() runs once at startup (see astro.config.ts) and leaves .worksheets/manifest.json;
// the page only reads that, so dev needs a restart to see Drive changes.

import { existsSync, mkdirSync, readFileSync, readdirSync, renameSync, rmSync, statSync, writeFileSync } from "node:fs"
import { join } from "node:path"

export const GRADES = [
  { folder: "G4", label: "Grade 4" },
  { folder: "G5", label: "Grade 5" },
  { folder: "G6", label: "Grade 6" },
] as const

export type Worksheet = {
  id: string
  name: string
  /** direct link to the PDF on this site */
  url: string
  /** the file's Drive description, set with publish-worksheet --description */
  description?: string
  /** page count, stored by publish-worksheet */
  pages?: number
  /** size in bytes */
  size?: number
  createdTime: string
  modifiedTime?: string
}

export type GradeSection = {
  folder: string
  label: string
  worksheets: Worksheet[]
}

/** a PDF in Drive, whichever way it was found */
type Remote = {
  id: string
  name: string
  createdTime: string
  modifiedTime?: string
  size?: number
  description?: string
  pages?: number
  /** writes the file's bytes to `dest` */
  save: (dest: string) => Promise<void>
}

type Listing = Record<string, Remote[]>

// a sibling checkout, not a dependency: keeps `bun install` working where paladin isn't cloned
const GAPI = "../../../paladin/packages/gapi/src/index.ts"

const PUBLIC_DIR = join(process.cwd(), "public", "worksheets")

const stripExtension = (name: string) => name.replace(/\.pdf$/i, "")
const slugify = (name: string) => stripExtension(name).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")

// --- Drive REST API, for CI

const API = "https://www.googleapis.com/drive/v3/files"
const FOLDER_MIME = "application/vnd.google-apps.folder"

type ApiFile = { id: string; name: string; size?: string; createdTime: string; modifiedTime?: string; description?: string; properties?: { pages?: string } }

async function listChildren(apiKey: string, parentId: string, mime: string) {
  const files: ApiFile[] = []
  let pageToken: string | undefined
  do {
    const params = new URLSearchParams({
      key: apiKey,
      q: `'${parentId}' in parents and trashed = false and mimeType = '${mime}'`,
      fields: "nextPageToken, files(id, name, size, createdTime, modifiedTime, description, properties)",
      orderBy: "name",
      pageSize: "1000",
    })
    if (pageToken) params.set("pageToken", pageToken)
    const res = await fetch(`${API}?${params}`)
    if (!res.ok) throw new Error(`Drive API ${res.status}: ${await res.text()}`)
    const body = (await res.json()) as { files: ApiFile[]; nextPageToken?: string }
    files.push(...body.files)
    pageToken = body.nextPageToken
  } while (pageToken)
  return files
}

async function listViaApiKey(apiKey: string, rootId: string): Promise<Listing> {
  const folders = await listChildren(apiKey, rootId, FOLDER_MIME)
  const entries = await Promise.all(
    GRADES.map(async ({ folder: grade }): Promise<[string, Remote[]]> => {
      const folder = folders.find((f) => f.name.trim().toLowerCase() === grade.toLowerCase())
      if (!folder) return [grade, []]
      const files = await listChildren(apiKey, folder.id, "application/pdf")
      return [
        grade,
        files.map((f) => ({
          id: f.id,
          name: f.name,
          createdTime: f.createdTime,
          modifiedTime: f.modifiedTime,
          size: f.size ? Number(f.size) : undefined,
          description: f.description,
          pages: f.properties?.pages ? Number(f.properties.pages) : undefined,
          save: async (dest) => {
            const res = await fetch(`${API}/${f.id}?alt=media&key=${apiKey}`)
            if (!res.ok) throw new Error(`Drive download ${res.status} for ${f.name}`)
            writeFileSync(dest, new Uint8Array(await res.arrayBuffer()))
          },
        })),
      ]
    }),
  )
  return Object.fromEntries(entries)
}

// --- @paladin/gapi, locally

async function listViaGapi(rootId: string): Promise<Listing> {
  const { Drive } = await import(/* @vite-ignore */ GAPI)
  const entries = await new Drive().walk(rootId)
  return Object.fromEntries(
    GRADES.map(({ folder: grade }) => [
      grade,
      entries
        .filter(({ rel, file }: any) => rel.trim().toLowerCase() === grade.toLowerCase() && file.mimeType === "application/pdf")
        .map(({ file }: any): Remote => ({
          id: file.id,
          name: file.name,
          createdTime: file.createdTime,
          size: file.size,
          save: async (dest) => {
            // saveTo skips a file that is already there, and names it after the Drive file
            const saved: string = await file.saveTo(join(dest, ".."))
            if (saved !== dest) renameSync(saved, dest)
          },
        })),
    ]),
  )
}

// --- downloading

/** downloads what's new or changed, drops what's gone from Drive, and returns the site links */
async function publish(grade: string, remotes: Remote[]): Promise<Worksheet[]> {
  const dir = join(PUBLIC_DIR, grade)
  mkdirSync(dir, { recursive: true })

  const worksheets: Worksheet[] = []
  const kept = new Set<string>()

  for (const remote of remotes.sort((a, b) => a.name.localeCompare(b.name))) {
    const file = `${slugify(remote.name)}.pdf`
    const dest = join(dir, file)
    kept.add(file)

    const current = existsSync(dest) && remote.size !== undefined && statSync(dest).size === remote.size
    if (!current) {
      rmSync(dest, { force: true })
      await remote.save(dest)
    }
    worksheets.push({
      id: remote.id,
      name: stripExtension(remote.name),
      url: `/worksheets/${grade}/${file}`,
      description: remote.description,
      pages: remote.pages,
      size: remote.size,
      createdTime: remote.createdTime,
      modifiedTime: remote.modifiedTime,
    })
  }

  for (const file of readdirSync(dir)) if (!kept.has(file)) rmSync(join(dir, file), { force: true })
  return worksheets
}

const MANIFEST = join(process.cwd(), ".worksheets", "manifest.json")

const emptySections = (): GradeSection[] => GRADES.map((g) => ({ ...g, worksheets: [] }))

/**
 * Lists Drive, downloads the PDFs into public/worksheets/ and writes the manifest the page reads.
 * Runs from an astro integration at startup, before astro snapshots public/ for the build.
 */
export async function syncWorksheets(): Promise<void> {
  const rootId = process.env.DRIVE_WORKSHEETS_FOLDER_ID
  let sections = emptySections()

  if (!rootId) {
    console.warn("[worksheets] DRIVE_WORKSHEETS_FOLDER_ID missing, rendering empty sections")
  } else {
    try {
      const apiKey = process.env.DRIVE_API_KEY
      const listing = apiKey ? await listViaApiKey(apiKey, rootId) : await listViaGapi(rootId)
      sections = await Promise.all(GRADES.map(async (g) => ({ ...g, worksheets: await publish(g.folder, listing[g.folder] ?? []) })))
    } catch (err) {
      console.warn(`[worksheets] could not list Drive, rendering empty sections: ${err instanceof Error ? err.message : err}`)
    }
  }

  mkdirSync(join(MANIFEST, ".."), { recursive: true })
  writeFileSync(MANIFEST, JSON.stringify(sections, null, 2))
}

/** what the last sync found; empty sections when it hasn't run */
export function getWorksheetSections(): GradeSection[] {
  try {
    return JSON.parse(readFileSync(MANIFEST, "utf8")) as GradeSection[]
  } catch {
    return emptySections()
  }
}
