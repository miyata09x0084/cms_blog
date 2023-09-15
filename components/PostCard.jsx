import React from 'react';
import moment from 'moment';
import Link from 'next/link';
import { Heading, Text, VStack } from '@chakra-ui/react';

const PostCard = ({ post }) => {

  return (
    <VStack align="start" pb="20px">
      <Text borderBottom="1px solid #C6BFAC" pb="6px">
        {moment(post.createdAt).format('MMM DD YYYY')}
      </Text>
      <Heading as="h1" size="md">
        <Link href={`/post/${post.slug}`}>
          {post.title}
        </Link>
      </Heading>
    </VStack>
  )
}


export default PostCard