import React, { useEffect, useState } from 'react';
import { Layout } from '../components';
import type { AppProps } from 'next/app';
import '../styles/global.css';
import { ThemeProvider } from 'styled-components';
import { StyledColor, lightTheme, darkTheme } from '../components/ColorTheme';
import ToggleSwitch from '../components/ToggleSwitch';
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import chakraTheme from '@chakra-ui/theme';
import "../styles/global.css"

const Text = chakraTheme.components;

const themeChakra = extendTheme({
  fonts: {
    body: "M PLUS Rounded 1c, sans-serif",
    heading: "M PLUS Rounded 1c, sans-serif",
  }
});


function MyApp({ Component, pageProps }: AppProps) {
  const [theme, setTheme] = useState(lightTheme);
  const isDarkTheme = (theme === darkTheme);
  const toggleTheme = () => {
    setTheme(isDarkTheme ? lightTheme : darkTheme);
  }

  return (
    <ChakraProvider theme={ themeChakra } >
      <ThemeProvider theme={isDarkTheme ? darkTheme : lightTheme} >
        <StyledColor>
        <div className="mx-auto max-w-screen-md @screen px-8 md:px-0">
          <ToggleSwitch toggleTheme={toggleTheme}/>
        </div>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </StyledColor>
      </ThemeProvider>
    </ChakraProvider>
  )
}

export default MyApp
