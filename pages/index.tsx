import type { NextPage } from 'next';
import Link from 'next/link';
import Head from 'next/head';
import { getPosts } from '../services';
import { PostCard, TypingAnimation } from '../components';
import { Box, Text, Image, Flex, Heading, VStack, useColorModeValue, Button, Progress } from '@chakra-ui/react';
import { useSpring, animated, config, to } from 'react-spring';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHandPeace, faCaretRight, faFaceLaughBeam } from '@fortawesome/free-solid-svg-icons'


interface Props {
  posts: Array<any>;
}

const AnimatedBox = animated(Box);

const Home: NextPage<Props> = ({posts}) => {
  // const bgSub = useColorModeValue("var(--secondary-bg)", "var(--dark-bg-sub)");
  // const color = useColorModeValue('var(--primary-text)', 'var(--dark-text)');
  // const colorSub = useColorModeValue('var(--secondary-text)', 'var(--dark-text)');

  const fadeIn = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 },
    config: config.gentle,
  });

  const slideIn = useSpring({
    from: { transform: 'translate3d(0, 15px, 0)' },
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
            <Box maxWidth="580px" mx="auto" px={{base: 5, md: 0}} fontSize="17px" letterSpacing="0.03em" lineHeight="1.5">
              <Image
                  src="/assets/images/typing-image.png"
                  alt='keyboard'
                  width="100%"
                  height={{ base: '240px', md: '350px' }}  // ここで高さを設定。スマホでは自動、デスクトップでは300pxに設定。必要に応じて調整
                  />
              <TypingAnimation />
              <AnimatedBox style={slideIn}>
                <Flex width="100%" justifyContent="center" mt={14} alignItems="center">
                  <Box mr="1px">
                    <Text fontSize="4xl" fontWeight="800" >Rio Miyata</Text>
                    <Text fontSize="lg" fontWeight="500" >Developer | Artist </Text>
                  </Box>
                    <Image
                      src='/assets/images/self-image.jpg'
                      boxSize='72px'
                      borderRadius='full'
                      ml="2"
                      border="1px solid #664D03"
                      transform="scaleX(-1) rotate(-8deg)"
                      alt='Rio Miyata'
                    />
                </Flex>
                <Box marginLeft="8px" mt={14} >
                  <VStack align="start" spacing={5} mb={12}>
                    <Heading as="h2" fontSize="2xl" fontWeight="900">
                      / Bio
                    </Heading>
                    <VStack align="start" spacing={1.5}>
                      <Flex>
                        <Text mr="10px" fontWeight="900">1989</Text>
                          <Box>
                            <Text>Born in Aichi, Japan </Text>
                            <Text>日本の愛知県出身</Text>
                          </Box>
                      </Flex>
                      <Flex>
                        <Text mr="10px" fontWeight="900">2014</Text>
                        <Box>
                          <Text>Master's Degree, Graduate School of Science and Engineering @Hosei University</Text>
                          <Text>法政大学理工学研究科 修士課程修了</Text>
                        </Box>
                      </Flex>
                      <Flex>
                        <Text mr="10px" fontWeight="900">2019</Text>
                        <Box>
                          <Text>Full Stack Engineering Course @Tech Camp</Text>
                          <Text>フルスタックエンジニアコース修了</Text>
                        </Box>
                      </Flex>
                      <Flex>
                        <Text mr="10px" fontWeight="900">2020</Text>
                        <Box>
                          <Text>Web Developer @AnkhSystems(Digital Media)</Text>
                          <Text>アンクシステムズ-デジタルメディア開発</Text>
                        </Box>
                      </Flex>
                      <Flex>
                        <Text mr="10px" fontWeight="900">2023</Text>
                        <Box>
                          <Text>Indie Developer & Freelance Web Developer</Text>
                          <Text>個人開発者</Text>
                        </Box>
                      </Flex>
                    </VStack>
                  </VStack>
                  <VStack align="start" spacing={5} mb={12}>
                      <Heading as="h2" fontSize="2xl" fontWeight="900">
                        <Flex alignItems="center">
                          <Text marginRight="4px">/ About</Text>
                          <FontAwesomeIcon icon={faFaceLaughBeam} />
                        </Flex>
                      </Heading>
                    <Text>
                      I am the younger twin brother. I love using programming to manifest my diverse ideas into real-world applications. It's my passion to express these concepts through the creation of apps. Recently, I've been immersed in the world of web3, and I'm eager to play a role in its mass adoption.
                    </Text>
                  </VStack>
                  <VStack align="start" spacing={5} mb={8}>
                    <Heading as="h2" fontSize="2xl" fontWeight="900">
                      / Creations
                    </Heading>
                    <Box >
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
                        <Button p={4}  fontWeight="600" borderRadius="4px" bg="#049872" color="#EDDFD6">
                        <Flex alignItems="center">
                          <Text mr={2}>Creations</Text>
                          <FontAwesomeIcon icon={faCaretRight} />
                        </Flex>
                        </Button>
                    </Link>
                  </Flex>
                  <VStack align="start" spacing={5}>
                    <Heading as="h2" fontSize="2xl" fontWeight="900">
                      / Posts
                    </Heading>
                      <VStack align="start">
                          {posts.map((post, index) => (<PostCard post={post.node} key={index} />))}
                      </VStack>
                  </VStack>
                  <Flex justifyContent="center" mb={12}>
                    <Link href="/post">
                      <Button   p={4} fontWeight="600" borderRadius="4px" bg="#8505b0" color="#EDDFD6">
                        <Flex alignItems="center">
                          <Text mr={2}>Posts</Text>
                          <FontAwesomeIcon icon={faCaretRight} />
                        </Flex>
                      </Button>
                    </Link>
                  </Flex>
                </Box>
              </AnimatedBox>
            </Box>
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