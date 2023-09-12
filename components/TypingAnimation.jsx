import { Box, Flex } from "@chakra-ui/react";
import { motion } from "framer-motion";

const sentence = "Hello, I'm Full Stack Developer based in Japan.";
const duration = 0.15; // 任意のタイムデュレーションを設定

const TypingAnimation = () => {
  return (
    <Flex w="100%" justifyContent="center" alignItems="center" fontFamily="Noto Sans JP">
        <Box  mx={{base: 2, md: 0}}  px={4} fontWeight="900" pt={1.5} pb={2} mt={1} borderRadius={14} textAlign="center" bg="#664D03" color="#EDDFD6">
          {sentence.split("").map((char, index) => (
            <motion.span
              key={index}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * duration }}
            >
              {char}
            </motion.span>
          ))}
        </Box>
    </Flex>
  );
};

export default TypingAnimation;
