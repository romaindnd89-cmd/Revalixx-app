import React, { useEffect, useRef } from 'react';

const ChaosBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const particles: {x: number, y: number, vx: number, vy: number, alpha: number}[] = [];
    const particleCount = 60;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        alpha: Math.random()
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      
      // Draw background fog/gradient
      const gradient = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, width);
      gradient.addColorStop(0, 'rgba(30, 0, 0, 0.4)');
      gradient.addColorStop(0.5, 'rgba(10, 0, 0, 0.8)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 1)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Draw chaotic particles
      ctx.strokeStyle = 'rgba(220, 38, 38, 0.5)'; // Red-600
      ctx.lineWidth = 1;

      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;

        // Bounce
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x + p.vx * 10, p.y + p.vy * 10); // Streak effect
        ctx.stroke();

        // Random glitch line
        if (Math.random() > 0.98) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(255, 0, 0, ${Math.random() * 0.5})`;
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(Math.random() * width, Math.random() * height);
          ctx.stroke();
        }
      });

      requestAnimationFrame(animate);
    };

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener('resize', handleResize);
    animate();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none chaos-bg"
    />
  );
};

export default ChaosBackground;
