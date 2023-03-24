import React from 'react'
import { Box, VStack, useColorMode, useColorModeValue } from '@chakra-ui/react'

const WorkIndex = () => {

 const { colorMode } = useColorMode();
 const bg = useColorModeValue("var(--primary-bg)", "var(--dark-bg)");
 const color = useColorModeValue("var(--primary-text)", "var(--dark-text)");
 const colorSub = useColorModeValue("var(--secondary-text)", "var(--dark-bg)");

  return (
    <Box w="100%" h="100%" bg={bg}>
        <Box align="start" mx="auto" maxW="768px" h="100vh" px={{ base: "8", md: "0" }} mb="8" className="M PLUS Rounded 1c" color={color} pt="40px">
            現在作成中。
        </Box>
    </Box>
  )
}

export default WorkIndex