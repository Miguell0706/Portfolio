function Projects() {
    return (
      <div className='projects-container'>
        <h1>Projects</h1>
        <div className='projects'>
          <div className='project'>
            <img src="/images/NoteTakerDash.png" alt="NotetakerDash" />
            <h2>Project 1</h2>
            <p className='project-description'>Description of project 1</p>
            <button className='project-button'>View Project</button>
          </div>
          <div className='project'>
            <img src="/images/WeatherDashboard.png" alt="WeatherDashboard" />
            <h2>Project 2</h2>
            <p className='project-description'>Description of project 2</p>
            <button className='project-button'>View Project</button>
          </div>
        </div>
      </div>
    );
  }
  
  // Export the component so it can be used in other parts of the app
  export default Projects;