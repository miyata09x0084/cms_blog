import { extendTheme } from '@chakra-ui/react';

const config = {
    initialColorMode: 'dark',
    useSystemColorMode: false,
}

const theme = extendTheme({
    config,
    fonts: {
        heading: `'Noto Sans JP', sans-serif`,
        body: `'Noto Sans JP', sans-serif`,
    },
    styles: {
        global: {
            'html, body': {
                bg: 'var(--bg)',
                color: 'var(--fg)',
            },
        },
    },
})

export default theme
