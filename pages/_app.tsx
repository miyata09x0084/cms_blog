import React, { useState } from 'react';
import { Layout } from '../components';
import type { AppProps } from 'next/app';
import '../styles/global.css';
// import { ThemeProvider } from 'styled-components';
// import { StyledColor, lightTheme, darkTheme } from '../components/ColorTheme';
// import ToggleSwitch from '../components/ToggleSwitch';
import { extendTheme, ChakraProvider } from "@chakra-ui/react";
import { Chakra } from "../components/Chakra";

function MyApp({ Component, pageProps }: AppProps) {
  // const [isDarkTheme, setIsDarkTheme] = useState(false);
  // const toggleTheme = () => {
  //   setIsDarkTheme(!isDarkTheme);
  // }

  return (
    <>
        <Chakra cookies={pageProps.cookies} >
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </Chakra>
    </>
  )
}

export default MyApp

export { getServerSideProps } from '../components/Chakra';