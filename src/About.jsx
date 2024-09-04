import React from "react";
import AboutModels from "./AboutModels"; // Adjust the import path as needed

function About() {
  return (
    <div className="about-container">
      <h1>About</h1>
      <p>
        A passionate developer that has become a dedicated lifelong learner of
        software development. I have a keen eye for creative design and
        interactive experiences. With a strong foundation in <span className='technologies'>React </span>
        and <span className='technologies'>Django</span>, I enjoy building dynamic web applications that
        blend robust functionality with aesthetic appeal.
        <br />
        <br />
        Always exploring new technologies and techniques, my focus is on
        developing unique features like custom animations, 3D effects, and
        real-time data integration to push the boundaries of
        web development and create innovative solutions that stand out.
        <br />
        <br />
        All my projects are made with <span className='technologies'>vanilla css</span>, <span className='technologies'>html,</span> and either <span className='technologies'>javascript</span>,
        <span className='technologies'> python</span>, or a combination of both.
      </p>
      <AboutModels />
    </div>
  );
}

// Export the component so it can be used in other parts of the app
export default About;
