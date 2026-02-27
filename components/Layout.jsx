import React from 'react';
import { Header, Footer } from './';
import { Box, useColorModeValue } from "@chakra-ui/react";

const Layout = ({ children }) => {

  const bg = useColorModeValue("var(--bg)", "var(--dark-bg)");
  const color = useColorModeValue("var(--text)", "var(--dark-text)");

  return (
    <Box bg={bg} color={color} minH="100vh">
      <Header />
      {children}
      <Footer />
    </Box>
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
