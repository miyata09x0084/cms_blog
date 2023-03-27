import { ChakraProvider, extendTheme, cookieStorageManagerSSR, localStorageManager } from "@chakra-ui/react";

export function Chakra({ cookies, children}) {
    const colorModeManager =
        typeof cookies === "string"
            ? cookieStorageManagerSSR(cookies)
            : localStorageManager

    const googleFont = extendTheme({
        fonts: {
            heading: `'M PLUS Rounded 1c', sans-serif`,
            body: `'M PLUS Rounded 1c', sans-serif`,
        },
        })

    return (
        <ChakraProvider colorModeManager={colorModeManager} theme={googleFont}>
            {children}
        </ChakraProvider>
    )
}

export function getServerSideProps({ req }) {
    return {
        props: {
            cookies: req.headers.cookie ?? "",
        }
    }
}