import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import "./styles/index.css";
import "./styles/about.css";
import "./styles/projects.css";
import "./styles/contact.css";
import "./styles/nav.css";
import About from "./About";
import Projects from "./Projects";
import Contact from "./Contact";
import Nav from "./Nav";
import Starfield from "./Starfield";

function App() {
  useEffect(() => {
    const cursor = document.querySelector(".cursor");
    const trailContainer = document.createElement("div");
    trailContainer.className = "trail-container";
    document.body.appendChild(trailContainer);

    const createTrail = (x, y) => {
      const trail = document.createElement("div");
      trail.className = "trail";
      trail.style.top = `${y}px`; 
      trail.style.left = `${x}px`; 
      trailContainer.appendChild(trail);

      setTimeout(() => {
        trail.style.opacity = 0;
        setTimeout(() => trail.remove(), 500); 
      }, 100);
    };

    const createRing = (x, y) => {
      const ring = document.createElement("div");
      ring.className = "ring";
      ring.style.top = `${y}px`; 
      ring.style.left = `${x}px`; 

      if (window.innerWidth < 768) {
        ring.style.left = `${x - 5}px`; 
      } else if (window.innerWidth > 1024) {
        ring.style.left = `${x + 7}px`; 
      }

      trailContainer.appendChild(ring);
      setTimeout(() => {
        ring.style.transform = "scale(3)";
        ring.style.opacity = 0; 
        setTimeout(() => ring.remove(), 600); 
      }, 0); 
    };

    const handleMouseMove = (e) => {
      const x = e.clientX - cursor.offsetWidth / 2;
      const y = e.clientY - cursor.offsetHeight / 2;
      cursor.style.top = `${y}px`;
      cursor.style.left = `${x}px`;
      cursor.style.opacity = 1;

      createTrail(e.clientX, e.clientY);
    };

    const handleMouseClick = (e) => {
      const x = e.clientX;
      const y = e.clientY;
      createRing(x, y);
    };

    const handleMouseLeave = () => {
      cursor.style.opacity = 0;
    };

    const handleMouseEnter = () => {
      cursor.style.opacity = 1;
    };

    document.addEventListener("click", handleMouseClick);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      document.removeEventListener("click", handleMouseClick);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
      trailContainer.remove();
    };
  }, []);

  return (
    <>
      <Starfield />
      <div className="cursor"></div>
      <Nav />
      <About />
      <Projects />
      <Contact />
    </>
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
