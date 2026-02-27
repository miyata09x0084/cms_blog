import React from 'react';
import moment from 'moment';
import Link from 'next/link';
import { Flex, Text, useColorModeValue } from '@chakra-ui/react';

const PostCard = ({ post }) => {
  const borderColor = useColorModeValue("var(--border)", "var(--dark-border)");
  const textSecondary = useColorModeValue("var(--text-secondary)", "var(--dark-text-secondary)");
  const accentColor = useColorModeValue("var(--accent)", "var(--dark-accent)");

  return (
    <Link href={`/post/${post.slug}`} style={{ width: '100%' }}>
      <Flex
        justifyContent="space-between"
        alignItems="baseline"
        w="100%"
        py={3}
        borderBottom="1px solid"
        borderColor={borderColor}
        transition="color 0.2s"
        _hover={{ color: accentColor }}
        flexWrap="wrap"
        gap={2}
      >
        <Text fontSize="15px" fontWeight="500">
          {post.title}
        </Text>
        <Text fontSize="sm" color={textSecondary} flexShrink={0}>
          {moment(post.createdAt).format('MMM DD, YYYY')}
        </Text>
      </Flex>
    </Link>
  )
}

export default PostCard
