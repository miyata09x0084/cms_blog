import React from 'react'
import { Box, useColorMode, useColorModeValue } from '@chakra-ui/react'
import { useSpring, animated, config, to } from 'react-spring';

const WorkIndex = () => {

 const { colorMode } = useColorMode();
 const bg = useColorModeValue("var(--primary-bg)", "var(--dark-bg)");
 const color = useColorModeValue("var(--primary-text)", "var(--dark-text)");
 const colorSub = useColorModeValue("var(--secondary-text)", "var(--dark-bg)");

 const AnimatedBox = animated(Box);
 const slideIn = useSpring({
    from: { transform: 'translate3d(0, 60px, 0)' },
    to: { transform: 'translate3d(0, 0, 0)' },
    config: config.slow,
  });


  return (
    <AnimatedBox style={slideIn}>
        <Box align="start" mx="auto" maxW="600px" height="100%" px={{ base: "8", md: "0" }} mb="8" className="M PLUS Rounded 1c" color={color} pt="40px">
            現在作成中。
        </Box>
    </AnimatedBox>
  )
}

export default WorkIndex