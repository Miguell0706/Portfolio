import { useEffect, useRef } from 'react';
import * as THREE from 'three';

function Nav() {
  const contactRef = useRef(null);

  useEffect(() => {
    // Set up the scene, camera, and renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      contactRef.current.clientWidth / contactRef.current.clientHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(contactRef.current.clientWidth, contactRef.current.clientHeight);
    contactRef.current.appendChild(renderer.domElement);
    camera.position.set(1, -0.2, 6);

    // Set up lighting
    const ambientLight = new THREE.AmbientLight(0x333333);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    scene.add(directionalLight);
    directionalLight.position.set(10, -10, 30);

    const mousePosition = new THREE.Vector2();
    const rayCaster = new THREE.Raycaster();

    // Named function to handle mouse movement
    const handleMouseMove = (event) => {
      if (contactRef.current) {
        const rect = contactRef.current.getBoundingClientRect(); // Get canvas position and size
        mousePosition.x = ((event.clientX - rect.left) / rect.width) * 2 - 1; // Normalize to [-1, 1]
        mousePosition.y = -((event.clientY - rect.top) / rect.height) * 2 + 1; // Normalize to [-1, 1]
      }
    };

    // Add mousemove event listener
    window.addEventListener('mousemove', handleMouseMove);

    // Create a planet
    const createPlanet = (color, x, y, url) => {
      const geometry = new THREE.SphereGeometry(1, 60, 60);
      const material = new THREE.MeshStandardMaterial({ color });
      const planet = new THREE.Mesh(geometry, material);
      planet.position.set(x, y, 0);

      // Add URL for interactivity
      planet.userData = { url };
      return planet;
    };

    const linkedInPlanet = createPlanet(0x0077b5, -3, 1, 'https://www.linkedin.com');
    const githubPlanet = createPlanet(0x333333, 0, 1, 'https://github.com');
    const leetCodePlanet = createPlanet(0xf89f1b, 3, 1, 'https://leetcode.com');
    const gmailPlanet = createPlanet(0xdb4437, 6, 1, 'mailto:your-email@gmail.com');

    scene.add(linkedInPlanet, githubPlanet, leetCodePlanet, gmailPlanet);

    // Handle click events for interactivity
    const onClick = () => {
      rayCaster.setFromCamera(mousePosition, camera);
      const intersects = rayCaster.intersectObjects(scene.children);
      
      if (intersects.length > 0) {
        const planet = intersects[0].object; // Get the first intersected planet
        console.log('Intersections:', intersects); // Debugging info
        console.log('Clicked Object:', planet); // Show the clicked object details
        
        // Check for userData and open URL if exists
        if (planet.userData.url) {
          window.open(planet.userData.url, '_blank');
        }
      } else {
        console.log('No intersections detected');
      }
    };
    
    window.addEventListener('click', onClick);

    // Animation loop
    function animate() {
      requestAnimationFrame(animate);

      // Rotate each planet for a dynamic effect
      linkedInPlanet.rotation.y += 0.00015;
      githubPlanet.rotation.y += 0.000015;
      leetCodePlanet.rotation.y += 0.000015;
      gmailPlanet.rotation.y += 0.000015;

      renderer.render(scene, camera);
    }

    animate();

    // Handle window resize
    const handleResize = () => {
      camera.aspect = contactRef.current.clientWidth / contactRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(contactRef.current.clientWidth, contactRef.current.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup function
    return () => {
      window.removeEventListener('mousemove', handleMouseMove); // Correctly reference the named function
      window.removeEventListener('click', onClick);
      window.removeEventListener('resize', handleResize);
      if (contactRef.current) {
        contactRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div className='nav-container'>
      <div className='name-container'>
        <h1>Miguel Lozano</h1>
        <p>FullStack Web Developer</p>
      </div>
      <div className="contact-links-container" ref={contactRef}></div>
      <a href="#about">About</a>
      <a href="#projects">Projects</a>
    </div>
  );
}

export default Nav;
