import React, { useEffect, useRef } from "react";
import * as THREE from "three";

function RotatingGlobes() {
  const contactRef = useRef(null);

  useEffect(() => {
    if (!contactRef.current) return; // Ensure ref is available

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
    camera.position.set(0, 1, 3.1);

  
    // Set up lighting
    const ambientLight = new THREE.AmbientLight(0x333333);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    scene.add(directionalLight);
    directionalLight.position.set(0,0,4);

    // Function to create a planet
    const createOrb = (color, x, y) => {
      const geometry = new THREE.SphereGeometry(1, 60, 60);
      const material = new THREE.MeshStandardMaterial({ color });
      const planet = new THREE.Mesh(geometry, material);
      planet.position.set(x, y, 0);
      scene.add(planet); // Add the orb directly to the scene here
      return planet;
    };

    // Create orbs
    const cssOrb = createOrb(0x0077b5, -8, 1);
    const pythonOrb = createOrb(0x333333, -4, 1);
    const javascriptOrb = createOrb(0xf89f1b, 0, 1);
    const djangoOrb = createOrb(0xdb4437, 4, 1);
    const reactOrb = createOrb(0x00d1b2, 8, 1);

    // Animation loop
    function animate() {
      requestAnimationFrame(animate);

      // Rotate each orb
      cssOrb.rotation.y += 0.01;
      pythonOrb.rotation.y += 0.01;
      javascriptOrb.rotation.y += 0.01;
      djangoOrb.rotation.y += 0.01;
      reactOrb.rotation.y += 0.01;

      renderer.render(scene, camera);
    }

    animate();

    // Handle window resize
    const handleResize = () => {
      camera.aspect = contactRef.current.clientWidth / contactRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(contactRef.current.clientWidth, contactRef.current.clientHeight);
    };
    window.addEventListener("resize", handleResize);

    // Cleanup function
    return () => {
      window.removeEventListener("resize", handleResize);
      if (contactRef.current) {
        contactRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
      scene.clear(); // Clear the scene to remove all objects
    };
  }, []);

  return <div ref={contactRef} className="technologies-orbs" />;
}

export default RotatingGlobes;
