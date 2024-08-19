import { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/index.css';
import './styles/about.css';
import './styles/projects.css';
import './styles/contact.css';
import './styles/nav.css';
import About from './About';
import Projects from './Projects';
import Contact from './Contact';
import Nav from './Nav';
import Starfield from './Starfield';

function App() {
  useEffect(() => {
    const cursor = document.querySelector('.cursor');
    const trailContainer = document.createElement('div');
    trailContainer.className = 'trail-container';
    document.body.appendChild(trailContainer);

    const createTrail = (x, y) => {
      const trail = document.createElement('div');
      trail.className = 'trail';
      trail.style.top = `${y}px`; // No need to adjust for cursor size here
      trail.style.left = `${x}px`; // No need to adjust for cursor size here
      trailContainer.appendChild(trail);

      setTimeout(() => {
        trail.style.opacity = 0;
        setTimeout(() => trail.remove(), 500); // Remove after fade-out
      }, 100); // Delay before starting fade-out
    };
    const createRing = (x, y) => {
      const ring = document.createElement('div');
      ring.className = 'ring';
      
      // Assuming the ring is 20px by 20px, adjust by half of its size (10px)
      ring.style.top = `${y}px`;  // Center vertically
      ring.style.left = `${x}px`; // Center horizontally
      if (window.innerWidth < 768) {
        ring.style.left = `${x-5}px`; // Center horizontally
      }
      else if (window.innerWidth > 1024) {
        ring.style.left = `${x+7}px`; // Center horizontally
      };

      trailContainer.appendChild(ring);
      setTimeout(() => {
        ring.style.transform = 'scale(3)'; // Expand the ring
        ring.style.opacity = 0; // Fade out the ring
        setTimeout(() => ring.remove(), 600); // Remove the ring after the animation
      }, 0); // Start the animation immediately
    };
    const handleMouseMove = (e) => {
      const x = e.pageX - cursor.offsetWidth / 2;
      const y = e.pageY - cursor.offsetHeight / 2;
      cursor.style.top = `${y}px`;
      cursor.style.left = `${x}px`;
      cursor.style.opacity = 1; // Ensure the cursor is visible when moving

      createTrail(e.pageX, e.pageY); // Pass the raw coordinates to createTrail
    };

    const handleMouseClick = (e) => {
      const x = e.pageX;
      const y = e.pageY;
      createRing(x, y);
    };

    const handleMouseLeave = () => {
      cursor.style.opacity = 0; // Hide the cursor when the mouse leaves
    };

    const handleMouseEnter = () => {
      cursor.style.opacity = 1; // Show the cursor when the mouse re-enters
    };

    document.addEventListener('click', handleMouseClick);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    // Cleanup event listeners on component unmount
    return () => {
      document.removeEventListener('click', handleMouseClick);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
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

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
