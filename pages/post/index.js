import React from "react";
import { getPosts } from "../../services";
import { Categories, PostCard } from "../../components";
import { VStack, Box, Flex, Text, Heading, useColorModeValue } from "@chakra-ui/react";

const PostIndex = ({ posts }) => {
  const linkColor = useColorModeValue("var(--accent)", "var(--dark-accent)");
  const textSecondary = useColorModeValue("var(--text-secondary)", "var(--dark-text-secondary)");
  const borderColor = useColorModeValue("var(--border)", "var(--dark-border)");

  return (
    <Box className="fade-in">
      <Box
        maxWidth="720px"
        mx="auto"
        px={{ base: 5, md: 0 }}
        py={16}
        fontSize="15px"
        letterSpacing="0.01em"
        lineHeight="1.7"
      >
        <Heading as="h2" fontSize="sm" fontWeight="600" textTransform="uppercase" letterSpacing="0.1em" color={textSecondary} mb={6}>
          Posts
        </Heading>
        <Categories />
        <VStack align="start" spacing={4}>
          {posts.map((post, index) => (
            <PostCard post={post.node} key={index} />
          ))}
          <Box
            as="a"
            href="https://note.com/miyata_ryo3/n/n547f8cd950c5"
            target="_blank"
            rel="noopener noreferrer"
            w="100%"
            py={3}
            borderBottom="1px solid"
            borderColor={borderColor}
            transition="color 0.2s"
            _hover={{ color: linkColor }}
          >
            <Flex justifyContent="space-between" alignItems="baseline" flexWrap="wrap" gap={2}>
              <Text fontSize="15px">ネットの安全はなぜ？ 行きは簡単なのに戻るのは驚くほど難しい数学が鍵</Text>
              <Text fontSize="sm" color={textSecondary} flexShrink={0}>2025.12.26</Text>
            </Flex>
          </Box>
          <Box
            as="a"
            href="https://note.com/miyata_ryo3/n/n3e17e24dd31c"
            target="_blank"
            rel="noopener noreferrer"
            w="100%"
            py={3}
            borderBottom="1px solid"
            borderColor={borderColor}
            transition="color 0.2s"
            _hover={{ color: linkColor }}
          >
            <Flex justifyContent="space-between" alignItems="baseline" flexWrap="wrap" gap={2}>
              <Text fontSize="15px">人を表すソウルバンドトークンとよばれるNFT</Text>
              <Text fontSize="sm" color={textSecondary} flexShrink={0}>2023.1.23</Text>
            </Flex>
          </Box>
        </VStack>
      </Box>
    </Box>
  );
};

export async function getStaticProps() {
  const posts = (await getPosts()) || [];

  return {
    props: { posts },
  };
}

export default PostIndex;
