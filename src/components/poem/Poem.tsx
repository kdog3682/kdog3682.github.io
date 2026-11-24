import { useState } from "react"
import { Chinese } from "./Chinese"

type Props = {
  title: string
  author?: string
  /** english title / author, shown under the chinese only when `showHeaderEn` is set */
  titleEn?: string
  authorEn?: string
  showHeaderEn?: boolean
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

export function Poem({ title, author, titleEn, authorEn, showHeaderEn = false, zh, en }: Props) {
  const [pinyin, setPinyin] = useState(false)
  const [english, setEnglish] = useState(false)
  const zhStanzas = stanzas(zh)
  const enStanzas = en ? stanzas(en) : null
  const showEn = english && !!enStanzas

  return (
    <section className="not-prose relative my-8 rounded-2xl border border-border p-6">
      {/* in flow on mobile (its own row above the title); pinned to the corner from sm up */}
      <div className="-mr-3 -mt-3 mb-2 flex justify-end gap-1 sm:absolute sm:right-3 sm:top-3 sm:m-0">
        <Toggle label="pinyin" icon="拼" on={pinyin} set={setPinyin} />
        {enStanzas && <Toggle label="english" icon="A" on={english} set={setEnglish} />}
      </div>

      <header className="mb-6 text-center sm:px-20">
        <h2 className={`text-xl font-semibold ${pinyin ? "leading-[2.4]" : ""}`}>
          <Chinese text={title} pinyin={pinyin} />
        </h2>
        {showHeaderEn && titleEn && <p className="text-sm text-muted-foreground">{titleEn}</p>}
        {author && (
          <p className={`mt-1 text-sm text-muted-foreground ${pinyin ? "leading-[2.4]" : ""}`}>
            <Chinese text={author} pinyin={pinyin} />
          </p>
        )}
        {showHeaderEn && authorEn && <p className="text-xs text-muted-foreground">{authorEn}</p>}
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
  const withEn = en !== undefined
  // the chinese is centered with or without english, so toggling english doesn't move it.
  // stacked (mobile), the stanza gap goes under the english line, not between a line and its translation.
  const zh = (
    <p
      className={`py-1 text-center text-lg ${pinyin ? "leading-[2.6]" : "leading-8"} ${
        withEn ? `sm:border-r sm:border-dashed sm:border-muted-foreground/50 sm:pr-6 ${pad ? "sm:pb-6" : ""}` : pad
      }`}
    >
      <Chinese text={line} pinyin={pinyin} />
    </p>
  )
  if (!withEn) return zh
  return (
    <>
      {zh}
      <p className={`flex items-center justify-center pb-3 text-center text-sm leading-6 text-muted-foreground sm:justify-start sm:py-1 sm:pl-6 sm:text-left ${pad}`}>{en}</p>
    </>
  )
}
