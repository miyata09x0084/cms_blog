import React from 'react';
import { Header, Footer } from './';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex justify-center">
      <div className="w-full max-w-[720px] min-h-screen flex flex-col border-x border-current md:border-t md:border-b">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
