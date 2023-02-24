import React, { useEffect, useState } from 'react';
import { Layout } from '../components';
import type { AppProps } from 'next/app';
import '../styles/global.css';
import { ThemeProvider } from 'styled-components';
import { StyledColor, lightTheme, darkTheme } from '../components/ColorTheme';
import ToggleSwitch from '../components/ToggleSwitch';


function MyApp({ Component, pageProps }: AppProps) {
  const [theme, setTheme] = useState(lightTheme);
  const isDarkTheme = (theme === darkTheme);
  const toggleTheme = () => {
    setTheme(isDarkTheme ? lightTheme : darkTheme);
  }

  return (
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
  )
}

export default MyApp
