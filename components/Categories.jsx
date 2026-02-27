import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Box, Flex, useColorModeValue } from '@chakra-ui/react';
import { getCategories } from '../services';

const Categories = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    getCategories()
      .then((newCategories) => setCategories(newCategories))
  }, [])

  const borderColor = useColorModeValue("var(--border)", "var(--dark-border)");
  const textSecondary = useColorModeValue("var(--text-secondary)", "var(--dark-text-secondary)");
  const accentColor = useColorModeValue("var(--accent)", "var(--dark-accent)");

  return (
    <Flex
      flexWrap="wrap"
      gap={2}
      width="100%"
      py={6}
      mb={6}
      borderBottom="1px solid"
      borderColor={borderColor}
    >
      {categories.map((category) => (
        <Link key={category.slug} href={`/category/${category.slug}`}>
          <Box
            px={3}
            py={1}
            fontSize="sm"
            fontWeight="500"
            border="1px solid"
            borderColor={borderColor}
            borderRadius="full"
            transition="all 0.2s"
            _hover={{ borderColor: accentColor, color: accentColor }}
            color={textSecondary}
            style={
              category.slug === "blockchain" || category.slug === "nft"
                ? { textDecoration: "line-through", opacity: 0.4 }
                : {}
            }
          >
            {category.name}
          </Box>
        </Link>
      ))}
    </Flex>
  )
}

export default Categories
