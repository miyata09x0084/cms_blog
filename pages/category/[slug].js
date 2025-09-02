import React from 'react'
import { useRouter } from 'next/router';
import { getCategories, getCategoryPost } from '../../services';
import { PostCard, Loader, Categories } from '../../components';
import { VStack, Box, Flex, Text } from '@chakra-ui/react';
import { useSpring, animated, config, to } from 'react-spring';

const CategoryPost = ({ posts }) => {
  const router = useRouter();
  const AnimatedBox = animated(Box)
  const slideIn = useSpring({
    from: { transform: 'translate3d(0, 60px, 0)' },
    to: { transform: 'translate3d(0, 0, 0)' },
    config: config.slow,
  });

  if (router.isFallback) {
    return <Loader />
  }

  return (
    <Box align="start" mx="auto" maxW="768px" px={{ base: "4", md: "0" }} mb="8">
    <Categories />
    {posts.map((post, index) => (
        <PostCard key={index} post={post.node} />
    ))}
</Box>
  )
}

export default CategoryPost

export async function getStaticProps({ params }) {
    const posts = await getCategoryPost(params.slug);
    return {
        props: { posts },
    };
}

export async function getStaticPaths() {
    const categories = await getCategories();
    return {
        paths: categories.map(({ slug }) => ({params: { slug }})),
        fallback: true,
    };
}