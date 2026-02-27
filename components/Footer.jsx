import React from "react";
import {
  Box,
  Flex,
  Text,
  HStack,
} from "@chakra-ui/react";
import Link from "next/link";
import { useColorModeValue } from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTwitter, faGithub } from "@fortawesome/free-brands-svg-icons";

const Footer = () => {
  const borderColor = useColorModeValue("var(--border)", "var(--dark-border)");
  const textSecondary = useColorModeValue("var(--text-secondary)", "var(--dark-text-secondary)");

  return (
    <footer>
      <Box
        maxWidth="720px"
        mx="auto"
        px={{ base: 5, md: 0 }}
        py={8}
        borderTop="1px solid"
        borderColor={borderColor}
        mt={16}
      >
        <Flex justifyContent="space-between" alignItems="center" fontSize="sm" color={textSecondary}>
          <Text>
            &copy; {new Date().getFullYear()} Rio Miyata
          </Text>
          <HStack spacing={5}>
            <Link
              href="https://github.com/miyata09x0084"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Box
                as="span"
                transition="opacity 0.2s"
                _hover={{ opacity: 0.6 }}
              >
                <FontAwesomeIcon icon={faGithub} width={18} height={18} />
              </Box>
            </Link>
            <Link
              href="https://x.com/WebDev_Ryo"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Box
                as="span"
                transition="opacity 0.2s"
                _hover={{ opacity: 0.6 }}
              >
                <FontAwesomeIcon icon={faTwitter} width={18} height={18} />
              </Box>
            </Link>
          </HStack>
        </Flex>
      </Box>
    </footer>
  );
};

export default Footer;
