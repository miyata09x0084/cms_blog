import React, { useState, useEffect } from 'react';
import { Header, Footer } from './';
import { cookieStorageManagerSSR, localStorageManager, Box, useColorModeValue } from "@chakra-ui/react";

const Layout = ({ children }) => {

  const colorModeManager =
    typeof cookies === "string"
      ? cookieStorageManagerSSR(cookies)
      : localStorageManager

  const bg= useColorModeValue("var(--primary-bg)", "var(--dark-bg)");
  const color = useColorModeValue("var(--primary-text)", "var(--dark-text)");

  return (
      <body>
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
      </body>
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