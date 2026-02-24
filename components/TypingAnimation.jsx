import { Box, Flex } from "@chakra-ui/react";

const TypingAnimation = () => {
  return (
    <Flex w="100%" justifyContent="center" alignItems="center" pt={4}>
      <Box
        mx={{ base: 2, md: 0 }}
        px={{ base: 3, md: 4 }}
        py={{ base: 2, md: 2 }}
        fontWeight="700"
        borderRadius={17}
        textAlign="center"
        border="1px solid #000"
        minHeight={{ base: "auto", md: "40px" }}
        maxWidth={{ base: "90vw", md: "600px" }}
        display="flex"
        alignItems="center"
        justifyContent="center"
        fontSize={{ base: "14px", md: "16px" }}
        whiteSpace={{ base: "normal", md: "nowrap" }}
        wordBreak="break-word"
      >
        {"Hi, I'm Full Stack Developer based in Japan."}
      </Box>
    </Flex>
  );
};

export default TypingAnimation;
