import React from 'react';
import { useTheme } from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDove, faSun, faMoon } from '@fortawesome/free-solid-svg-icons';
import { Box, Flex, Text, Spacer, Link, HStack, IconButton, Drawer, DrawerOverlay, DrawerContent, DrawerCloseButton, DrawerHeader, DrawerBody, VStack, useDisclosure, Button } from '@chakra-ui/react';
import { HamburgerIcon } from '@chakra-ui/icons';
import { useColorMode, useColorModeValue } from "@chakra-ui/react"
import { motion } from 'framer-motion';


const Header = () => {
  const theme = useTheme()

  const { isOpen, onOpen, onClose } = useDisclosure();

  const MenuItems = () => (
    <Flex fontWeight="medium">
      <Link href="/post" _hover={{ textDecoration: 'none' }} >Post</Link>
      <Link href="/work" _hover={{ textDecoration: 'none' }} ml="12px">Work</Link>
      <Link href="https://github.com/miyata09x0084" _hover={{ textDecoration: 'none' }} ml="12px">GitHub</Link>
    </Flex>
  );

  const { colorMode, toggleColorMode } = useColorMode();
  const bg = useColorModeValue("var(--primary-bg)", "var(--dark-bg)");
  const color = useColorModeValue("var(--primary-text)", "var(--dark-text)");
  const colorSub = useColorModeValue("var(--secondary-text)", "var(--dark-bg)");

  const sunIcon = <FontAwesomeIcon icon={faSun} />
  const moonIcon = <FontAwesomeIcon icon={faMoon} />

  const sunToMoonVariants = {
    light: { rotate: 0, color: "var(--primary-text)" },
    dark: { rotate: 180, color: "var(--dark-text)" },
  };

  const moonToSunVariants = {
    light: { rotate: 0, color: "var(--primary-text)" },
    dark: { rotate: -180, color: "var(--dark-text)" },
  };

  return (
    <header>
      <Box w="100vw" bg={bg}>
        <Box maxWidth="768px" pt="10px" fontSize="xl" px={{base: 8, md: 0}}  mx="auto" color={color} bg={bg}>
            <Flex justifyContent="right" py="10px">
                  <motion.div
                    animate={colorMode === 'light' ? 'dark' : 'light'}
                    variants={colorMode === 'light' ? sunToMoonVariants : moonToSunVariants}
                    transition={{ duration: 0.6 }}
                  >
                    <IconButton
                      onClick={toggleColorMode}
                      icon={colorMode === "light" ? sunIcon : moonIcon}
                      aria-label="Toggle dark mode"
                      color={color}
                      _hover={{ bg: {bg} }}
                      bg={bg}
                    />
                  </motion.div>
            </Flex>
          <Flex>
              <Flex alignItems="center" w="20px">
                <FontAwesomeIcon icon={faDove}/>
              </Flex>
              <Text mx={1} letterSpacing="-1px"  fontWeight="bold" display="flex" alignItems="center">
                <Link href="/" _hover={{ textDecoration: 'none' }}>Rio Miyata</Link>
              </Text>
              <Spacer />
              <HStack spacing={4} display={{base: "none", md: "flex"}}>
                <MenuItems />
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
      </Box>
    </header>
  )
}

export default Header