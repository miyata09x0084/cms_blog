import React from 'react'
import { useRouter } from 'next/router';
import { getCategories, getCategoryPost } from '../../services';
import { PostCard, Loader, Categories } from '../../components';
import { VStack, Box } from '@chakra-ui/react';

const CategoryPost = ({ posts }) => {
  const router = useRouter();

  if (router.isFallback) {
    return <Loader />
  }

  return (
    <Box className="fade-in">
      <VStack align="start" mx="auto" maxW="768px" px={{ base: "4", md: "0" }} mb="8" pt="40px" spacing={6}>
        <Categories />
        {posts.map((post, index) => (
            <PostCard key={index} post={post.node} />
        ))}
      </VStack>
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
