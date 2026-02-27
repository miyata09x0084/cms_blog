import { ChakraProvider, extendTheme } from "@chakra-ui/react";

export function Chakra({children}) {

    const googleFont = extendTheme({
        fonts: {
            heading: `'Inter', 'Noto Sans JP', sans-serif`,
            body: `'Inter', 'Noto Sans JP', sans-serif`,
        },
    })

    return (
        <ChakraProvider theme={googleFont}>
            {children}
        </ChakraProvider>
    )
}
