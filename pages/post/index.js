import React from 'react'
import { getPosts } from '../../services'
import { Categories, PostCard } from '../../components'
import { VStack } from '@chakra-ui/react'

const PostIndex = ({posts}) => {
  return (
    <VStack align="start" mx="auto" maxW="768px" px={{ base: "8", md: "0" }} mb="8" className="M PLUS Rounded 1c">
        <Categories />
        {posts.map((post, index) => (<PostCard post={post.node} key={index} />))}
    </VStack>
  )
}

export async function getStaticProps() {
  const posts = (await getPosts()) || [];

  return {
    props: { posts }
  }
}

export default PostIndex
