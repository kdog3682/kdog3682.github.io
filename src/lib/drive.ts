// Build-time Google Drive listing for the worksheets page, through @paladin/gapi.
//
// Drive layout expected:
//   <DRIVE_WORKSHEETS_FOLDER_ID>/
//     G4/  *.pdf
//     G5/  *.pdf
//     G6/  *.pdf
//
// gapi signs in with the local OAuth credentials (see paladin/packages/gapi/docs/API.md), so
// the listing only works on a machine that has them. Anywhere else (CI, a fresh clone) the
// sections render empty instead of failing the build.

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

export async function getWorksheetSections(): Promise<GradeSection[]> {
  const rootId = import.meta.env.DRIVE_WORKSHEETS_FOLDER_ID
  const empty = GRADES.map((g) => ({ ...g, worksheets: [] }))

  if (!rootId) {
    console.warn("[worksheets] DRIVE_WORKSHEETS_FOLDER_ID missing, rendering empty sections")
    return empty
  }

  try {
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
    console.warn(`[worksheets] could not list Drive through @paladin/gapi, rendering empty sections: ${err instanceof Error ? err.message : err}`)
    return empty
  }
}
