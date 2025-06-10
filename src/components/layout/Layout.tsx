import { ReactNode } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import ParticleBackground from '../animations/ParticleBackground';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <ParticleBackground />
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;