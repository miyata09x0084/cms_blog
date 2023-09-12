import { Box } from "@chakra-ui/react";
import { motion } from "framer-motion";

const sentence = "Hello, I'm Full Stack Developer based in Japan.";
const duration = 0.15; // 任意のタイムデュレーションを設定

const TypingAnimation = () => {
  return (
    <Box fontFamily="Noto Sans JP"  mx={{base: 2, md: 0}}  px={3} fontWeight="600"  pt={1} pb={2} mt={10} borderRadius={12} textAlign="center" bg="#664D03" color="#EDDFD6">
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
  );
};

export default TypingAnimation;
