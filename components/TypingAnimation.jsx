import { Box, Flex } from "@chakra-ui/react";

const TypingAnimation = () => {
  return (
    <Flex w="100%" justifyContent="center" alignItems="center" pt={4}>
      <Box
        mx={{ base: 2, md: 0 }}
        px={4}
        fontWeight="700"
        pt={1}
        pb={2}
        borderRadius={17}
        textAlign="center"
        border="1px solid #000"
      >
        <span>Hi, I'm Full Stack Developer based in Japan.</span>
      </Box>
    </Flex>
  );
};

export default TypingAnimation;
