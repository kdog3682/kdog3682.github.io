import { pinyin } from "pinyin-pro"

type Props = {
  text: string
  pinyin?: boolean
}

const HAN = /\p{Script=Han}/u

// one line of Chinese. with `pinyin`, each character gets its reading above it (ruby);
// punctuation and other characters are left alone. pinyin is computed at build time.
export function Chinese({ text, pinyin: withPinyin = false }: Props) {
  const chars = [...text]
  if (!withPinyin) return <span lang="zh-Hans">{text}</span>

  const readings = pinyin(text, { type: "array" })
  return (
    <span lang="zh-Hans" className="inline-flex flex-wrap items-end">
      {chars.map((ch, i) =>
        HAN.test(ch) ? (
          <ruby key={i} className="mx-px [ruby-position:over] text-center">
            {ch}
            <rt className="text-[0.6em] leading-none text-muted-foreground">{readings[i]}</rt>
          </ruby>
        ) : (
          <span key={i}>{ch}</span>
        ),
      )}
    </span>
  )
}
