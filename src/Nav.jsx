import { useEffect } from 'react';

function Nav() {
  let aboutContainer, projectsContainer, contactContainer;

  useEffect(() => {
    // Query the DOM elements after the component has mounted
    aboutContainer = document.querySelector('.about-container');
    projectsContainer = document.querySelector('.projects-container');
    contactContainer = document.querySelector('.contact-container');
  }, []); // The empty array means this runs once, after the initial render

  const openAbout = () => {
    if (aboutContainer) aboutContainer.style.display = 'block';
    if (projectsContainer) projectsContainer.style.display = 'none';
    if (contactContainer) contactContainer.style.display = 'none';
  };

  const openProjects = () => {
    if (projectsContainer) projectsContainer.style.display = 'block';
    if (aboutContainer) aboutContainer.style.display = 'none';
    if (contactContainer) contactContainer.style.display = 'none';
  };

  const openContact = () => {
    if (contactContainer) contactContainer.style.display = 'block';
    if (projectsContainer) projectsContainer.style.display = 'none';
    if (aboutContainer) aboutContainer.style.display = 'none';
  };

  return (
    <div className='nav-container'>
      <a href="#about" onClick={openAbout}>About</a>
      <a href="#projects" onClick={openProjects}>Projects</a>
      <a href="#contact" onClick={openContact}>Contact</a>
    </div>
  );
}

export default Nav;
