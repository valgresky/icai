import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import WorkflowCard from './WorkflowCard';

interface Workflow {
  id: string;
  title: string;
  description: string;
  image: string;
  price: number | null;
  rating: number;
  downloads: number;
  category: string;
}

interface FeaturedWorkflowCarouselProps {
  workflows: Workflow[];
}

const FeaturedWorkflowCarousel = ({ workflows }: FeaturedWorkflowCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [width, setWidth] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Number of cards to show based on screen width
  const getItemsToShow = () => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth < 640) return 1;
      if (window.innerWidth < 1024) return 2;
      return 3;
    }
    return 3;
  };

  const [itemsToShow, setItemsToShow] = useState(getItemsToShow());

  useEffect(() => {
    const handleResize = () => {
      setItemsToShow(getItemsToShow());
      updateCarouselWidth();
    };

    const updateCarouselWidth = () => {
      if (carouselRef.current) {
        const containerWidth = carouselRef.current.offsetWidth;
        setWidth(containerWidth);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const maxIndex = Math.max(0, workflows.length - itemsToShow);

  const next = () => {
    setCurrentIndex(prev => Math.min(prev + 1, maxIndex));
  };

  const prev = () => {
    setCurrentIndex(prev => Math.max(prev - 1, 0));
  };

  const itemWidth = width / itemsToShow;

  return (
    <div className="relative">
      <div className="flex justify-between mb-4">
        <h2 className="text-2xl font-bold">Featured Workflows</h2>
        
        <div className="flex space-x-2">
          <button
            onClick={prev}
            disabled={currentIndex === 0}
            className="btn-glass p-2 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={next}
            disabled={currentIndex >= maxIndex}
            className="btn-glass p-2 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="overflow-hidden" ref={carouselRef}>
        <motion.div
          className="flex"
          animate={{ x: -currentIndex * itemWidth }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          style={{ width: workflows.length * itemWidth }}
        >
          {workflows.map((workflow) => (
            <div
              key={workflow.id}
              style={{ width: itemWidth, padding: '0 0.5rem' }}
            >
              <WorkflowCard {...workflow} />
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default FeaturedWorkflowCarousel;