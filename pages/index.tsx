import type { NextPage } from 'next';
import Link from 'next/link';
import Head from 'next/head';
import { getPosts } from '../services';
import { PostCard, TypingAnimation } from '../components';
import { Box, Text, Image, Flex, Heading, VStack, HStack, useColorModeValue, Button, Progress } from '@chakra-ui/react';
import { useSpring, animated, config, to } from 'react-spring';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHandPeace, faCaretRight, faFaceLaughBeam } from '@fortawesome/free-solid-svg-icons'
import { useEffect } from 'react';


interface Props {
  posts: Array<any>;
}

const AnimatedBox = animated(Box);

function usePreloadImage(src: string) {
  useEffect(() => {
    const img = new window.Image();
    img.src = src;
  }, [src]);
}


const Home: NextPage<Props> = ({posts}) => {
  // const bgSub = useColorModeValue("var(--secondary-bg)", "var(--dark-bg-sub)");
  // const color = useColorModeValue('var(--primary-text)', 'var(--dark-text)');
  // const colorSub = useColorModeValue('var(--secondary-text)', 'var(--dark-text)');
  usePreloadImage("/assets/images/typing-image.png");
  usePreloadImage("/assets/images/self-image.png");

  const fadeIn = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 },
    config: config.slow,
  });


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
                  borderRadius="4px"
                  height={{ base: '240px', md: '310px' }}  // ここで高さを設定。スマホでは自動、デスクトップでは300pxに設定。必要に応じて調整
                  />
              <TypingAnimation />
              <AnimatedBox style={fadeIn}>
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
                    transform="scaleX(-1) rotate(4deg)"
                    alt='Rio Miyata'
                  />
              </Flex>
                <Box marginLeft="8px" mt={14} >
                  <VStack align="start" spacing={5} mb={12}>
                    <Heading as="h2" fontSize="2xl" fontWeight="900">
                      /Bio
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
                        <HStack alignItems="center">
                          <Text>/About</Text>
                          <FontAwesomeIcon icon={faFaceLaughBeam} />
                        </HStack>
                      </Heading>
                    <Text>
                      I am the younger twin brother. I love using programming to manifest my diverse ideas into real-world applications. It's my passion to express these concepts through the creation of apps. Recently, I've been immersed in the world of web3, and I'm eager to play a role in its mass adoption.
                    </Text>
                  </VStack>
                  <VStack align="start" spacing={5} mb={8}>
                    <Heading as="h2" fontSize="2xl" fontWeight="900">
                      /Creations
                    </Heading>
                    <Box >
                      <Flex justifyContent="space-between" width="100%" height="100%">
                        <Box w="280px">
                          <Link href="https://kangeki-dapps.web.app/" target="_blank" rel="noopener noreferrer">
                            <Image
                              src="/assets/images/dev-image1.png"
                              alt="Image 1"
                              borderRadius="15px"
                              boxShadow="1px 2px 12px rgb(35, 31, 24, 0.1)"
                              loading="lazy"
                            />
                          </Link>
                        </Box>
                      </Flex>
                    </Box>
                  </VStack>
                  <Flex justifyContent="center" mb={12}>
                    <Link href="/work">
                        <Button
                          p={5}
                          fontWeight="600"
                          borderRadius="25px"
                          bg="#8505b0"
                          color="#EDDFD6"
                          boxShadow="2px 2px 10px rgb(133, 5, 176, 0.3)"
                          _hover={{ opacity: 0.8 }}
                        >
                          <Flex alignItems="center">
                            <Text>Creations</Text>
                          </Flex>
                        </Button>
                    </Link>
                  </Flex>
                  <VStack align="start" spacing={5}>
                    <Heading as="h2" fontSize="2xl" fontWeight="900">
                      /Posts
                    </Heading>
                      <VStack align="start">
                          {posts.map((post, index) => (<PostCard post={post.node} key={index} />))}
                      </VStack>
                  </VStack>
                  <Flex justifyContent="center" mb={12}>
                    <Link href="/post">
                      <Button
                          p={5}
                          fontWeight="600"
                          borderRadius="25px"
                          bg="#0530b0"
                          color="#EDDFD6"
                          boxShadow="2px 2px 10px rgb(5, 48, 176, 0.3)"
                          _hover={{ opacity: 0.8 }}
                        >
                        <Flex alignItems="center">
                          <Text>Posts</Text>
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