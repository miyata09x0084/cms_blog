import { Box, Flex } from "@chakra-ui/react";

const TypingAnimation = () => {
  return (
    <Flex w="100%" justifyContent="center" alignItems="center" pt={1} fontFamily="Noto Sans JP" >
        <Box mx={{base: 2, md: 0}}  px={3} fontWeight="900"  pt={0.5} pb={2} borderRadius={12} textAlign="center" bg="#664D03" color="#EDDFD6">
            <Box className='typing-animation' px={1.5}>Hello, I'm Full Stack Developer based in Japan.</Box>
        </Box>
    </Flex>
  );
};

export default TypingAnimation;
