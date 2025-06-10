import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

interface TestimonialCardProps {
  content: string;
  author: string;
  company: string;
  rating: number;
  avatarUrl?: string;
}

const TestimonialCard = ({
  content,
  author,
  company,
  rating,
  avatarUrl,
}: TestimonialCardProps) => {
  return (
    <motion.div 
      className="glass-card p-6 h-full"
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <div className="flex gap-1 mb-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star 
            key={i}
            className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-neutral-600'}`}
          />
        ))}
      </div>
      
      <p className="mb-6 text-neutral-300 italic">"{content}"</p>
      
      <div className="flex items-center gap-3">
        {avatarUrl ? (
          <img 
            src={avatarUrl} 
            alt={author}
            className="w-12 h-12 rounded-full object-cover"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-primary-500/20 flex items-center justify-center text-primary-500 font-semibold">
            {author.charAt(0)}
          </div>
        )}
        
        <div>
          <div className="font-semibold">{author}</div>
          <div className="text-sm text-neutral-400">{company}</div>
        </div>
      </div>
    </motion.div>
  );
};

export default TestimonialCard;