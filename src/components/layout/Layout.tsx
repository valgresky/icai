import { ReactNode } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { useTheme } from '../../providers/ThemeProvider';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { theme } = useTheme();
  
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;