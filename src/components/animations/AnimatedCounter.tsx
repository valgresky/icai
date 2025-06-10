import { useState, useEffect, useRef } from 'react';
import { useInView } from 'framer-motion';
import { formatNumber } from '../../utils/helpers';

interface AnimatedCounterProps {
  end: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
}

const AnimatedCounter = ({ 
  end, 
  duration = 2000, 
  prefix = '', 
  suffix = '' 
}: AnimatedCounterProps) => {
  const [count, setCount] = useState(0);
  const countRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(countRef, { once: true, amount: 0.5 });
  const startTimeRef = useRef<number | null>(null);
  const frameIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isInView) return;

    const animate = (timestamp: number) => {
      if (startTimeRef.current === null) {
        startTimeRef.current = timestamp;
      }

      const progress = timestamp - startTimeRef.current;
      const percentage = Math.min(progress / duration, 1);
      
      // Use easeOutExpo for a nice, natural slowdown
      const easeOutExpo = 1 - Math.pow(2, -10 * percentage);
      
      setCount(Math.floor(easeOutExpo * end));

      if (percentage < 1) {
        frameIdRef.current = requestAnimationFrame(animate);
      }
    };

    frameIdRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameIdRef.current !== null) {
        cancelAnimationFrame(frameIdRef.current);
      }
    };
  }, [isInView, end, duration]);

  return (
    <div ref={countRef} className="font-display font-bold text-4xl md:text-5xl">
      {prefix}{formatNumber(count)}{suffix}
    </div>
  );
};

export default AnimatedCounter;