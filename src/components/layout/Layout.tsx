import { ReactNode } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import ParticleBackground from '../animations/ParticleBackground';
import { useTheme } from '../../providers/ThemeProvider';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { theme } = useTheme();
  
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Only show particles in dark and glass themes */}
      {theme !== 'light' && <ParticleBackground />}
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;