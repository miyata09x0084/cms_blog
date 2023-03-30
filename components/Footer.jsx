import React, { useState } from 'react'
import { Box, Flex, Text, HStack, Image } from '@chakra-ui/react'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTwitter, faGithub } from '@fortawesome/free-brands-svg-icons'

const Footer = () => {
  const [isIconHover, setIsIconHover] = useState(false)

  return (
    <footer>
      <Box w="100vw" pt={10} pb={16}>
        <Box maxWidth="600px" fontSize="xl" px={{base: 8, md: 0}}  mx="auto">
            <Flex justifyContent="space-between" alignItems="center">
                <HStack mx={1} spacing={6} display="flex" alignItems="center">
                    <Link href="https://github.com/miyata09x0084">
                        <Flex alignItems="center">
                            <FontAwesomeIcon icon={faGithub}/>
                            <Text ml={0.5}>Github</Text>
                        </Flex>
                    </Link>
                    <Link href="/">
                        <Flex alignItems="center">
                            <Image src="/assets/images/etherscan-logo-circle.png" alt="github-icon" w="19px" h="19px" mr={0.5}/>
                            <Text>Etherscan</Text>
                        </Flex>
                    </Link>
                </HStack>
                <Link href="/">
                    <Flex
                        alignItems="center"
                        onMouseEnter={() => setIsIconHover(true)}
                        onMouseLeave={() => setIsIconHover(false)}
                    >
                        {isIconHover ? (<FontAwesomeIcon icon={faTwitter} bounce/> )
                        : (<FontAwesomeIcon icon={faTwitter}/>)}
                        <Text ml={0.5} mr={1}>Follow</Text>
                    </Flex>
                </Link>
            </Flex>
        </Box>
      </Box>
    </footer>
  )
}

export default Footer