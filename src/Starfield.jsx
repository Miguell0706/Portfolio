import React, { useEffect, useRef } from "react";

const Starfield = () => {
  const canvasRef = useRef(null);
  const mousePosition = useRef({ x: null, y: null });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const stars = [];
    let starCount = window.innerWidth > 768 ? 200 : 100;
    const maxStarSize = 4;

    const initializeStars = () => {
      stars.length = 0;
      for (let i = 0; i < starCount; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * maxStarSize,
          brightness: 0.15,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
        });
      }
    };

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      starCount = window.innerWidth > 768 ? 150 :75 ;
      initializeStars();
    };

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    const drawStars = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach((star) => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.brightness})`;
        ctx.fill();
      });
    };

    const updateStars = () => {
      stars.forEach((star) => {
        star.x += star.vx;
        star.y += star.vy;

        if (star.x < 0) star.x = canvas.width;
        if (star.x > canvas.width) star.x = 0;
        if (star.y < 0) star.y = canvas.height;
        if (star.y > canvas.height) star.y = 0;

        const distance = Math.sqrt(
          (mousePosition.current.x - star.x) ** 2 + (mousePosition.current.y - star.y) ** 2
        );
        const maxDistance = 300;
        if (distance < maxDistance) {
          star.brightness = 1 - distance / maxDistance;
        } else {
          star.brightness = 0.15;
        }
      });
    };

    const animate = () => {
      updateStars();
      drawStars();
      requestAnimationFrame(animate);
    };

    canvas.addEventListener("mousemove", (e) => {
      mousePosition.current = { x: e.clientX, y: e.clientY };
    });

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="starfield-container"
    />
  );
};

export default Starfield;
