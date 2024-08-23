function Projects() {
    return (
      <div className='projects-container'>
        <h1>Projects</h1>
        <div className='projects'>
          <div className='project'>
            <a target="_blank" href="https://celestes-notetaker.onrender.com/"><img src="/images/NoteTakerDash.png" alt="NotetakerDash" /></a>
            <h2> Celeste's Notetaker app</h2>
            <p className='project-description'>Notetaker app with functions for pinning, deleting, searching and editing notes with optional due dates, made using <span className='technologies'>Django </span></p>
            <div className="project-buttons">
            <a target="_blank" href="https://celestes-notetaker.onrender.com/"><button className='project-button'>View Live</button></a>
            <a target="_blank" href="https://github.com/Miguell0706/notetaker"><button className='project-button'>View Source</button></a>
            </div>
          </div>
          <div className='project'>
            <a target="_blank" href="https://miguels-weather-app.netlify.app/"><img src="/images/WeatherDashboard.png" alt="WeatherDashboard" /></a>
            <h2>Weather app</h2>
            <p className='project-description'>Weather app allowing user to search a city and retrieve weather information for the day as well as forecast, made using <span className='technologies'>React </span></p>
            <div className="project-buttons">
              <a target="_blank" href="https://miguels-weather-app.netlify.app/"><button className='project-button'>View Live</button></a>
              <a target="_blank" href="https://github.com/Miguell0706/weather-app"><button className='project-button'>View Source</button></a>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Export the component so it can be used in other parts of the app
  export default Projects;