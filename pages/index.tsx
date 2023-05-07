import type { NextPage } from 'next';
import Link from 'next/link';
import Head from 'next/head';
import { Box, Text, Image, Flex, Heading, VStack, HStack, Button, useColorModeValue } from '@chakra-ui/react';
import { useSpring, animated, config, to } from 'react-spring';
import { WavingImage }from '../components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronRight, faAngleRight } from '@fortawesome/free-solid-svg-icons';


interface Props {
  posts: Array<any>;
}

const AnimatedBox = animated(Box);

const Home: NextPage<Props> = () => {
  const bgSub = useColorModeValue("var(--secondary-bg)", "var(--dark-bg-sub)");
  const textSub = useColorModeValue("var(--third-text)", "var(--dark-text-sub)");

  const fadeIn = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 },
    config: config.gentle,
  });

  const slideIn = useSpring({
    from: { transform: 'translate3d(0, 40px, 0)' },
    to: { transform: 'translate3d(0, 0, 0)' },
    config: config.gentle,
  });

  const rotate = useSpring({
    from: { x: -22, y: -22, z: - 180 },
    to: { x:  0, y: 0, z: 8 },
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
          <Box maxWidth="600px" mx="auto" px={{base: 8, md: 0}} fontSize="17px">
              <Box boxSize='300px' mx="auto" pt="40px" mb="40px">
                <AnimatedBox style={{
                    transform: to(
                      [rotate.x, rotate.y, rotate.z, translate.tx, translate.ty, translate.tz],
                      (x, y, z, tx, ty, tz) => `rotateX(${x}deg) rotateY(${y}deg) rotateZ(${z}deg) translate3d(${tx}px, ${ty}px, ${tz}px)`
                    ),
                    marginLeft: "- 18px"
                }}>
                  <WavingImage className="inverted-image" src="/assets/images/computer-icon8.png" alt='computer' boxSize="250px" intensity={0.1} />
                </AnimatedBox>
              </Box>
              <Box>
                  <Flex w="100%" justifyContent="center" alignItems="center"  borderRadius="25px" padding=" 20px 30px" fontFamily="Source Code Pro" fontWeight="bold" bg={bgSub}>
                      <Text textAlign="center" mr="9px">
                        Hello, I'm Software Developer based in Japan.
                      </Text>
                  </Flex>
              </Box>
              <Flex width="100%" justifyContent="center" mt={12} alignItems="center">
                <Box mr="2px">
                  <Text fontSize="4xl" fontWeight="800" mb="-5px">Rio Miyata</Text>
                  <Text >Developer / Artist / Designer </Text>
                </Box>
                <Image
                  boxSize='69px'
                  borderRadius='full'
                  src='https://avatars.githubusercontent.com/u/59190800?s=400&u=ea17e57c3dc9ef662b1f5ce525b8ebaf777e9713&v=4'
                  alt='Rio Miyata'
                  ml="2"
                />
              </Flex>
            <Box marginLeft="8px" mt={12} >
              <VStack align="start" spacing={4}>
                <Heading as="h2" size="md" fontWeight="800">
                  / works
                </Heading>
                <Text>
                 Hi there! I'm a full-stack engineer who enjoys giving form to ideas and expressing them through code. Ever since I was a kid, I've loved building things and believe that technology can dramatically change people's lives. Let's dive into my journey so far as a private developer.
                </Text>
              </VStack>
              <Flex justifyContent="center" mt={4} mb={8}>
                <Link href="/work">
                  <Button backgroundColor="var(--secondary-button)" color="var(--secondary-text)" px={8} _hover={{bg: "var(--secondary-button-hover)"}}>
                    <Text mr={2}>Works</Text>
                    <FontAwesomeIcon icon={faAngleRight} width="7px" height="7px"/>
                  </Button>
                </Link>
              </Flex>
              <VStack align="start" spacing={4} mb={8}>
                <Heading as="h2" size="md" fontWeight="800">
                  / experience
                </Heading>
                <VStack align="start" spacing={2}>
                  <Flex>
                    <Text mr="9px" fontWeight="medium">2014</Text>
                    <Text>Master of Science in Engineering from Hosei University</Text>
                  </Flex>
                  <Flex>
                    <Text mr="9px" fontWeight="medium">2019</Text>
                    <Text>Server Side Engineer Course at Tech Camp</Text>
                  </Flex>
                  <Flex>
                    <Text mr="9px" fontWeight="medium">2020</Text>
                    <Text>Joined AnkhSystems Inc. as an Web Developer</Text>
                  </Flex>
                  <Flex>
                    <Text mr="9px" fontWeight="medium">2022</Text>
                    <Text>Freelance</Text>
                  </Flex>
                </VStack>
              </VStack>
              <VStack align="start" spacing={4}>
                <Heading as="h2" size="md" fontWeight="800">
                  / interests
                </Heading>
                <Text>
                  When I'm not coding, you can find me exploring the outdoors, trying out new recipes, and playing board games with friends. I'm always eager to learn new things and connect with like-minded people.
                </Text>
              </VStack>
              <Flex justifyContent="center" mt={4} mb={10}>
                <Link href="/post">
                  <Button backgroundColor="var(--primary-button)" color="var(--secondary-text)" px={8} _hover={{bg: "var(--primary-button-hover)"}}>
                    <Text mr={2}>Posts</Text>
                    <FontAwesomeIcon icon={faAngleRight} width="7px" height="7px"/>
                  </Button>
                </Link>
              </Flex>
            </Box>
          </Box>
        </AnimatedBox>
      </Box>
    </Box>
  )
}

export default Home;