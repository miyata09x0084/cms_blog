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

  return (
    <Flex
      justifyContent="center"
      alignItems="center"
      width="100%"
      mt="40px"
      py="40px"
      mb="30px"
      borderTop="1px solid"
      borderBottom="1px solid"
      borderColor={borderColor}
      flexWrap="wrap"
    >
      {categories.map((category) => (
        <Box
          key={category.slug}
          mx="10px"
          style={
            category.slug === "blockchain" || category.slug === "nft"
              ? { textDecoration: "line-through", opacity: 0.6 }
              : {}
          }
        >
          <Link href={`/category/${category.slug}`}>
            {category.name}
          </Link>
        </Box>
      ))}
    </Flex>
  )
}

export default Categories
