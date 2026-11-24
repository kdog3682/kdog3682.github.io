import { Fragment, useLayoutEffect, useRef } from "react"
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
// each clause is an atomic, nowrap inline-block, so it moves to the next line whole. a clause wider than
// the line by itself (e.g. with pinyin on a phone) is measured and only then allowed to wrap inside,
// balanced so it splits evenly (4+3) rather than orphaning a character.
// wrapped halves follow the parent's text-align. with `pinyin`, each character gets its reading
// above it (ruby); pinyin is computed at build time.
export function Chinese({ text, pinyin: withPinyin = false }: Props) {
  const clauses = text.match(CLAUSE) ?? [text]
  const readings = withPinyin ? pinyin(text, { type: "array" }) : []
  const ref = useRef<HTMLSpanElement>(null)
  useFitClauses(ref, text, withPinyin)
  let at = 0

  return (
    <span ref={ref} lang="zh-Hans">
      {clauses.map((c, k) => {
        const start = at
        const chars = [...c]
        at += chars.length
        return (
          <span key={k} className="inline-block max-w-full whitespace-nowrap">
            {withPinyin
              ? chars.map((ch, i) =>
                  HAN.test(ch) ? (
                    // <wbr>: webkit won't break a line between adjacent <ruby>s on its own
                    <Fragment key={i}>
                      {i > 0 && <wbr />}
                      <ruby className="mx-px [ruby-position:over]">
                        {ch}
                        <rt className="text-[0.6em] leading-none text-muted-foreground">{readings[start + i]}</rt>
                      </ruby>
                    </Fragment>
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

// lets a clause wrap (balanced) only when its one-line width exceeds the line's width; re-measured on resize.
// styles are set inline, which react leaves alone since the clause spans have no style prop.
function useFitClauses(ref: React.RefObject<HTMLSpanElement | null>, text: string, withPinyin: boolean) {
  useLayoutEffect(() => {
    const root = ref.current
    const line = root?.parentElement
    if (!root || !line) return
    const clauses = [...root.children] as HTMLElement[]
    const fit = () => {
      const cs = getComputedStyle(line)
      const avail = line.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight)
      for (const c of clauses) Object.assign(c.style, { whiteSpace: "", textWrap: "", maxWidth: "none", width: "max-content" })
      const widths = clauses.map((c) => c.getBoundingClientRect().width)
      clauses.forEach((c, i) => {
        const wrap = widths[i] > avail + 0.5
        Object.assign(c.style, { maxWidth: "", width: "", whiteSpace: wrap ? "normal" : "", textWrap: wrap ? "balance" : "" })
      })
    }
    fit()
    const ro = new ResizeObserver(fit)
    ro.observe(line)
    document.fonts?.ready.then(fit)
    return () => ro.disconnect()
  }, [text, withPinyin])
}
