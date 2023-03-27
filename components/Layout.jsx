import React from 'react';
import { Header } from './';
import { useColorModeValue } from '@chakra-ui/react';
import { Box } from '@chakra-ui/react';

const Layout = ({ children }) => {

  const bg = useColorModeValue("var(--primary-bg)", "var(--dark-bg)");
  const color = useColorModeValue("var(--primary-text)", "var(--dark-text)");

  return (
    <Box bg={bg} color={color}>
       <Header />
       { children }
    </Box>
  )
}

export default Layout