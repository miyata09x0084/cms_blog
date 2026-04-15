import React from "react";
import { getPosts } from "../../services";
import { Categories, PostCard } from "../../components";
import { VStack, Box, Text, useColorModeValue } from "@chakra-ui/react";

const PostIndex = ({ posts }) => {
  const linkColor = useColorModeValue("var(--accent)", "var(--dark-accent)");
  const textSecondary = useColorModeValue("var(--text-secondary)", "var(--dark-text-secondary)");
  const borderColor = useColorModeValue("var(--border)", "var(--dark-border)");

  return (
    <Box className="fade-in">
      <Box
        maxWidth="768px"
        mx="auto"
        px={{ base: 4, md: 0 }}
        pt="40px"
        pb={16}
        fontSize="17px"
        letterSpacing="0.06em"
        lineHeight="1.5"
      >
        <Categories />
        <VStack align="start" spacing={6}>
          {posts.map((post, index) => (
            <PostCard post={post.node} key={index} />
          ))}
          <Box
            as="a"
            href="https://note.com/miyata_ryo3/n/n3e17e24dd31c"
            target="_blank"
            rel="noopener noreferrer"
            w="100%"
            pb={5}
            borderBottom="1px solid"
            borderColor={borderColor}
            transition="color 0.2s"
            _hover={{ color: linkColor }}
          >
            <VStack align="start" spacing={2}>
              <Text fontSize="sm" color={textSecondary}>2023.1.23</Text>
              <Text fontSize="md" fontWeight="600">人を表すソウルバンドトークンとよばれるNFT</Text>
            </VStack>
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
