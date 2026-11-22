import { useState } from "react"
import { Chinese } from "./Chinese"

type Props = {
  title: string
  author?: string
  /** stanzas separated by a blank line, one line of verse per line */
  zh: string
  /** same shape as `zh`: same number of stanzas and lines */
  en?: string
}

const stanzas = (s: string) =>
  s
    .trim()
    .split(/\n\s*\n/)
    .map((st) => st.trim().split("\n").map((l) => l.trim()).filter(Boolean))

export function Poem({ title, author, zh, en }: Props) {
  const [pinyin, setPinyin] = useState(false)
  const [english, setEnglish] = useState(false)
  const zhStanzas = stanzas(zh)
  const enStanzas = en ? stanzas(en) : null
  const showEn = english && !!enStanzas

  return (
    <section className="not-prose relative my-8 rounded-2xl border border-border p-6">
      <div className="absolute right-3 top-3 flex gap-1">
        <Toggle label="pinyin" icon="拼" on={pinyin} set={setPinyin} />
        {enStanzas && <Toggle label="english" icon="A" on={english} set={setEnglish} />}
      </div>

      <header className="mb-6 text-center">
        <h2 className="text-xl font-semibold">{title}</h2>
        {author && <p className="mt-1 text-sm text-muted-foreground">{author}</p>}
      </header>

      <div className={showEn ? "grid grid-cols-1 sm:grid-cols-2" : "text-center"}>
        {zhStanzas.flatMap((lines, i) =>
          lines.map((line, j) => {
            const last = j === lines.length - 1 && i < zhStanzas.length - 1
            const pad = last ? "pb-6" : ""
            return (
              <PoemRow
                key={`${i}-${j}`}
                line={line}
                en={showEn ? enStanzas?.[i]?.[j] : undefined}
                pinyin={pinyin}
                pad={pad}
              />
            )
          }),
        )}
      </div>
    </section>
  )
}

function Toggle({ label, icon, on, set }: { label: string; icon: string; on: boolean; set: (v: boolean) => void }) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      aria-pressed={on}
      onClick={() => set(!on)}
      className={`flex h-8 w-8 items-center justify-center rounded-md text-sm transition-colors ${
        on ? "bg-foreground text-background" : "text-muted-foreground hover:bg-muted"
      }`}
    >
      {icon}
    </button>
  )
}

function PoemRow({ line, en, pinyin, pad }: { line: string; en?: string; pinyin: boolean; pad: string }) {
  const zh = (
    <p className={`py-1 text-lg ${pinyin ? "leading-[2.6]" : "leading-8"} ${pad} ${en !== undefined ? "sm:border-r sm:border-dashed sm:border-muted-foreground/50 sm:pr-6" : ""}`}>
      <Chinese text={line} pinyin={pinyin} />
    </p>
  )
  if (en === undefined) return zh
  return (
    <>
      {zh}
      <p className={`flex items-center pb-3 text-sm leading-6 text-muted-foreground sm:py-1 sm:pl-6 ${pad}`}>{en}</p>
    </>
  )
}
