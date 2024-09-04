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

    // Load GLTF Model
    const loader = new GLTFLoader();
    const clock = new THREE.Clock(); // for the rotation of the model - see animate
    const linkedin = new THREE.Object3D();

    loader.load(
      "/models/linkedin.glb",
      function (gltf) {
        const box = new THREE.Box3().setFromObject(gltf.scene);
        const c = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        gltf.scene.position.set(-c.x, size.y / 2 - c.y, -c.z); // Center model

        linkedin.add(gltf.scene);
        linkedin.scale.set(2, 2, 2);
        linkedin.position.set(-8, 0, 0);
        scene.add(linkedin);
      },
      undefined,
      (error) => {
        console.error("An error happened while loading the GLB model:", error);
      }
    );

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
      const intersects = raycaster.intersectObject(linkedin, true); // `true` to check all descendants
      if (intersects.length > 0) {
        window.open("https://www.linkedin.com/in/miguel-lozano-aaa430287/", "_blank");
      }
     
    }

    // Add Event Listeners
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("click", onMouseClick);

    // Animation Loop
    function animate() {
      requestAnimationFrame(animate);
      if (linkedin) {
        linkedin.rotation.y += 0.01;
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
      </div>
      <div className="contact-links-container" ref={contactRef}></div>
      <a href="#about">About</a>
      <a href="#projects">Projects</a>
    </div>
  );
}

export default Nav;
