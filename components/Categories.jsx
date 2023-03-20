import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getCategories } from '../services';
import { Box, Flex } from '@chakra-ui/react';

const Categories = () => {
  const [categories, setCategories] = useState([]);


  useEffect(() => {
    getCategories()
      .then((newCategories) => setCategories(newCategories))
  }, [])
  return (
    <Flex justifyContent="center">
      {categories.map((category) => (
        <Box key={category.slug} color="var(--primary-text)" mx="10px">
          <Link href={`/category/${category.slug}`} >
              {category.name}
          </Link>
        </Box>
      ))}
    </Flex>
  )
}

export default Categories