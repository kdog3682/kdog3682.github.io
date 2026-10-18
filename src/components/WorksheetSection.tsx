import { formatDate } from "../lib/date"
import type { GradeSection, Worksheet } from "../lib/drive"

/** the small print under a worksheet: what the manifest knows, in a fixed order */
function details({ pages, size, modifiedTime, createdTime }: Worksheet) {
  const bits: string[] = []
  if (pages) bits.push(`${pages} ${pages === 1 ? "page" : "pages"}`)
  if (size) bits.push(size < 1024 * 1024 ? `${Math.round(size / 1024)} KB` : `${(size / 1024 / 1024).toFixed(1)} MB`)
  bits.push(`updated ${formatDate(new Date(modifiedTime ?? createdTime))}`)
  return bits
}

type Props = {
  section: GradeSection
}

export function WorksheetSection({ section }: Props) {
  const { folder, label, worksheets } = section

  return (
    <section id={folder.toLowerCase()} className="rounded-xl border border-border p-6">
      <h2 className="text-lg font-semibold">{label}</h2>
      <div className="mt-4">
        {worksheets.length === 0 ? (
          <p className="text-sm text-muted-foreground">No worksheets yet.</p>
        ) : (
          <ul className="space-y-2">
            {worksheets.map((w) => (
              <li key={w.id}>
                <a href={w.url} className="font-medium hover:underline underline-offset-4">
                  {w.name}
                </a>
                {w.description && <p className="mt-0.5 text-sm text-muted-foreground">{w.description}</p>}
                <p className="mt-0.5 text-xs tabular-nums text-muted-foreground">{details(w).join(" · ")}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
