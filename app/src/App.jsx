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

function NotFound() {
  return <h1>Page not found</h1>
}

export default function App() {
  return (
    <div className="container">
      <nav>
        <NavLink to="/" end>Home</NavLink>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  )
}
