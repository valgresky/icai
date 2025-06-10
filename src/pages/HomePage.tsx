import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { Megaphone, LineChart, Database, Share2, ShoppingCart, Server, ChevronRight, Wrench } from 'lucide-react';
import AnimatedCounter from '../components/animations/AnimatedCounter';
import CategoryCard from '../components/ui/CategoryCard';
import FeaturedWorkflowCarousel from '../components/ui/FeaturedWorkflowCarousel';
import TestimonialCard from '../components/ui/TestimonialCard';
import SearchBar from '../components/ui/SearchBar';
import InstallationBookingForm from '../components/ui/InstallationBookingForm';
import { workflows, categories, testimonials } from '../data/mockData';

const categoryIcons = {
  "Megaphone": <Megaphone className="w-6 h-6" />,
  "LineChart": <LineChart className="w-6 h-6" />,
  "Database": <Database className="w-6 h-6" />,
  "Share2": <Share2 className="w-6 h-6" />,
  "ShoppingCart": <ShoppingCart className="w-6 h-6" />,
  "Server": <Server className="w-6 h-6" />
};

const HomePage = () => {
  const [isInstallationModalOpen, setIsInstallationModalOpen] = useState(false);
  const featuredWorkflows = workflows.filter(workflow => workflow.featured);
  const h1Ref = useRef<HTMLHeadingElement>(null);

  // GSAP animation for the main heading
  useEffect(() => {
    if (h1Ref.current) {
      // Set initial state
      gsap.set(h1Ref.current, {
        opacity: 0,
        y: 50,
        scale: 0.9
      });

      // Animate in
      gsap.to(h1Ref.current, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1.2,
        ease: "power3.out",
        delay: 0.3
      });

      // Add a subtle floating animation
      gsap.to(h1Ref.current, {
        y: -10,
        duration: 3,
        ease: "power2.inOut",
        yoyo: true,
        repeat: -1,
        delay: 1.5
      });
    }
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="min-h-screen relative overflow-hidden">
        <div className="container mx-auto px-4 pt-32 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h1 
                ref={h1Ref}
                className="mb-6 text-gradient"
              >
                The Ultimate N8N Workflow Marketplace
              </h1>
              
              <motion.p 
                className="text-xl mb-8 text-neutral-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                Discover, deploy, and monetize powerful automations.
                Take your workflow game to the next level with our curated marketplace.
              </motion.p>

              <motion.div 
                className="flex flex-col sm:flex-row gap-4 mb-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.7 }}
              >
                <Link to="/marketplace" className="btn-primary px-8 py-3 text-center">
                  Explore Marketplace
                </Link>
                <button 
                  onClick={() => setIsInstallationModalOpen(true)}
                  className="btn-glass px-8 py-3 text-center"
                >
                  Book Installation
                </button>
              </motion.div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                <motion.div 
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.9 }}
                >
                  <AnimatedCounter end={350} suffix="+" />
                  <p className="text-neutral-400">Workflows</p>
                </motion.div>
                <motion.div 
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.1 }}
                >
                  <AnimatedCounter end={12000} suffix="+" />
                  <p className="text-neutral-400">Users</p>
                </motion.div>
                <motion.div 
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.3 }}
                >
                  <AnimatedCounter end={1500000} suffix="+" />
                  <p className="text-neutral-400">Hours Saved</p>
                </motion.div>
              </div>
            </div>

            <motion.div 
              className="lg:h-[600px] h-[400px] relative"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <img 
                src="https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg"
                alt="Workflow Automation"
                className="w-full h-full object-cover rounded-lg"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-16 bg-background-secondary/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <h2 className="mb-4">Find Your Perfect Workflow</h2>
            <p className="text-neutral-400 max-w-2xl mx-auto mb-8">
              Search through our extensive library of n8n workflows to find exactly what you need.
            </p>
            <SearchBar className="max-w-2xl mx-auto" />
          </motion.div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="mb-4">Browse by Category</h2>
            <p className="text-neutral-400 max-w-2xl mx-auto">
              Explore workflows organized by use case and industry.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.slice(0, 6).map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <CategoryCard
                  title={category.name}
                  description={category.description}
                  icon={categoryIcons[category.icon as keyof typeof categoryIcons] || <Database className="w-6 h-6" />}
                  color="primary"
                  href={`/marketplace?category=${category.id}`}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Workflows */}
      <section className="py-16 bg-background-secondary/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <FeaturedWorkflowCarousel workflows={featuredWorkflows} />
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="mb-4">What Our Users Say</h2>
            <p className="text-neutral-400 max-w-2xl mx-auto">
              Join thousands of satisfied users who have transformed their workflows.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <TestimonialCard {...testimonial} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary-600/20 via-secondary-600/20 to-accent-600/20">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="mb-4">Ready to Get Started?</h2>
            <p className="text-xl text-neutral-300 mb-8 max-w-2xl mx-auto">
              Join our community and start automating your workflows today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/marketplace" className="btn-primary px-8 py-3">
                Browse Marketplace
              </Link>
              <Link to="/creator" className="btn-ghost px-8 py-3">
                Become a Creator
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
      
      <InstallationBookingForm
        isOpen={isInstallationModalOpen}
        onClose={() => setIsInstallationModalOpen(false)}
      />
    </div>
  );
};

export default HomePage;