import React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { Breadcrumb } from './Breadcrumb';

interface LayoutProps {
  children: React.ReactNode;
  showBreadcrumb?: boolean;
}

export function Layout({ children, showBreadcrumb = true }: LayoutProps) {
  return (
    <>
      <Header />
      {showBreadcrumb && (
        <div className="max-w-7xl mx-auto">
          <Breadcrumb />
        </div>
      )}
      <main>
        {children}
      </main>
      <Footer />
    </>
  );
}

export default Layout;
