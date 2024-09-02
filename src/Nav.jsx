import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

function Nav() {
  const contactRef = useRef(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      contactRef.current.clientWidth / contactRef.current.clientHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(contactRef.current.clientWidth, contactRef.current.clientHeight);
    renderer.setClearColor(0x000000, 0); // Set background color
    contactRef.current.appendChild(renderer.domElement);

    camera.position.set(0, 0, 5);
    camera.lookAt(0, 0, 0);

    const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(10, 10, 10);
    scene.add(directionalLight);

    const loader = new GLTFLoader();
    loader.load('/models/linkedin.glb', (gltf) => {
      const linkedin = gltf.scene;
      console.log('LinkedIn model loaded:', linkedin); // Debugging info
      scene.add(linkedin);
      linkedin.position.set(-2, -.5, -1);
      linkedin.scale.set(.5,.5, .5); // Adjust scale
      
    }, undefined, (error) => {
      console.error('An error happened while loading the GLB model:', error);
    });

    function animate() {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    }

    animate();

    const handleResize = () => {
      camera.aspect = contactRef.current.clientWidth / contactRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(contactRef.current.clientWidth, contactRef.current.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
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
