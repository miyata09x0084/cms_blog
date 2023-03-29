import React, { useState, useEffect } from 'react';
import { Header } from './';
import { ChakraProvider, extendTheme, cookieStorageManagerSSR, localStorageManager, Box, useColorModeValue } from "@chakra-ui/react";

const Layout = ({ children }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const colorModeManager =
    typeof cookies === "string"
      ? cookieStorageManagerSSR(cookies)
      : localStorageManager

  const bg= useColorModeValue("var(--primary-bg)", "var(--dark-bg)");
  const color = useColorModeValue("var(--primary-text)", "var(--dark-text)");

  return (
    isMounted ? (
      <Box bg={bg} color={color}>
          <Header />
          {children}
      </Box>
    ) : null
  )
}

export default Layout

export function getServerSideProps({ req }) {
  return {
    props: {
      cookies: req.headers.cookie ?? "",
    }
  }
}