import type { NextPage } from 'next';
import Link from 'next/link';
import Head from 'next/head';
import { getPosts } from '../services';
import { Categories, PostCard } from '../components';
import { Box, Text, Image, Flex, Heading, VStack, HStack, Button, useColorModeValue, Highlight } from '@chakra-ui/react';
import { useSpring, animated, config, to } from 'react-spring';
import { WavingImage }from '../components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronRight, faFaceLaugh } from '@fortawesome/free-solid-svg-icons';


interface Props {
  posts: Array<any>;
}

const AnimatedBox = animated(Box);

const Home: NextPage<Props> = ({posts}) => {
  const bgSub = useColorModeValue("var(--secondary-bg)", "var(--dark-bg-sub)");
  const color = useColorModeValue('var(--primary-text)', 'var(--dark-text)');

  const fadeIn = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 },
    config: config.gentle,
  });

  const slideIn = useSpring({
    from: { transform: 'translate3d(0, 50px, 0)' },
    to: { transform: 'translate3d(0, 0, 0)' },
    config: config.slow,
  });

  const rotate = useSpring({
    from: { x: -22, y: -22, z: - 180 },
    to: { x:  0, y: 0, z: 10 },
    config: {tension: 90, friction: 3},
  })

  const translate = useSpring({
    form: {tx: 2000, ty: 2000, tz: 0},
    to : {tx: 0, ty: 0, tz: 400},
    config: {tension: 20, friction: 1},
  })

  return (
    <Box>
      <Head>
        <title>Rio Miyata's Website</title>
      </Head>
      <Box>
        <AnimatedBox style={slideIn} >
          <Box maxWidth="590px" mx="auto" px={{base: 5, md: 0}} fontSize="17px" letterSpacing="0.03em" lineHeight="1.5">
              <Box boxSize='260px' mx="auto" mb={{base:12, md: 16}}>
                <AnimatedBox style={{
                    transform: to(
                      [rotate.x, rotate.y, rotate.z, translate.tx, translate.ty, translate.tz],
                      (x, y, z, tx, ty, tz) => `rotateX(${x}deg) rotateY(${y}deg) rotateZ(${z}deg) translate3d(${tx}px, ${ty}px, ${tz}px)`
                    ),
                }}>
                  <WavingImage className="inverted-image" src="/assets/images/computer-icon19.png" alt='computer' boxSize="300px" />
                </AnimatedBox>
              </Box>
              <Box>
                  <Flex w="100%" justifyContent="center" alignItems="center"  borderRadius="32px" pt={4} pb={3} fontFamily="Source Code Pro" bg={bgSub} fontWeight="600">
                      <Text textAlign="center" px={{base: 2, md: 0}}>
                        <span className='typing-animation'>Hi, I'm Full Stack Developer based in Japan :D</span>
                      </Text>
                  </Flex>
              </Box>
              <Flex width="100%" justifyContent="center" mt={14} alignItems="center">
                <Box mr="1px">
                  <Text fontSize="4xl" fontWeight="800" mb="-7px" >Rio Miyata</Text>
                  <Text fontSize="lg" fontWeight="500" >Artist-Developer-Designer </Text>
                </Box>
                <Image
                  boxSize='69px'
                  borderRadius='full'
                  src='/assets/images/rio-miyata.jpeg'
                  alt='Rio Miyata'
                  ml="2"
                />
              </Flex>
            <Box marginLeft="8px" mt={14} >
              <VStack align="start" spacing={7} mb={14}>
                <Heading as="h2" fontSize="2xl" fontWeight="800" borderBottom="2px solid #e5e1dc">
                  Experience
                </Heading>
                <VStack align="start" spacing={1.5}>
                  <Flex>
                    <Text mr="9px" fontWeight="medium">2014</Text>
                    <Text>Master of Science in Mechanical Engineering from Hosei University</Text>
                  </Flex>
                  <Flex>
                    <Text mr="9px" fontWeight="medium">2019</Text>
                    <Text>Server Side Engineer Course at Tech Camp</Text>
                  </Flex>
                  <Flex>
                    <Text mr="9px" fontWeight="medium">2020</Text>
                    <Text>AnkhSystems Inc. as an Web Developer</Text>
                  </Flex>
                  <Flex>
                    <Text mr="9px" fontWeight="medium">2022</Text>
                    <Text>Freelance</Text>
                  </Flex>
                </VStack>
              </VStack>
              <VStack align="start" spacing={7} mb={14}>
                  <Heading as="h2" fontSize="2xl" fontWeight="800" borderBottom="2px solid #e5e1dc">
                    <Flex alignItems="center">
                      <Text marginRight="2px">About</Text>
                      <FontAwesomeIcon icon={faFaceLaugh} fontSize="20px"/>
                    </Flex>
                  </Heading>
                <Text>
                  Hi there! I'm a full-stack engineer who enjoys giving form to ideas and expressing them through code. Ever since I was a kid, I've loved building things and believe that technology can dramatically change people's lives. Let's dive into my journey so far as a private developer.
                </Text>
              </VStack>
              <VStack align="start" spacing={7} mb={8}>
                <Heading as="h2" fontSize="2xl" fontWeight="800" borderBottom="2px solid #e5e1dc">
                  Creations
                </Heading>
                <Box color={color}>
                  <Flex justifyContent="space-between" width="100%" height="100%">
                    <Box w="280px">
                      <Link href="https://merkletree-dapp.web.app" target="_blank" rel="noopener noreferrer">
                        <Image src="/assets/images/nft-mint-dapp.png" alt="Image 1" borderRadius="15px" boxShadow="1px 2px 28px rgb(35, 31, 24, 0.05)"/>
                      </Link>
                    </Box>
                  </Flex>
                </Box>
              </VStack>
              <Flex justifyContent="center" mb={14}>
                <Link href="/work">
                    <Box backgroundColor="var(--secondary-button)" color="var(--secondary-text)" _hover={{bg: "var(--secondary-button-hover)"}} py={1.5} px={3}  fontWeight="600" borderRadius="4px">
                    <Flex alignItems="center">
                      <Text>Creations</Text>
                    </Flex>
                    </Box>
                </Link>
              </Flex>
              <VStack align="start" spacing={7}>
                <Heading as="h2" fontSize="2xl" fontWeight="800" borderBottom="2px solid #e5e1dc">
                  Posts
                </Heading>
                  <VStack align="start">
                      {posts.map((post, index) => (<PostCard post={post.node} key={index} />))}
                  </VStack>
              </VStack>
              <Flex justifyContent="center" mb={14}>
                <Link href="/post">
                  <Box backgroundColor="var(--primary-button)" color="var(--secondary-text)" _hover={{bg: "var(--primary-button-hover)"}} py={1.5} px={3} fontWeight="600" borderRadius="4px">
                    <Flex alignItems="center">
                      <Text>Posts</Text>
                    </Flex>
                  </Box>
                </Link>
              </Flex>
            </Box>
          </Box>
        </AnimatedBox>
      </Box>
    </Box>
  )
}

export async function getStaticProps() {
  const posts = (await getPosts()) || [];

  return {
    props: { posts }
  }
}

export default Home;