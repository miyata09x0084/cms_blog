import type { NextPage } from 'next';
import Link from 'next/link';
import Head from 'next/head';
import { getPosts } from '../services';
import { PostCard } from '../components';
import { Box, Text, Image, Flex, Heading, VStack, useColorModeValue } from '@chakra-ui/react';
import { useSpring, animated, config, to } from 'react-spring';
import { WavingImage }from '../components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFaceLaugh } from '@fortawesome/free-solid-svg-icons';


interface Props {
  posts: Array<any>;
}

const AnimatedBox = animated(Box);

const Home: NextPage<Props> = ({posts}) => {
  const bgSub = useColorModeValue("var(--secondary-bg)", "var(--dark-bg-sub)");
  const color = useColorModeValue('var(--primary-text)', 'var(--dark-text)');

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
          <Box maxWidth="590px" mx="auto" px={{base: 5, md: 0}} fontSize="17px" letterSpacing="0.01em" lineHeight="1.5">
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
                  <Flex w="100%" justifyContent="center" alignItems="center"  borderRadius="15px" pt={3} pb={2} fontFamily="Source Code Pro" bg={bgSub}>
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
              <VStack align="start" spacing={6} mb={12}>
                <Heading as="h2" fontSize="2xl" fontWeight="800" borderBottom="2px solid #e5e1dc">
                  Experience
                </Heading>
                <VStack align="start" spacing={1}>
                  <Flex>
                    <Text mr="10px" fontWeight="900">1989</Text>
                      <Box>
                        <Text>I was born in Aich</Text>
                        <Text>愛知生まれ</Text>
                      </Box>
                  </Flex>
                  <Flex>
                    <Text mr="10px" fontWeight="900">2014</Text>
                    <Box>
                      <Text>Master of Science in Mechanical Engineering from Hosei University</Text>
                      <Text>法政大学 理工学研究科 修士課程</Text>
                    </Box>
                  </Flex>
                  <Flex>
                    <Text mr="10px" fontWeight="900">2019</Text>
                    <Box>
                      <Text>Server Side Engineer Course at Tech Camp</Text>
                      <Text>サーバーサイドエンジニアを学ぶ</Text>
                    </Box>
                  </Flex>
                  <Flex>
                    <Text mr="10px" fontWeight="900">2020</Text>
                    <Box>
                      <Text>AnkhSystems Inc. as an Web Developer</Text>
                      <Text>アンクシステムズでWebデベロッパー</Text>
                    </Box>
                  </Flex>
                  <Flex>
                    <Text mr="10px" fontWeight="900">2023</Text>
                    <Box>
                      <Text>Indie Developer</Text>
                      <Text>個人開発</Text>
                    </Box>
                  </Flex>
                </VStack>
              </VStack>
              <VStack align="start" spacing={6} mb={12}>
                  <Heading as="h2" fontSize="2xl" fontWeight="800" borderBottom="2px solid #e5e1dc">
                    <Flex alignItems="center">
                      <Text marginRight="2px">About</Text>
                      <FontAwesomeIcon icon={faFaceLaugh} fontSize="20px"/>
                    </Flex>
                  </Heading>
                <Text>
                  I'm a Full Stack Developer based in Japan.
                </Text>
              </VStack>
              <VStack align="start" spacing={6} mb={8}>
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
              <Flex justifyContent="center" mb={12}>
                <Link href="/work">
                    <Box backgroundColor="var(--secondary-button)" color="var(--secondary-text)" _hover={{bg: "var(--secondary-button-hover)"}} py={1.5} px={3}  fontWeight="600" borderRadius="4px">
                    <Flex alignItems="center">
                      <Text>Creations</Text>
                    </Flex>
                    </Box>
                </Link>
              </Flex>
              <VStack align="start" spacing={6}>
                <Heading as="h2" fontSize="2xl" fontWeight="800" borderBottom="2px solid #e5e1dc">
                  Posts
                </Heading>
                  <VStack align="start">
                      {posts.map((post, index) => (<PostCard post={post.node} key={index} />))}
                  </VStack>
              </VStack>
              <Flex justifyContent="center" mb={12}>
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