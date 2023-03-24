import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getCategories } from '../services';
import { Box, Flex, useColorMode, useColorModeValue } from '@chakra-ui/react';

const Categories = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    getCategories()
      .then((newCategories) => setCategories(newCategories))
  }, [])

  const { colorMode } = useColorMode();
  const bg = useColorModeValue("var(--primary-bg)", "var(--dark-bg)");
  const color = useColorModeValue("var(--primary-text)", "var(--dark-text)");
  const colorSub = useColorModeValue("var(--secondary-text)", "var(--dark-bg)");

  return (
    <Flex justifyContent="center" alignItems="center" width="100%" mt="40px" py="40px" borderTop="1px solid lightgray" borderBottom="1px solid lightgray" mb="30px" color={color}>
      {categories.map((category) => (
        <Box key={category.slug} mx="10px">
          <Link href={`/category/${category.slug}`} >
              {category.name}
          </Link>
        </Box>
      ))}
    </Flex>
  )
}

export default Categories