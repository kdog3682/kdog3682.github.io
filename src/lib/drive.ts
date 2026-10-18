// Build-time Google Drive listing for the worksheets page, through @paladin/gapi.
//
// Drive layout expected:
//   <DRIVE_WORKSHEETS_FOLDER_ID>/
//     G4/  *.pdf
//     G5/  *.pdf
//     G6/  *.pdf
//
// Two ways in, tried in this order:
//   1. DRIVE_API_KEY set (GitHub Actions): the public Drive REST API. The root folder must be
//      shared as "anyone with the link can view"; restrict the key to the Drive API only.
//   2. otherwise @paladin/gapi, which signs in with the local OAuth credentials
//      (see paladin/packages/gapi/docs/API.md), so it only works on your machine.
// If neither works the sections render empty instead of failing the build.

export const GRADES = [
  { folder: "G4", label: "Grade 4" },
  { folder: "G5", label: "Grade 5" },
  { folder: "G6", label: "Grade 6" },
] as const

export type Worksheet = {
  id: string
  name: string
  url: string
  createdTime: string
}

export type GradeSection = {
  folder: string
  label: string
  worksheets: Worksheet[]
}

// a sibling checkout, not a dependency: keeps `bun install` working where paladin isn't cloned
const GAPI = "../../../paladin/packages/gapi/src/index.ts"

function stripExtension(name: string) {
  return name.replace(/\.pdf$/i, "")
}

const API = "https://www.googleapis.com/drive/v3/files"
const FOLDER_MIME = "application/vnd.google-apps.folder"

type ApiFile = { id: string; name: string; webViewLink?: string; createdTime: string }

async function listChildren(apiKey: string, parentId: string, mime: string) {
  const files: ApiFile[] = []
  let pageToken: string | undefined
  do {
    const params = new URLSearchParams({
      key: apiKey,
      q: `'${parentId}' in parents and trashed = false and mimeType = '${mime}'`,
      fields: "nextPageToken, files(id, name, webViewLink, createdTime)",
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

async function viaApiKey(apiKey: string, rootId: string): Promise<GradeSection[]> {
  const folders = await listChildren(apiKey, rootId, FOLDER_MIME)
  return Promise.all(
    GRADES.map(async (grade) => {
      const folder = folders.find((f) => f.name.trim().toLowerCase() === grade.folder.toLowerCase())
      if (!folder) return { ...grade, worksheets: [] }
      const files = await listChildren(apiKey, folder.id, "application/pdf")
      const worksheets = files.map((f) => ({
        id: f.id,
        name: stripExtension(f.name),
        url: f.webViewLink ?? `https://drive.google.com/file/d/${f.id}/view`,
        createdTime: f.createdTime,
      }))
      return { ...grade, worksheets }
    }),
  )
}

export async function getWorksheetSections(): Promise<GradeSection[]> {
  const rootId = import.meta.env.DRIVE_WORKSHEETS_FOLDER_ID
  const empty = GRADES.map((g) => ({ ...g, worksheets: [] }))

  if (!rootId) {
    console.warn("[worksheets] DRIVE_WORKSHEETS_FOLDER_ID missing, rendering empty sections")
    return empty
  }

  try {
    const apiKey = import.meta.env.DRIVE_API_KEY
    if (apiKey) return await viaApiKey(apiKey, rootId)

    const { Drive } = await import(/* @vite-ignore */ GAPI)
    const entries = await new Drive().walk(rootId)

    return GRADES.map((grade) => {
      const worksheets = entries
        .filter(({ rel, file }) => rel.trim().toLowerCase() === grade.folder.toLowerCase() && file.mimeType === "application/pdf")
        .map(({ file }) => ({
          id: file.id,
          name: stripExtension(file.name),
          url: `https://drive.google.com/file/d/${file.id}/view`,
          createdTime: file.createdTime,
        }))
        .sort((a, b) => a.name.localeCompare(b.name))
      return { ...grade, worksheets }
    })
  } catch (err) {
    console.warn(`[worksheets] could not list Drive, rendering empty sections: ${err instanceof Error ? err.message : err}`)
    return empty
  }
}
