import React, { useState } from 'react'
import { Box, Flex, Text, HStack, Image, useColorModeValue } from '@chakra-ui/react'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTwitter, faGithub } from '@fortawesome/free-brands-svg-icons'

const Footer = () => {
  const [isIconHover, setIsIconHover] = useState(false)
  const color = useColorModeValue('var(--tertiary-text)', 'var(--dark-text)');

  return (
    <footer>
      <Box w="100vw" h="100%" pt={16} pb={8}>
        <Box maxWidth="768px" fontSize="xl" px={{base: 4, md: 0}}  mx="auto">
            <Flex justifyContent="space-between" alignItems="center">
                <HStack mx={1} spacing={6} display="flex" alignItems="center">
                    <Link href="https://github.com/miyata09x0084" target="_blank" rel="noopener noreferrer">
                        <Flex alignItems="center">
                            <FontAwesomeIcon icon={faGithub} width={20} height={20}/>
                            <Text ml={1}>Github</Text>
                        </Flex>
                    </Link>
                    <Link href="https://etherscan.io/address/0x906b1f02B8BBCA762896d368e40C77c857Db6A0B" target="_blank" rel="noopener noreferrer">
                        <Flex alignItems="center">
                            <Image src="/assets/images/etherscan-logo-circle.png" alt="github-icon" w="19px" h="19px" mr={1}/>
                            <Text>Etherscan</Text>
                        </Flex>
                    </Link>
                </HStack>
                <Link href="https://twitter.com/riomiyatta?ref_src=twsrc%5Etfw" data-size="large" data-show-screen-name="false" data-show-count="false">
                <script async src="https://platform.twitter.com/widgets.js" charSet="utf-8"></script>
                    <Flex
                        alignItems="center"
                        onMouseEnter={() => setIsIconHover(true)}
                        onMouseLeave={() => setIsIconHover(false)}
                    >
                        {isIconHover ? (<FontAwesomeIcon icon={faTwitter} bounce/> )
                        : (<FontAwesomeIcon icon={faTwitter} width={20} height={20} mr={1}/>) }
                        <Text ml={0.5}>Follow</Text>
                    </Flex>
                </Link>
            </Flex>
        </Box>
      </Box>
      <Box fontSize="sm" px={{base: 4, md: 0}} mx="auto" mb={6} textAlign="center" color="gray.700">
        <Text>Built and designed by Rio Miyata.</Text>
        <Text>All rights reserved. ©</Text>
      </Box>
    </footer>
  )
}

export default Footer