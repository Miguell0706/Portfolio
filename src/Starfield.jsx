import React, { useEffect, useRef } from "react";

const Starfield = () => {
  const canvasRef = useRef(null);
  const mousePosition = useRef({ x: null, y: null }); // Use ref to avoid re-renders

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const stars = [];
    let starCount = window.innerWidth > 768 ? 200 : 100;
    const maxStarSize = 4;

    const initializeStars = () => {
      stars.length = 0; // Clear existing stars
      for (let i = 0; i < starCount; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * maxStarSize,
          brightness: 0.15,
          vx: (Math.random() - 0.5) * 0.3, // Horizontal velocity
          vy: (Math.random() - 0.5) * 0.3, // Vertical velocity
        });
      }
    };

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      starCount = window.innerWidth > 768 ? 200 : 100;
      initializeStars(); // Reinitialize stars on resize
    };

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas(); // Set initial size

    // Function to draw stars
    const drawStars = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach((star) => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.brightness})`;
        ctx.fill();
      });
    };
    
    // Function to update star positions and brightness based on cursor
    const updateStars = () => {
      stars.forEach((star) => {
        // Update star position based on velocity
        star.x += star.vx;
        star.y += star.vy;

        // Handle edge wrapping
        if (star.x < 0) star.x = canvas.width;
        if (star.x > canvas.width) star.x = 0;
        if (star.y < 0) star.y = canvas.height;
        if (star.y > canvas.height) star.y = 0;

        // Update brightness based on cursor proximity
        if (mousePosition.current.x !== null && mousePosition.current.y !== null) {
          const distance = Math.sqrt(
            (mousePosition.current.x - star.x) ** 2 + (mousePosition.current.y - star.y) ** 2
          );
          const maxDistance = 300; // Distance within which stars react to the cursor
          if (distance < maxDistance) {
            star.brightness = 1 - distance / maxDistance;
          } else {
            star.brightness = 0.15;
          }
        }
      });
    };

    // Animation loop
    const animate = () => {
      updateStars(); // Update positions and brightness
      drawStars(); // Draw updated stars
      requestAnimationFrame(animate); // Schedule next frame
    };

    // Handle mouse movement
    const handleMouseMove = (e) => {
      mousePosition.current = { x: e.clientX, y: e.clientY };
    };

    // Event listeners
    canvas.addEventListener("mousemove", handleMouseMove);
    animate();

    // Cleanup on component unmount
    return () => {
      canvas.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: "absolute", top: 0, left: 0, zIndex: -1 }}
    />
  );
};

export default Starfield;
