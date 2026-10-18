import { Card, CardContent, CardHeader, CardTitle } from "@paladin/shadcn"
import type { GradeSection } from "../lib/drive"

type Props = {
  section: GradeSection
}

export function WorksheetSection({ section }: Props) {
  const { folder, label, worksheets } = section

  return (
    <Card id={folder.toLowerCase()}>
      <CardHeader>
        <CardTitle>{label}</CardTitle>
      </CardHeader>
      <CardContent>
        {worksheets.length === 0 ? (
          <p className="text-sm text-muted-foreground">No worksheets yet.</p>
        ) : (
          <ul className="space-y-2">
            {worksheets.map((w) => (
              <li key={w.id}>
                <a
                  href={w.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline underline-offset-4"
                >
                  {w.name}
                  <span className="ml-1 text-muted-foreground" aria-hidden>
                    ↗
                  </span>
                </a>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
