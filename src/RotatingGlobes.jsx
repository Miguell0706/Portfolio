import React, { useEffect, useRef } from "react";
import * as THREE from "three";

function RotatingGlobes() {
  const mountRef = useRef(null); // Reference to mount the Three.js scene

  useEffect(() => {
    // Scene, Camera, Renderer setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      800 / 800, // Aspect ratio based on container width/height
      0.1,
      1000
    );
    camera.position.z = 2; // Adjust camera position to fit all globes

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(800, 800); // Set renderer size to match container
    mountRef.current.appendChild(renderer.domElement);

    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5).normalize();
    scene.add(directionalLight);

    // Create materials for different technologies
    const createMaterial = (color) => new THREE.MeshStandardMaterial({ color });

    const materials = {
      css: createMaterial("#2965f1"),
      javascript: createMaterial("#f0db4f"),
      python: createMaterial("#3572A5"),
      django: createMaterial("#092E20"),
      react: createMaterial("#61DBFB"),
    };

    // Create globes (spheres) for each technology
    const globes = {};
    const radius = 0.1; // Radius of the sphere
    const geometry = new THREE.SphereGeometry(radius, 32, 32);

    Object.keys(materials).forEach((tech, index) => {
      const globe = new THREE.Mesh(geometry, materials[tech]);
      globe.position.x = (index % 3) * 0.6 - 0.6; // Spread globes in a grid layout (x-axis)
      globe.position.y = Math.floor(index / 3) * -0.6 + 0.6; // Spread globes in a grid layout (y-axis)
      scene.add(globe);
      globes[tech] = globe;
    });

    // Handle click event to rotate spheres
    function onDocumentMouseDown(event) {
      event.preventDefault();

      // Calculate mouse position in normalized device coordinates (-1 to +1)
      const mouse = new THREE.Vector2(
        (event.clientX / renderer.domElement.clientWidth) * 2 - 1,
        -(event.clientY / renderer.domElement.clientHeight) * 2 + 1
      );

      // Raycaster to detect intersects
      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, camera);

      const intersects = raycaster.intersectObjects(Object.values(globes));

      if (intersects.length > 0) {
        const selectedGlobe = intersects[0].object;
        // Rotate the selected globe
        selectedGlobe.rotation.y += Math.PI / 2; // Rotate 90 degrees
      }
    }

    document.addEventListener("mousedown", onDocumentMouseDown);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };

    animate();

    // Handle resizing
    const handleResize = () => {
      const width = 400; // Set width to match the container
      const height = 400; // Set height to match the container
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };

    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      document.removeEventListener("mousedown", onDocumentMouseDown);
      window.removeEventListener("resize", handleResize);
      mountRef.current.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className="technologies-orbs" style={{ width: "400px", height: "400px" }} />;
}

export default RotatingGlobes;