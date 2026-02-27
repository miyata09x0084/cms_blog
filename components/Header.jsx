import React from 'react';
import { Box, Flex, Text, Spacer, HStack, IconButton, Icon } from '@chakra-ui/react';
import { useColorMode, useColorModeValue } from "@chakra-ui/react"
import SunIcon from './ToggleSwitch/icons/SunIcon';
import MoonIcon from './ToggleSwitch/icons/MoonIcon';
import Link from 'next/link';

const Header = () => {

  const { colorMode, toggleColorMode } = useColorMode();
  const color = useColorModeValue("var(--text)", "var(--dark-text)");
  const borderColor = useColorModeValue("var(--border)", "var(--dark-border)");

  return (
    <header>
        <Box
          py={4}
          maxWidth="720px"
          fontSize="md"
          px={{base: 5, md: 0}}
          mx="auto"
          borderBottom="1px solid"
          borderColor={borderColor}
        >
          <Flex alignItems="center">
              <Link href="/" passHref>
                <Icon viewBox="0 0 24 24" boxSize={5} aria-hidden="true">
                  <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1h-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                </Icon>
              </Link>
              <Spacer />
              <IconButton
                className="theme-toggle-button"
                onClick={toggleColorMode}
                w="32px"
                h="32px"
                minW="32px"
                icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
                aria-label="Toggle dark mode"
                color={color}
                bg="transparent"
                _hover={{ opacity: 0.6 }}
              />
          </Flex>
        </Box>
    </header>
  )
}

export default Header
