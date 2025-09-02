import React from 'react';
import {
  Box,
  useColorMode,
  useColorModeValue,
  Image,
  Flex,
  Link,
  Spacer,
  Text,
} from '@chakra-ui/react';
import { useSpring, animated, config } from 'react-spring';

const WorkIndex = () => {

  const AnimatedBox = animated(Box);
  const slideIn = useSpring({
    from: { transform: 'translate3d(0, 30px, 0)' },
    to: { transform: 'translate3d(0, 0, 0)' },
    config: config.slow,
  });

  const fadeIn = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 },
    config: config.molasses,
  });

  return (
    <AnimatedBox style={slideIn}>
      <Box
        align="start"
        mx="auto"
        maxW="768px"
        height="100%"
        px={{ base: '4', md: '0' }}
        mb="8"
        pt="40px"
      >
        <Flex justifyContent="center" width="100%" height="100%">
          <Box width="450px">
            <Link href="https://kangeki-dapps.web.app/" _hover={{ textDecoration: 'none' }} target="_blank" rel="noopener noreferrer">
              <Image
                src="/assets/images/dev-image1.png"
                alt="Image1"
                borderRadius="15px"
                boxShadow="1px 2px 28px rgb(35, 31, 24, 0.05)"
                quality={90}
                priority={true}
                loading="eager"
              />
              <Text fontWeight="bold" fontSize="xl" mt="4">SoulBound Token DApp</Text>
              <Text fontSize="md" mt="1">A decentralized application for creating and managing NFTs on the ethereum.</Text>
            </Link>
          </Box>
        </Flex>
      </Box>
    </AnimatedBox>
  );
};

export default WorkIndex;
