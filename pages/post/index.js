import React from "react";
import { getPosts } from "../../services";
import { Categories, PostCard } from "../../components";
import { VStack, Box, useColorMode, useColorModeValue } from "@chakra-ui/react";
import { useSpring, animated, config, to } from "react-spring";

const AnimatedBox = animated(Box);

const PostIndex = ({ posts }) => {
  const fadeIn = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 },
    config: config.molasses,
  });

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
        <VStack align="start" mb={5}>
          <iframe
            className="note-embed"
            src="https://note.com/embed/notes/n3e17e24dd31c"
            style={{
              border: 0,
              display: "block",
              maxWidth: "99%",
              width: "494px",
              padding: "0px",
              position: "static",
              visibility: "visible",
            }}
            height="400"
          ></iframe>
          <script async src="https://note.com/scripts/embed.js"></script>
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
