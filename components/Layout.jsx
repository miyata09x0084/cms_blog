import React from 'react';
import { Header, Footer } from './';
import { Box, useColorModeValue } from "@chakra-ui/react";

const Layout = ({ children }) => {

  const bg = useColorModeValue("var(--bg)", "var(--dark-bg)");
  const color = useColorModeValue("var(--text)", "var(--dark-text)");

  return (
    <div>
      <style>
        {`
          body:before {
            background-color: ${bg};
          }
        `}
      </style>
      <Box bg={bg} color={color} w="100%" h="100%">
        <Header />
        {children}
        <Footer />
      </Box>
    </div>
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
