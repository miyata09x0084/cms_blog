import React from 'react';
import moment from 'moment';
import Link from 'next/link';
import { Heading, Text, VStack, useColorMode, useColorModeValue } from '@chakra-ui/react';

const PostCard = ({ post }) => {
  const { colorMode } = useColorMode();
  const bg = useColorModeValue("var(--primary-bg)", "var(--dark-bg)");
  const color = useColorModeValue("var(--primary-text)", "var(--dark-text)");
  const colorSub = useColorModeValue("var(--secondary-text)", "var(--dark-bg)");

  return (
    <VStack align="start" pb="20px" color={color}>
      <Text borderBottom="1px solid lightgray" pb="6px">
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