import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getCategories } from '../services';
import { Box, Flex, HStack } from '@chakra-ui/react';

const Categories = () => {
  const [categories, setCategories] = useState([]);


  useEffect(() => {
    getCategories()
      .then((newCategories) => setCategories(newCategories))
  }, [])

  return (
    <Flex justifyContent="center" alignItems="center" width="100%" py="40px" borderTop="1px solid lightgray" borderBottom="1px solid lightgray" mb="30px">
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