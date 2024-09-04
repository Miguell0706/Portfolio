import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

function Nav() {
  const contactRef = useRef(null);
  const rendererRef = useRef(null); // Renderer reference
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  useEffect(() => {
    if (!contactRef.current) return;

    // Scene and Camera Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      contactRef.current.clientWidth / contactRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 12.5);

    // Renderer Setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(
      contactRef.current.clientWidth,
      contactRef.current.clientHeight
    );
    contactRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer; // Store renderer reference

    // Light Setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
    scene.add(ambientLight);

    function loadModel(url, xPosition) {
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
          modelGroup.position.set(xPosition, 0, 0); // Set position based on parameter
          scene.add(modelGroup); // Add to the scene
        },
        undefined,
        (error) => {
          console.error('An error happened while loading the GLB model:', error);
        }
      );
    
      return modelGroup; // Return the group if needed
    }
    const linkedin = loadModel("/models/linkedin.glb", -6);
    const github = loadModel("/models/github.glb", 0);
    const email = loadModel("/models/email.glb", 6);
    email.scale.set(0.028,0.028,0.028)
    linkedin.scale.set(2,2,2)
    github.scale.set(2,2,2)


    // Mouse Move Event Listener
    function onMouseMove(event) {
      if (!contactRef.current) return; // Ensure the reference is available
    
      const rect = contactRef.current.getBoundingClientRect(); // Get container dimensions
    
      // Calculate mouse position relative to the container
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    }

    // Mouse Click Event Listener
    function onMouseClick() {
      // Update the picking ray with the camera and mouse position
      raycaster.setFromCamera(mouse, camera);

      // Calculate objects intersecting the picking ray
      const intersectsLinkedIn = raycaster.intersectObject(linkedin, true); // `true` to check all descendants
      const intersectsGitHub = raycaster.intersectObject(github, true); // Check GitHub model
      const intersectsEmail = raycaster.intersectObject(email, true); // Check Email model

      // Open LinkedIn link if clicked
      if (intersectsLinkedIn.length > 0) {
        window.open("https://www.linkedin.com/in/miguel-lozano-aaa430287/", "_blank");
      }
      
      // Open GitHub link if clicked
      if (intersectsGitHub.length > 0) {
        window.open("https://github.com/Miguell0706", "_blank");
      }

      // Open email client if email model is clicked
      if (intersectsEmail.length > 0) {
        window.location.href = "mailto:miguellozano3757@gmail.com";
      }
    }

    // Add Event Listeners
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("click", onMouseClick);

    // Animation Loop
    function animate() {
      requestAnimationFrame(animate);
      if (linkedin) {
        linkedin.rotation.y += 0.015;
        github.rotation.y += 0.015;
        email.rotation.y += 0.015;
      }
   
      renderer.render(scene, camera);
    }
    animate();

    // Handle Resize
    const handleResize = () => {
      camera.aspect =
        contactRef.current.clientWidth / contactRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(
        contactRef.current.clientWidth,
        contactRef.current.clientHeight
      );
    };
    window.addEventListener("resize", handleResize);

    // Cleanup on Unmount
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("click", onMouseClick);

      // Dispose GLTF Model
      if (linkedin) {
        linkedin.traverse((object) => {
          if (object.isMesh) {
            object.geometry.dispose();
            if (object.material.isMaterial) {
              object.material.dispose();
            } else {
              object.material.forEach((material) => material.dispose());
            }
          }
        });
        scene.remove(linkedin);
      }

      // Dispose Renderer
      if (rendererRef.current) {
        rendererRef.current.dispose();
        if (contactRef.current) {
          contactRef.current.removeChild(rendererRef.current.domElement);
        }
      }
    };
  }, []);

  return (
    <div className="nav-container">
      <div className="name-container">
        <h1>Miguel Lozano</h1>
        <p>FullStack Web Developer</p>
        <p>
          <a className='email-link' href="mailto:miguellozano3757@gmail.com">miguellozano3757@gmail.com</a>
        </p>
      </div>
      <div className="contact-links-container" ref={contactRef}></div>
      <a className='nav-link' href="#about">About</a>
      <a className='nav-link' href="#projects">Projects</a>
    </div>
  );
}

export default Nav;
