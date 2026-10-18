import { NavLink, Route, Routes } from "react-router-dom"

function Home() {
  return (
    <>
      <h1>Hello 👋</h1>
      <p>My name is <strong>Kevin</strong>.</p>
      <p>I am a math teacher for <strong>G3/G4/G5</strong>.</p>
      <p>I enjoy coding as a hobby to make math assignments.</p>
      <p>Get in touch at <a href="mailto:kevinlulee1@gmail.com">kevinlulee1@gmail.com</a>.</p>
      <p>Cheers,<br />Kevin</p>
    </>
  )
}

function Work() {
  return (
    <>
      <h1>Work</h1>
      <ul className="links">
        <li><a href="codework.html">Part-time job: coding assistant</a></li>
        <li><a href="journal.html">Journal</a></li>
        <li><a href="animals/cats.html">Cats</a></li>
        <li><a href="animals/dogs.html">Dogs</a></li>
      </ul>
    </>
  )
}

function NotFound() {
  return <h1>Page not found</h1>
}

export default function App() {
  return (
    <div className="container">
      <nav>
        <NavLink to="/" end>Home</NavLink>
        <NavLink to="/work">Work</NavLink>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/work" element={<Work />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  )
}
