import React from 'react';
import NextLink from 'next/link';
import { useColorMode, useDisclosure, IconButton, Drawer, DrawerOverlay, DrawerContent, DrawerCloseButton, DrawerBody } from '@chakra-ui/react';
import { HamburgerIcon } from '@chakra-ui/icons';

const MenuItems = ({ onClick }) => (
  <>
    <NextLink href="/post" onClick={onClick} className="font-pixel text-[9px] underline">posts</NextLink>
    <NextLink href="/work" onClick={onClick} className="font-pixel text-[9px] underline">creations</NextLink>
    <a href="https://github.com/miyata09x0084" target="_blank" rel="noopener noreferrer" onClick={onClick} className="font-pixel text-[9px] underline">github</a>
  </>
);

const MenuBar = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <div className="h-[22px] border-b border-current border-dashed flex items-center gap-[14px] px-3 font-pixel text-[9px]">
      <NextLink href="/" className="font-pixel">▸ RYO</NextLink>
      <div className="ml-auto hidden md:flex items-center gap-[14px]">
        <MenuItems />
        <button
          onClick={toggleColorMode}
          aria-label="Toggle color mode"
          className="font-pixel text-[12px] leading-none"
        >
          {colorMode === 'light' ? '☾' : '☀'}
        </button>
      </div>
      <IconButton
        display={{ base: 'flex', md: 'none' }}
        className="ml-auto"
        aria-label="Open menu"
        size="xs"
        variant="unstyled"
        icon={<HamburgerIcon boxSize={3} />}
        onClick={onOpen}
      />
      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay bg="blackAlpha.700" />
        <DrawerContent bg="var(--bg)" color="var(--fg)" border="1px solid" borderColor="var(--fg)">
          <DrawerCloseButton />
          <DrawerBody className="font-pixel text-[12px] flex flex-col gap-4 pt-12">
            <MenuItems onClick={onClose} />
            <button
              onClick={() => { toggleColorMode(); onClose(); }}
              className="text-left underline"
            >
              {colorMode === 'light' ? '☾ dark mode' : '☀ light mode'}
            </button>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default MenuBar;
