import { ChakraProvider, extendTheme, cookieStorageManagerSSR, localStorageManager } from "@chakra-ui/react";

export function Chakra({children}) {

    const googleFont = extendTheme({
        fonts: {
            heading: `'Noto Sans JP', sans-serif`,
            body: `'Noto Sans JP', sans-serif`,
        },
    })

    return (
        <ChakraProvider theme={googleFont}>
            {children}
        </ChakraProvider>
    )
}