import { Layout } from '../components';
import type { AppProps } from 'next/app';
import '../styles/global.css';
// import { ThemeProvider } from 'styled-components';
// import { StyledColor, lightTheme, darkTheme } from '../components/ColorTheme';
// import ToggleSwitch from '../components/ToggleSwitch';
import { Chakra } from "../components/Chakra";

function MyApp({ Component, pageProps }: AppProps) {

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