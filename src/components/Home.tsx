// home page: intentionally links to nothing else on the site

const ABOUT = [
  "I was born in Changsha, China.",
  "I grew up in Lynnwood, Washington.",
  "I attended the University of Washington and studied biochemistry.",
  "I work as a math tutor.",
]

export function Home() {
  return (
    <>
      <header>
        <h1 className="text-4xl font-semibold tracking-tight">
          Kevin Lee <span className="text-muted-foreground">李璐</span>
        </h1>
      </header>

      <section className="mt-8 space-y-2 text-lg leading-relaxed">
        {ABOUT.map((line) => (
          <p key={line}>{line}</p>
        ))}
      </section>
    </>
  )
}
