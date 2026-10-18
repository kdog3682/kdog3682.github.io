import type { GradeSection } from "../lib/drive"
import { WorksheetSection } from "./WorksheetSection"

type Props = {
  sections: GradeSection[]
}

export function WorksheetsPage({ sections }: Props) {
  return (
    <>
      <h1 className="text-3xl font-semibold tracking-tight">Math worksheets</h1>
      <p className="mt-2 text-muted-foreground">
        Grades 4, 5, and 6. Each worksheet is a PDF that opens in your browser.
      </p>

      <nav className="mt-6 flex gap-4 text-sm">
        {sections.map((s) => (
          <a
            key={s.folder}
            href={`#${s.folder.toLowerCase()}`}
            className="text-muted-foreground hover:text-foreground"
          >
            {s.label}
          </a>
        ))}
      </nav>

      <div className="mt-8 space-y-6">
        {sections.map((section) => (
          <WorksheetSection key={section.folder} section={section} />
        ))}
      </div>
    </>
  )
}
