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
    const particleCount = window.innerWidth < 768 ? 100 : 200;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 7,
        vy: (Math.random() - 0.5) * 7,
        alpha: Math.random(),
        size: Math.random() * 3
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      
      // REMOVED RADIAL GRADIENT to completely eliminate the "oval" effect.
      // Using a very subtle linear gradient (almost black) instead.
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, '#050000'); // Very dark red/black at top
      gradient.addColorStop(1, '#000000'); // Pure black at bottom
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      ctx.strokeStyle = 'rgba(220, 38, 38, 0.4)';
      ctx.fillStyle = 'rgba(255, 0, 0, 0.6)';

      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        particles.forEach(p2 => {
            const dx = p.x - p2.x;
            const dy = p.y - p2.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 100) {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(220, 38, 38, ${0.15 * (1 - distance / 100)})`;
                ctx.lineWidth = 0.5;
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.stroke();
            }
        });

        if (Math.random() > 0.992) {
          ctx.beginPath();
          ctx.lineWidth = Math.random() * 2;
          ctx.strokeStyle = `rgba(255, 0, 0, ${Math.random() * 0.3})`;
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x + (Math.random() - 0.5) * 150, p.y + (Math.random() - 0.5) * 150);
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