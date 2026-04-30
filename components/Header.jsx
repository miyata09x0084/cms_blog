import React from 'react';
import { useRouter } from 'next/router';
import { TitleBar, MenuBar } from './ui';

const Header = () => {
  const router = useRouter();
  const path = router.asPath || '/';

  return (
    <header>
      <TitleBar path={path} />
      <MenuBar />
    </header>
  );
};

export default Header;
