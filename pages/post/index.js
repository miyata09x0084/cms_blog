import React from "react";
import { getPosts } from "../../services";
import { Categories, PostCard } from "../../components";
import { VStack, Box } from "@chakra-ui/react";
import { useSpring, animated, config } from "react-spring";

const AnimatedBox = animated(Box);

const PostIndex = ({ posts }) => {
  const slideIn = useSpring({
    from: { transform: "translate3d(0, 30px, 0)" },
    to: { transform: "translate3d(0, 0, 0)" },
    config: config.slow,
  });

  return (
    <AnimatedBox style={slideIn}>
      <VStack
        align="start"
        mx="auto"
        maxW="768px"
        px={{ base: "4", md: "0" }}
        mb="8"
        className="M PLUS Rounded 1c"
      >
        <Categories />
        {posts.map((post, index) => (
          <PostCard post={post.node} key={index} />
        ))}
        <VStack align="start" spacing={2} mb={5}>
          <a
            href="https://note.com/miyata_ryo3/n/n547f8cd950c5"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#0066cc", textDecoration: "underline", fontSize: "16px" }}
          >
            ネットの安全はなぜ？ 行きは簡単なのに戻るのは驚くほど難しい数学が鍵 (2025.12.26)
          </a>
          <a
            href="https://note.com/miyata_ryo3/n/n3e17e24dd31c"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#0066cc", textDecoration: "underline", fontSize: "16px" }}
          >
            人を表すソウルバンドトークンとよばれるNFT (2023.1.23)
          </a>
        </VStack>
      </VStack>
    </AnimatedBox>
  );
};

export async function getStaticProps() {
  const posts = (await getPosts()) || [];

  return {
    props: { posts },
  };
}

export default PostIndex;
