import { pinyin } from "pinyin-pro"

type Props = {
  text: string
  pinyin?: boolean
}

const HAN = /\p{Script=Han}/u

// clauses: runs of text ending in punctuation, e.g. "驾鹤西去十七载，" + "常在梦中泪相会。"
const CLAUSE = /[^，。！？；：、,.!?;:]+[，。！？；：、,.!?;:]*/g

// one line of Chinese. a line only wraps between clauses (after a comma etc.), never mid-clause,
// so a narrow screen breaks a verse line into halves instead of orphaning its last character or two.
// wrapped halves follow the parent's text-align. with `pinyin`, each character gets its reading
// above it (ruby); pinyin is computed at build time.
export function Chinese({ text, pinyin: withPinyin = false }: Props) {
  const clauses = text.match(CLAUSE) ?? [text]
  const readings = withPinyin ? pinyin(text, { type: "array" }) : []
  let at = 0

  return (
    <span lang="zh-Hans">
      {clauses.map((c, k) => {
        const start = at
        const chars = [...c]
        at += chars.length
        return (
          <span key={k} className="inline-block whitespace-nowrap">
            {withPinyin
              ? chars.map((ch, i) =>
                  HAN.test(ch) ? (
                    <ruby key={i} className="mx-px [ruby-position:over]">
                      {ch}
                      <rt className="text-[0.6em] leading-none text-muted-foreground">{readings[start + i]}</rt>
                    </ruby>
                  ) : (
                    <span key={i}>{ch}</span>
                  ),
                )
              : c}
          </span>
        )
      })}
    </span>
  )
}
