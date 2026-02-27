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
            accent: '#0070F3',
            accentDark: '#3291FF',
        },
    },
})

export default theme
