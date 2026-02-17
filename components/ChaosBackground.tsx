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

    const particles: {x: number, y: number, vx: number, vy: number, alpha: number, size: number}[] = [];
    // Adjusted particle count for performance and visual chaos
    const particleCount = window.innerWidth < 768 ? 80 : 150;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 5,
        vy: (Math.random() - 0.5) * 5,
        alpha: Math.random(),
        size: Math.random() * 2.5
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      
      // Draw background fog/gradient - Intense Red/Darkness
      const gradient = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, width);
      gradient.addColorStop(0, 'rgba(50, 0, 0, 0.4)'); // Deep red center
      gradient.addColorStop(0.6, 'rgba(20, 0, 0, 0.7)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 1)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Draw chaotic particles
      ctx.strokeStyle = 'rgba(220, 38, 38, 0.6)'; // Red-600
      ctx.fillStyle = 'rgba(255, 0, 0, 0.8)'; // Bright Red

      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;

        // Bounce
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        // Connect particles if close
        particles.forEach(p2 => {
            const dx = p.x - p2.x;
            const dy = p.y - p2.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 110) {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(220, 38, 38, ${0.25 * (1 - distance / 110)})`;
                ctx.lineWidth = 0.6;
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.stroke();
            }
        });

        // Random glitch line (Lightning effect) - Occasional flicker
        if (Math.random() > 0.99) {
          ctx.beginPath();
          ctx.lineWidth = Math.random() * 2;
          ctx.strokeStyle = `rgba(255, 0, 0, ${Math.random() * 0.5})`;
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x + (Math.random() - 0.5) * 200, p.y + (Math.random() - 0.5) * 200);
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
    const animationId = requestAnimationFrame(animate);

    return () => {
        window.removeEventListener('resize', handleResize);
        cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none chaos-bg"
    />
  );
};

export default ChaosBackground;