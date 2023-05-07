import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHand } from '@fortawesome/free-solid-svg-icons';
import { Box, Flex, Text, Spacer, HStack, IconButton, Drawer, DrawerOverlay, DrawerContent, DrawerCloseButton, DrawerHeader, DrawerBody, VStack, useDisclosure, Button } from '@chakra-ui/react';
import { HamburgerIcon } from '@chakra-ui/icons';
import { useColorMode, useColorModeValue } from "@chakra-ui/react"
import SunIcon from './ToggleSwitch/icons/SunIcon';
import MoonIcon from './ToggleSwitch/icons/MoonIcon';
import Link from 'next/link';


const Header = () => {

  const { isOpen, onOpen, onClose } = useDisclosure();

  const MenuItems = () => (
    <>
      <Link href="/work" _hover={{ textDecoration: 'none' }} fontWeight="medium">Works</Link>
      <Link href="/post" _hover={{ textDecoration: 'none' }} fontWeight="medium">Posts</Link>
      <Link href="https://github.com/miyata09x0084" target="_blank" rel="noopener noreferrer" _hover={{ textDecoration: 'none' }} fontWeight="medium">GitHub</Link>
    </>
  );

  const { colorMode, toggleColorMode } = useColorMode();
  const bg = useColorModeValue("var(--primary-bg)", "var(--dark-bg)");
  const color = useColorModeValue("var(--primary-text)", "var(--dark-text)");
  const colorSub = useColorModeValue("var(--secondary-text)", "var(--dark-bg)");
  const icon = useColorModeValue("var(--sun-icon)", "var(--moon-icon)");

  const sunIcon = <SunIcon/>
  const moonIcon = <MoonIcon/>

  return (
    <header>
        <Box pt={10} maxWidth="768px" fontSize="xl" px={{base: 8, md: 0}}  mx="auto">
          <Flex>
              <Text mx={0.5} letterSpacing="-1.2px"  fontWeight="800" display="flex" alignItems="center">
                <Link href="/" _hover={{ textDecoration: 'none' }}>Rio Miyata</Link>
              </Text>
              <Spacer />
              <HStack spacing={4} display={{base: "none", md: "flex"}}>
                <MenuItems />
                  <IconButton
                    className={`theme-toggle-button ${colorMode === "light" ? "moon" : "sun"}`}
                    onClick={toggleColorMode}
                    w="40px"
                    icon={colorMode === "light" ? moonIcon : sunIcon}
                    aria-label="Toggle dark mode"
                    color={icon}
                    _hover={{ bg: {bg} }}
                    bg={bg}
                  />
              </HStack>
              <IconButton
                display={{base: "flex", md: "none"}}
                aria-label="Open menu"
                bg={color}
                _hover ={{ bg: {color} }}
                icon ={<HamburgerIcon color={colorSub}/>}
                onClick={onOpen}
              />
          </Flex>
          <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
            <DrawerOverlay>
              <DrawerContent color={color}>
                <DrawerCloseButton/>
                <DrawerHeader borderBottomWidth="1px" bg={bg}>Menu</DrawerHeader>
                <DrawerBody  fontWeight="medium" bg={bg}>
                  <VStack align="start">
                    <MenuItems />
                  </VStack>
                </DrawerBody>
              </DrawerContent>
            </DrawerOverlay>
          </Drawer>
        </Box>
    </header>
  )
}

export default Header