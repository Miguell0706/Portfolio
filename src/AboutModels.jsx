import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

function RotatingGlobes() {
  const contactRef = useRef(null);

  useEffect(() => {
    if (!contactRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      contactRef.current.clientWidth / contactRef.current.clientHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(
      contactRef.current.clientWidth,
      contactRef.current.clientHeight
    );
    contactRef.current.appendChild(renderer.domElement);
    camera.position.set(0, -0.5, 4.6);

    const directionalLight = new THREE.DirectionalLight(0xffffff);
    directionalLight.position.set(1, 0, 2);
    scene.add(directionalLight);
    const directionalLight2 = new THREE.DirectionalLight(0xffffff);
    directionalLight2.position.set(-1, 0, 2);
    scene.add(directionalLight2);

    const textureLoader = new THREE.TextureLoader();
    const globeTexture = textureLoader.load("/images/django.png", (texture) => {
      texture.repeat.set(3, 3); // Adjust the repeat values to control how many times the texture appears

      // Optionally, you can adjust the offset to change the starting point of the texture
      texture.offset.set(-0.1, -0.75); // Adjust these values to shift the texture horizontally or vertically
    });
    const globeGeometry = new THREE.SphereGeometry(1, 32, 32);
    const globeMaterial = new THREE.MeshStandardMaterial({ map: globeTexture });
    const djangoOrb = new THREE.Mesh(globeGeometry, globeMaterial);
    djangoOrb.rotation.y = Math.PI / 9;
    djangoOrb.rotation.x -= 0.1;
    addClickRotation(djangoOrb);

    scene.add(djangoOrb);

    function createOrb(url) {
      const loader = new GLTFLoader();
      const modelGroup = new THREE.Group(); // Use Group for top-level rotation

      loader.load(
        url,
        function (gltf) {
          const box = new THREE.Box3().setFromObject(gltf.scene);
          const c = box.getCenter(new THREE.Vector3());
          const size = box.getSize(new THREE.Vector3());

          gltf.scene.position.set(-c.x, size.y / 2 - c.y, -c.z);

          modelGroup.add(gltf.scene);
          scene.add(modelGroup);

          addClickRotation(modelGroup); // Call rotation function on group, not individual mesh
        },
        undefined,
        (error) => {
          console.error("An error happened while loading the GLB model:", error);
        }
      );

      return modelGroup;
    }

    function addClickRotation(object) {
      let isRotating = false;

      object.userData.onClick = () => {
        if (isRotating) return; // Prevent multiple animations
        isRotating = true;
        const targetRotation = object.rotation.y + Math.PI * 2;

        const rotate = () => {
          if (object.rotation.y < targetRotation) {
            object.rotation.y += 0.03; // Adjust speed as needed
            requestAnimationFrame(rotate);
          } else {
            object.rotation.y = targetRotation % (Math.PI * 2); // Normalize rotation
            isRotating = false;
          }
        };

        rotate();
      };
    }

    const cssOrb = createOrb("/models/css.glb");
    cssOrb.scale.set(0.0095, 0.0095, 0.0095);
    cssOrb.position.set(-5, 0);
    cssOrb.rotation.y = -Math.PI / 3;

    const pythonOrb = createOrb("/models/python.glb");
    pythonOrb.scale.set(0.03, 0.03, 0.03);
    pythonOrb.position.set(-2.5, -3.5);

    const javascriptOrb = createOrb("/models/js.glb");
    javascriptOrb.scale.set(1.3, 1.3, 1.3);
    javascriptOrb.position.set(2.5, -3.5);

    const reactOrb = createOrb("/models/react.glb");
    reactOrb.scale.set(0.4, 0.4, 0.4);
    reactOrb.position.set(5, 0);

    function animate() {
      requestAnimationFrame(animate);
      const driftSpeed = 0.0005;
      const driftHeight = 0.3;

      const time = Date.now() * driftSpeed;
      cssOrb.position.y = Math.sin(time) * driftHeight - 0.4;
      pythonOrb.position.y = Math.sin(time + Math.PI / 4) * driftHeight - 3.5;
      javascriptOrb.position.y = Math.sin(time + Math.PI / 2) * driftHeight - 3.5;
      reactOrb.position.y = Math.sin(time + Math.PI) * driftHeight - 0.3;
      djangoOrb.position.y = Math.sin(time + (3 * Math.PI) / 4) * driftHeight + 0.3;

      renderer.render(scene, camera);
    }

    animate();

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

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    function onClick(event) {
      const rect = contactRef.current.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(scene.children, true);

      if (intersects.length > 0) {
        let clickedObject = intersects[0].object;

        // Traverse up to find the parent group with userData
        while (clickedObject.parent && !clickedObject.userData.onClick) {
          clickedObject = clickedObject.parent;
        }

        if (clickedObject.userData.onClick) {
          clickedObject.userData.onClick();
        }
      }
    }

    window.addEventListener("click", onClick);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("click", onClick);
      if (contactRef.current) {
        contactRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
      scene.clear();
    };
  }, []);

  return <div ref={contactRef} className="technologies-orbs" />;
}

export default RotatingGlobes;
