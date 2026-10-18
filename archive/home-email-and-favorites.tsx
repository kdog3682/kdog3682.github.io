// removed from the home page, to be handled later

const EMAIL = "kdog3682@gmail.com"

const FAVORITES = [
  {
    heading: "books",
    items: [
      "Harry Potter",
      "The Name of the Wind",
      "Artemis Fowl",
      "A Series of Unfortunate Events",
      "Animorphs",
    ],
  },
  {
    heading: "movies",
    items: ["The Shawshank Redemption", "Your Name", "The Dark Knight"],
  },
  {
    heading: "foods",
    items: ["Burritos", "Crispy fish", "Guacamole and chips", "Beef noodles"],
  },
]

// the email line, inside the about <section>:
/*
        <p>
          Email:{" "}
          <a href={`mailto:${EMAIL}`} className="underline underline-offset-4">
            {EMAIL}
          </a>
        </p>
*/

// the favorites section, after the about <section>:
/*
      <section className="mt-12 grid gap-8 sm:grid-cols-3">
        {FAVORITES.map(({ heading, items }) => (
          <div key={heading}>
            <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
              Favorite {heading}
            </h2>
            <ul className="mt-3 space-y-1">
              {items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </section>
*/
