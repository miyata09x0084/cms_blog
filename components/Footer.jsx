import React from "react";
import {
  Box,
  Flex,
  Text,
  HStack,
  Image,
  Link,
  useColorModeValue,
} from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTwitter, faGithub } from "@fortawesome/free-brands-svg-icons";

const Footer = () => {
  const textSecondary = useColorModeValue("var(--text-secondary)", "var(--dark-text-secondary)");

  return (
    <footer>
      <Box h="100%" pt={16} pb={8} maxWidth="768px" mx="auto" px={{ base: 4, md: 0 }}>
        <Box fontSize="xl">
          <Flex justifyContent="space-between" alignItems="center">
            <HStack mx={1} spacing={6} display="flex" alignItems="center">
              <Link
                href="https://github.com/miyata09x0084"
                target="_blank"
                rel="noopener noreferrer"
                _hover={{ textDecoration: "none", opacity: 0.7 }}
              >
                <Flex alignItems="center">
                  <FontAwesomeIcon icon={faGithub} width={20} height={20} />
                  <Text ml={1}>Github</Text>
                </Flex>
              </Link>
              <Link
                href="https://etherscan.io/address/0x906b1f02B8BBCA762896d368e40C77c857Db6A0B"
                target="_blank"
                rel="noopener noreferrer"
                _hover={{ textDecoration: "none", opacity: 0.7 }}
              >
                <Flex alignItems="center">
                  <Image
                    src="/assets/images/etherscan-logo-circle.png"
                    alt="etherscan-icon"
                    w="19px"
                    h="19px"
                    mr={1}
                  />
                  <Text>Etherscan</Text>
                </Flex>
              </Link>
            </HStack>
            <Link
              href="https://x.com/WebDev_Ryo"
              target="_blank"
              rel="noopener noreferrer"
              _hover={{ textDecoration: "none" }}
            >
              <Flex
                alignItems="center"
                sx={{
                  "&:hover .x-icon": {
                    animation: "iconBounce 0.5s ease",
                  },
                }}
              >
                <Box as="span" className="x-icon" display="inline-block" mr={1}>
                  <FontAwesomeIcon icon={faTwitter} width={20} height={20} />
                </Box>
                <Text ml={0.5}>X</Text>
              </Flex>
            </Link>
          </Flex>
        </Box>
      </Box>
      <Box
        fontSize="sm"
        maxWidth="768px"
        px={{ base: 4, md: 0 }}
        mx="auto"
        mb={6}
        textAlign="center"
        color={textSecondary}
      >
        <Text>Built and designed by Ryo Miyata.</Text>
        <Text>All rights reserved. ©</Text>
      </Box>
    </footer>
  );
};

export default Footer;
