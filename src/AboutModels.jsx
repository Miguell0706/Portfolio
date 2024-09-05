import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";


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
    camera.position.set(0, -1, 4);

  

    const directionalLight = new THREE.DirectionalLight(0xffffff);
    directionalLight.position.set(1,0, 2);
    scene.add(directionalLight);

    // Function to create a planet
     // Create a textured globe
     const textureLoader = new THREE.TextureLoader();
     const globeTexture = textureLoader.load("/images/django.png", (texture) => {
  
      texture.repeat.set(3,3); // Adjust the repeat values to control how many times the texture appears
    
      // Optionally, you can adjust the offset to change the starting point of the texture
      texture.offset.set(-.1, -.75); // Adjust these values to shift the texture horizontally or vertically
    });
     const globeGeometry = new THREE.SphereGeometry(1, 32, 32); // Adjust size and detail as needed
     const globeMaterial = new THREE.MeshStandardMaterial({ map: globeTexture });
     const djangoOrb = new THREE.Mesh(globeGeometry, globeMaterial);
     djangoOrb.position.set(0, .7, 0); // Set the position of the globe
     scene.add(djangoOrb);
    function createOrb(url) {
      const loader = new GLTFLoader(); // Initialize loader inside the function
      const modelGroup = new THREE.Object3D(); // Create a new group for each model
    
      loader.load(
        url,
        function (gltf) {
          const box = new THREE.Box3().setFromObject(gltf.scene);
          const c = box.getCenter(new THREE.Vector3());
          const size = box.getSize(new THREE.Vector3());
    
          // Center the model
          gltf.scene.position.set(-c.x, size.y / 2 - c.y, -c.z);
    
          modelGroup.add(gltf.scene); // Add the loaded model to the group
          scene.add(modelGroup); // Add to the scene
        },
        undefined,
        (error) => {
          console.error('An error happened while loading the GLB model:', error);
        }
      );
    
      return modelGroup; // Return the group if needed
    }
    // Create orbs
    const cssOrb = createOrb("/models/css.glb", -8,);
    cssOrb.scale.set(0.0095, 0.0095, 0.0095);
    cssOrb.position.set(-5,-.4);
    const pythonOrb = createOrb("/models/python.glb", -4);
    pythonOrb.scale.set(0.03,.03, .03);
    pythonOrb.position.set(-2.5, -3.5);
    const javascriptOrb = createOrb("/models/js.glb", 0);
    javascriptOrb.scale.set(1.3, 1.3, 1.3);
    javascriptOrb.position.set(2.5, -3.5);
    const reactOrb = createOrb("/models/react.glb", 8);
    reactOrb.scale.set(.4, .4, .4);
    reactOrb.position.set(5, 0, 0);

    // Animation loop
    function animate() {
      requestAnimationFrame(animate);

      // Rotate each orb
      
      cssOrb.rotation.y += 0.001;
      pythonOrb.rotation.y += 0.001;
      javascriptOrb.rotation.y += 0.001;
      reactOrb.rotation.y += 0.001;
      djangoOrb.rotation.y += 0.001;

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
