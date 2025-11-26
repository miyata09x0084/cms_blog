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
  SimpleGrid,
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
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
          <Box>
            <Link href="https://slide-pilot-474305.web.app/" _hover={{ textDecoration: 'none' }} target="_blank" rel="noopener noreferrer">
              <Box
                bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                borderRadius="15px"
                boxShadow="1px 2px 28px rgb(35, 31, 24, 0.05)"
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                aspectRatio="860/930"
                p={6}
              >
                <Text color="white" fontSize="lg" fontWeight="600" textAlign="center">Multimodal LLM App</Text>
                <Text color="whiteAlpha.700" fontSize="md" mt={3}>PDF → Video</Text>
              </Box>
              <Text fontWeight="bold" fontSize="xl" mt="4">Multimode Lab</Text>
              <Text fontSize="md" mt="1">PDFから動画を自動生成する実験プロダクト。LangGraphで構築したエージェントがPDF解析からスライド生成、ナレーション、動画化までを自動で行います。</Text>
            </Link>
          </Box>
          <Box>
            <Link href="https://kangeki-dapps.web.app/" _hover={{ textDecoration: 'none' }} target="_blank" rel="noopener noreferrer">
              <Image
                src="/assets/images/dev-image1.png"
                alt="SoulBound Token DApp"
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
        </SimpleGrid>
      </Box>
    </AnimatedBox>
  );
};

export default WorkIndex;
