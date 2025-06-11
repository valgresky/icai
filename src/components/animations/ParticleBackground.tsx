import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../providers/ThemeProvider';

interface Particle {
  x: number;
  y: number;
  size: number;
  color: string;
  vx: number;
  vy: number;
}

const ParticleBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles: Particle[] = useRef<Particle[]>([]).current;
  const animationFrameId = useRef<number>();
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        initParticles();
      }
    };

    const initParticles = () => {
      particles.length = 0;
      const particleCount = Math.min(50, Math.floor(window.innerWidth * window.innerHeight / 15000));
      
      // Different colors based on theme
      let colors;
      if (theme === 'glass') {
        colors = [
          'rgba(255, 255, 255, 0.4)',
          'rgba(255, 255, 255, 0.3)',
          'rgba(255, 255, 255, 0.2)',
        ];
      } else {
        colors = [
          'rgba(59, 130, 246, 0.6)', // primary
          'rgba(168, 85, 247, 0.6)',  // secondary
          'rgba(16, 185, 129, 0.6)',  // accent
        ];
      }
      
      for (let i = 0; i < particleCount; i++) {
        const size = Math.random() * 1.5 + 0.5;
        
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size,
          color: colors[Math.floor(Math.random() * colors.length)],
          vx: (Math.random() - 0.5) * 0.2,
          vy: (Math.random() - 0.5) * 0.2,
        });
      }
    };

    const animate = () => {
      if (!canvas || !ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(particle => {
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;
        
        // Bounce off edges
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;
        
        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();
      });
      
      animationFrameId.current = requestAnimationFrame(animate);
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [particles, theme]);

  return (
    <motion.canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: theme === 'glass' ? 0.4 : 0.8 }}
      transition={{ duration: 1 }}
    />
  );
};

export default ParticleBackground;