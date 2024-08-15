import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import Hero from './Hero'
import About from './About'
import Projects from './Projects'
import Contact from './Contact'
import Nav from './Nav'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Nav/>
    <Hero />
    <About/>
    <Projects/>
    <Contact/>
  </StrictMode>
)
