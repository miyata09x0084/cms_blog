import { Box, Flex } from "@chakra-ui/react";
import { useEffect, useRef } from 'react';
import Typed from 'typed.js';

const TypingAnimation = () => {
  const el = useRef(null);

  useEffect(() => {
    const typed = new Typed(el.current, {
      strings: [
        "Hello, ^200 I'm Full Stack Developer ^200 based in Japan. ^1500" ,
        "Enjoy ^300 browsing my website! ^1500",
      ],
      smartBackspace: true,
      typeSpeed: 50,
      backSpeed: 25,
      loop: true,
    });

    return () => {
      typed.destroy();
    };
  }, []);

  return (
    <Flex w="100%" justifyContent="center" alignItems="center" pt={3} fontFamily="Noto Sans JP">
      <Box mx={{ base: 2, md: 0 }} px={3} fontWeight="800" pt={1} pb={2} borderRadius={30} textAlign="center" bg="#664D03" color="#EDDFD6">
        <span ref={el} />
      </Box>
    </Flex>
  );
};

export default TypingAnimation;
