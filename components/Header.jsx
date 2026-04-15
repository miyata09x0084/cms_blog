import React from 'react';
import {
  Box,
  Flex,
  Spacer,
  HStack,
  VStack,
  IconButton,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  useDisclosure,
  useColorMode,
  useColorModeValue,
  Link as ChakraLink,
} from '@chakra-ui/react';
import { HamburgerIcon } from '@chakra-ui/icons';
import NextLink from 'next/link';
import SunIcon from './ToggleSwitch/icons/SunIcon';
import MoonIcon from './ToggleSwitch/icons/MoonIcon';
import CatLogo from './CatLogo';

const MenuItems = () => (
  <>
    <ChakraLink as={NextLink} href="/work" _hover={{ textDecoration: 'none' }}>
      Creations
    </ChakraLink>
    <ChakraLink as={NextLink} href="/post" _hover={{ textDecoration: 'none' }}>
      Posts
    </ChakraLink>
    <ChakraLink
      href="https://github.com/miyata09x0084"
      target="_blank"
      rel="noopener noreferrer"
      _hover={{ textDecoration: 'none' }}
    >
      GitHub
    </ChakraLink>
  </>
);

const Header = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { colorMode, toggleColorMode } = useColorMode();

  const bg = useColorModeValue('var(--bg)', 'var(--dark-bg)');
  const color = useColorModeValue('var(--text)', 'var(--dark-text)');
  const colorSub = useColorModeValue('var(--text-secondary)', 'var(--dark-bg)');
  const icon = useColorModeValue('var(--sun-icon)', 'var(--moon-icon)');

  return (
    <header>
      <Box pt={5} pb={9} maxWidth="768px" fontSize="xl" px={{ base: 4, md: 0 }} mx="auto">
        <Flex alignItems="center">
          <CatLogo />
          <Spacer />
          <HStack spacing={5} display={{ base: 'none', md: 'flex' }} fontWeight="500">
            <MenuItems />
            <IconButton
              className={`theme-toggle-button ${colorMode === 'light' ? 'moon' : 'sun'}`}
              onClick={toggleColorMode}
              w="40px"
              icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
              aria-label="Toggle dark mode"
              color={icon}
              bg={bg}
              _hover={{ bg }}
            />
          </HStack>
          <IconButton
            display={{ base: 'flex', md: 'none' }}
            aria-label="Open menu"
            bg={color}
            _hover={{ bg: color }}
            icon={<HamburgerIcon color={colorSub} />}
            onClick={onOpen}
          />
        </Flex>
        <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
          <DrawerOverlay>
            <DrawerContent color={color}>
              <DrawerCloseButton />
              <DrawerHeader borderBottomWidth="1px" bg={bg}>
                Menu
              </DrawerHeader>
              <DrawerBody fontWeight="500" bg={bg}>
                <VStack align="start" spacing={4} fontSize="lg">
                  <MenuItems />
                </VStack>
              </DrawerBody>
            </DrawerContent>
          </DrawerOverlay>
        </Drawer>
      </Box>
    </header>
  );
};

export default Header;
