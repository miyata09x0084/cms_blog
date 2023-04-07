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
  const { colorMode } = useColorMode();
  const bg = useColorModeValue('var(--primary-bg)', 'var(--dark-bg)');
  const color = useColorModeValue('var(--primary-text)', 'var(--dark-text)');
  const colorSub = useColorModeValue(
    'var(--secondary-text)',
    'var(--dark-bg)'
  );

  const AnimatedBox = animated(Box);
  const slideIn = useSpring({
    from: { transform: 'translate3d(0, 60px, 0)' },
    to: { transform: 'translate3d(0, 0, 0)' },
    config: config.slow,
  });

  return (
    <AnimatedBox style={slideIn}>
      <Box
        align="start"
        mx="auto"
        maxW="767px"
        height="100%"
        px={{ base: '8', md: '0' }}
        mb="8"
        className="M PLUS Rounded 1c"
        color={color}
        pt="40px"
      >
        <Flex justifyContent="space-between" width="100%" height="100%">
          <Box width="370px">
            <Link href="https://merkletree-dapp.web.app" _hover={{ textDecoration: 'none' }} target="_blank" rel="noopener noreferrer">
              <Image src="/assets/images/nft-mint-dapp.png" alt="Image 1" borderRadius="xl" boxShadow="lg"/>
              <Text fontWeight="bold" fontSize="xl" mt="4">NFT Minting DApp</Text>
              <Text fontSize="md" mt="1">A decentralized application for creating and managing NFTs on the blockchain.</Text>
            </Link>
          </Box>
        </Flex>
      </Box>
    </AnimatedBox>
  );
};

export default WorkIndex;
