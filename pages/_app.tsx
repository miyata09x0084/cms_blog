import React, { useState } from 'react';
import { Layout } from '../components';
import type { AppProps } from 'next/app';
import '../styles/global.css';
import { ThemeProvider } from 'styled-components';
import { StyledColor, lightTheme, darkTheme } from '../components/ColorTheme';
// import ToggleSwitch from '../components/ToggleSwitch';
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import Head from 'next/head';

function MyApp({ Component, pageProps }: AppProps) {
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);
  }

  const googleFont = extendTheme({
    fonts: {
      heading: `'M PLUS Rounded 1c', sans-serif`,
      body: `'M PLUS Rounded 1c', sans-serif`,
    },
  })

  return (
    <>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=M+PLUS+Rounded+1c:wght@100;300;400;500;700;800;900&family=Source+Code+Pro:ital,wght@0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet" />
      </Head>
      <ChakraProvider theme={googleFont}>
          {/* <ThemeProvider theme={isDarkTheme ? darkTheme : lightTheme} > */}
            <StyledColor>
              <Layout>
                <Component {...pageProps} />
              </Layout>
            </StyledColor>
          {/* </ThemeProvider> */}
      </ChakraProvider>
    </>
  )
}

export default MyApp