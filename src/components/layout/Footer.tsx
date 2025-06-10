import { Link } from 'react-router-dom';
import { Workflow, Twitter, Github, Linkedin, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-background-secondary border-t border-neutral-800/50 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <Link to="/" className="flex items-center gap-2 mb-6">
              <Workflow className="h-8 w-8 text-primary-500" />
              <span className="font-display font-bold text-xl">Inner Circle AI</span>
            </Link>
            <p className="text-neutral-400 mb-6">
              The ultimate destination for n8n workflows. Discover, share, and monetize your automation expertise.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-neutral-400 hover:text-primary-400 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-neutral-400 hover:text-primary-400 transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="text-neutral-400 hover:text-primary-400 transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="text-neutral-400 hover:text-primary-400 transition-colors">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-6">Marketplace</h4>
            <ul className="space-y-3">
              <li><Link to="/marketplace" className="text-neutral-400 hover:text-primary-400 transition-colors">All Workflows</Link></li>
              <li><Link to="/marketplace?category=marketing" className="text-neutral-400 hover:text-primary-400 transition-colors">Marketing</Link></li>
              <li><Link to="/marketplace?category=sales" className="text-neutral-400 hover:text-primary-400 transition-colors">Sales</Link></li>
              <li><Link to="/marketplace?category=data" className="text-neutral-400 hover:text-primary-400 transition-colors">Data Processing</Link></li>
              <li><Link to="/marketplace?category=social" className="text-neutral-400 hover:text-primary-400 transition-colors">Social Media</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-6">Resources</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-neutral-400 hover:text-primary-400 transition-colors">Documentation</a></li>
              <li><a href="#" className="text-neutral-400 hover:text-primary-400 transition-colors">API Reference</a></li>
              <li><a href="#" className="text-neutral-400 hover:text-primary-400 transition-colors">Community</a></li>
              <li><a href="#" className="text-neutral-400 hover:text-primary-400 transition-colors">Blog</a></li>
              <li><a href="#" className="text-neutral-400 hover:text-primary-400 transition-colors">Changelog</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-6">Company</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-neutral-400 hover:text-primary-400 transition-colors">About Us</a></li>
              <li><a href="#" className="text-neutral-400 hover:text-primary-400 transition-colors">Careers</a></li>
              <li><a href="#" className="text-neutral-400 hover:text-primary-400 transition-colors">Contact</a></li>
              <li><a href="#" className="text-neutral-400 hover:text-primary-400 transition-colors">Terms of Service</a></li>
              <li><a href="#" className="text-neutral-400 hover:text-primary-400 transition-colors">Privacy Policy</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-neutral-800 pt-8 mt-8 text-center">
          <p className="text-neutral-500 text-sm">
            © {new Date().getFullYear()} Inner Circle AI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;