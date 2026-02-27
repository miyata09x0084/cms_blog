import React from 'react';
import {
  Box,
  Image,
  Link,
  Text,
  SimpleGrid,
  useColorModeValue,
} from '@chakra-ui/react';

const WorkIndex = () => {
  const borderColor = useColorModeValue("var(--border)", "var(--dark-border)");
  const textSecondary = useColorModeValue("var(--text-secondary)", "var(--dark-text-secondary)");

  return (
    <Box className="fade-in">
      <Box
        mx="auto"
        maxW="720px"
        px={{ base: '5', md: '0' }}
        mb="8"
        py={12}
      >
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
          <Box>
            <Link href="https://slide-pilot-474305.web.app/" _hover={{ textDecoration: 'none' }} target="_blank" rel="noopener noreferrer">
              <Box
                bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                borderRadius="12px"
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                aspectRatio="1"
                transition="transform 0.2s, box-shadow 0.2s"
                _hover={{ transform: "translateY(-2px)", boxShadow: "0 8px 30px rgba(0,0,0,0.12)" }}
              >
                <Text color="white" fontSize="lg" fontWeight="600" textAlign="center">Multimodal LLM App</Text>
                <Text color="whiteAlpha.700" fontSize="md" mt={3}>PDF &rarr; Video</Text>
              </Box>
              <Text fontWeight="600" fontSize="lg" mt="4">Multimode Lab</Text>
              <Text fontSize="sm" mt="1" color={textSecondary} lineHeight="1.7">An experimental product that auto-generates videos from PDFs. An agent built with LangGraph handles everything from PDF parsing to slide generation, narration, and video creation.</Text>
            </Link>
          </Box>
          <Box>
            <Link href="https://kangeki-dapps.web.app/" _hover={{ textDecoration: 'none' }} target="_blank" rel="noopener noreferrer">
              <Image
                src="/assets/images/dev-image1.png"
                alt="SoulBound Token DApp"
                borderRadius="12px"
                transition="transform 0.2s, box-shadow 0.2s"
                _hover={{ transform: "translateY(-2px)", boxShadow: "0 8px 30px rgba(0,0,0,0.12)" }}
              />
              <Text fontWeight="600" fontSize="lg" mt="4">SoulBound Token DApp</Text>
              <Text fontSize="sm" mt="1" color={textSecondary} lineHeight="1.7">A decentralized application for creating and managing NFTs on the ethereum.</Text>
            </Link>
          </Box>
        </SimpleGrid>
      </Box>
    </Box>
  );
};

export default WorkIndex;
