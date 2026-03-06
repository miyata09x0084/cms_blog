import { extendTheme } from '@chakra-ui/react';

const config = {
    initialColorMode: 'light',
    useSystemColorMode: false,
}

const theme = extendTheme({
    config,
    fonts: {
        heading: `'Inter', 'Noto Sans JP', sans-serif`,
        body: `'Inter', 'Noto Sans JP', sans-serif`,
    },
    colors: {
        brand: {
            accent: '#049872',
            accentDark: '#00C4B4',
        },
    },
})

export default theme
