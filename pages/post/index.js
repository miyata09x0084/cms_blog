import React from "react";
import { getPosts } from "../../services";
import { Categories, PostCard } from "../../components";
import { VStack, Box, Text, useColorModeValue } from "@chakra-ui/react";

const PostIndex = ({ posts }) => {
  const accentColor = useColorModeValue("var(--accent)", "var(--dark-accent)");

  return (
    <Box className="fade-in">
      <VStack
        align="start"
        mx="auto"
        maxW="720px"
        px={{ base: "5", md: "0" }}
        mb="8"
        py={8}
      >
        <Categories />
        {posts.map((post, index) => (
          <PostCard post={post.node} key={index} />
        ))}
        <VStack align="start" spacing={3} mt={6} w="100%">
          <Box
            as="a"
            href="https://note.com/miyata_ryo3/n/n547f8cd950c5"
            target="_blank"
            rel="noopener noreferrer"
            color={accentColor}
            fontSize="15px"
            transition="opacity 0.2s"
            _hover={{ opacity: 0.7 }}
          >
            ネットの安全はなぜ？ 行きは簡単なのに戻るのは驚くほど難しい数学が鍵 (2025.12.26)
          </Box>
          <Box
            as="a"
            href="https://note.com/miyata_ryo3/n/n3e17e24dd31c"
            target="_blank"
            rel="noopener noreferrer"
            color={accentColor}
            fontSize="15px"
            transition="opacity 0.2s"
            _hover={{ opacity: 0.7 }}
          >
            人を表すソウルバンドトークンとよばれるNFT (2023.1.23)
          </Box>
        </VStack>
      </VStack>
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
