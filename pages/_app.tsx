import { Layout } from '../components';
import type { AppProps } from 'next/app';
import '../styles/global.css';
import { Chakra } from "../components/Chakra";

function MyApp({ Component, pageProps }: AppProps) {

  return (
    <>
        <Chakra>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </Chakra>
    </>
  )
}

export default MyApp