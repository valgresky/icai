import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { cn } from '../../utils/helpers';

interface CategoryCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  color: string;
  href: string;
}

const CategoryCard = ({ title, description, icon, color, href }: CategoryCardProps) => {
  return (
    <Link to={href}>
      <motion.div 
        className={cn(
          "glass-card h-full p-6 transition-all duration-300 group hover:translate-y-[-5px]",
          `hover:shadow-${color}`
        )}
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
      >
        <div className={cn(
          "w-12 h-12 rounded-lg flex items-center justify-center mb-4",
          `bg-${color}-500/20 text-${color}-500`
        )}>
          {icon}
        </div>
        <h3 className="text-xl font-semibold mb-2 group-hover:text-white">{title}</h3>
        <p className="text-neutral-400 text-sm">{description}</p>
      </motion.div>
    </Link>
  );
};

export default CategoryCard;