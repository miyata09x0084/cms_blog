import React from 'react';
import { Box, Flex, Spacer, IconButton } from '@chakra-ui/react';
import { useColorMode, useColorModeValue } from "@chakra-ui/react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCat } from '@fortawesome/free-solid-svg-icons';
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
                <FontAwesomeIcon width={20} height={20} icon={faCat} />
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
