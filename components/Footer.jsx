import React from 'react';
import { SocialRow, StatusBar } from './ui';

const Footer = () => {
  const today = new Date().toISOString().slice(0, 10);

  return (
    <footer className="mt-auto">
      <SocialRow />
      <StatusBar
        left="uptime: 36y"
        center="v0.42"
        right={`last updated: ${today}`}
      />
    </footer>
  );
};

export default Footer;
