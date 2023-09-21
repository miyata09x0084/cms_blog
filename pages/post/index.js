import React from 'react'
import { getPosts } from '../../services'
import { Categories, PostCard } from '../../components'
import { VStack, Box, useColorMode, useColorModeValue } from '@chakra-ui/react'
import { useSpring, animated, config, to } from 'react-spring';

const AnimatedBox = animated(Box);

const PostIndex = ({posts}) => {

  const fadeIn = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 },
    config: config.molasses,
  });

  const slideIn = useSpring({
    from: { transform: 'translate3d(0, 30px, 0)' },
    to: { transform: 'translate3d(0, 0, 0)' },
    config: config.slow,
  });


  return (
    <AnimatedBox style={fadeIn}>
        <VStack align="start" mx="auto" maxW="600px" px={{ base: "4", md: "0" }} mb="8" className="M PLUS Rounded 1c">
            <Categories />
            {posts.map((post, index) => (<PostCard post={post.node} key={index} />))}
        </VStack>
    </AnimatedBox>
  )
}

export async function getStaticProps() {
  const posts = (await getPosts()) || [];

  return {
    props: { posts }
  }
}

export default PostIndex
