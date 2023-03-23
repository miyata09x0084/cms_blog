import type { NextPage } from 'next';
import Link from 'next/link';
import Head from 'next/head';
import { Box, Text, Image, Flex, Heading, VStack, Button } from '@chakra-ui/react';
import { useTheme } from 'styled-components';
import { useSpring, animated, config, to } from 'react-spring';
import { WavingImage }from '../components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { solid, regular, brands, icon } from '@fortawesome/fontawesome-svg-core/import.macro';


interface Props {
  posts: Array<any>;
}

const AnimatedBox = animated(Box);
const AnimatedText = animated(Text);
const AnimatedImage = animated(Image);

const Home: NextPage<Props> = () => {
  const theme = useTheme();

  const fadeIn = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 },
    config: config.slow,
  });

  const slideIn = useSpring({
    from: { transform: 'translate3d(0, 60px, 0)' },
    to: { transform: 'translate3d(0, 0, 0)' },
    config: config.slow,
  });

  const rotate = useSpring({
    from: { x: -22, y: -22, z: - 17 },
    to: { x:  0, y: 0, z: 8 },
    config: config.molasses,
  })

  const translate = useSpring({
    form: {tx: 0, ty: 0, tz: 0},
    to : {tx: 22, ty: 22, tz: 22},
    config: config.molasses,
  })

  return (
    <Box>
      <Head>
        <title>Rio Miyata's Website</title>
      </Head>
      {/* ChakraUi */}
      <AnimatedBox style={fadeIn} color="var(--primary-text)">
        <AnimatedBox maxWidth="600px" mx="auto" px={{base: 8, md: 0}} style={slideIn}>
            <Box boxSize='300px' mx="auto" mt="40px" mb="30px">
              <AnimatedBox style={{
                  transform: to(
                    [rotate.x, rotate.y, rotate.z, translate.tx, translate.ty, translate.tz],
                    (x, y, z, tx, ty, tz) => `rotateX(${x}deg) rotateY(${y}deg) rotateZ(${z}deg) translate3d(${tx}px, ${ty}px, ${tz}px)`
                  ),
                  marginLeft: "- 18px"
              }}>
                <WavingImage className="inverted-image" src="/assets/images/computer-icon6.png" alt='computer' boxSize="250px" intensity={0.1} />
              </AnimatedBox>
              {/* <div className="triangle"></div> */}
            </Box>
            <Box>
                <Flex w="100%" justifyContent="center" alignItems="center"  fontFamily="Source Code Pro" borderRadius="20px" padding=" 20px 30px" fontWeight="bold" bg="var(--secondary-bg)">
                    <Text mr="4px">Welcome, I'm Web Developer / Blockchain Enthusiast</Text>
                  <FontAwesomeIcon icon={icon({name: 'hand', style: 'solid'})} width="14px" className="rotate-image"/>
                </Flex>
            </Box>
            <Flex width="100%" justifyContent="center" marginTop="20px" alignItems="center">
              <Text fontSize="3xl" fontWeight="bold" marginRight="12px" marginLeft="15px">Rio Miyata</Text>
              <Image
                boxSize='70px'
                borderRadius='full'
                border="1px solid #fff"
                src='https://avatars.githubusercontent.com/u/59190800?s=400&u=ea17e57c3dc9ef662b1f5ce525b8ebaf777e9713&v=4'
                alt='Rio Miyata'
              />
            </Flex>
          <Box marginLeft="8px" marginTop="40px" >
            <VStack align="start" spacing={3}>
              <Heading as="h2" size="md">
                Experience
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
            <VStack align="start" spacing={3} marginTop="25px">
              <Heading as="h2" size="md">
                About me
              </Heading>
              <Text>
                Hey there! I'm a full-stack engineer who loves bringing ideas to life through code. Ever since I was a kid, I've enjoyed building things, and that passion has only grown with time. Let's dive into my journey so far!
              </Text>
            </VStack>
            <VStack align="start" spacing={3} marginTop="25px">
              <Heading as="h2" size="md" marginTop="10px">
                Interests
              </Heading>
              <Text>
                When I'm not coding, you can find me exploring the outdoors, trying out new recipes, and playing board games with friends. I'm always eager to learn new things and connect with like-minded people!
              </Text>
            </VStack>
            <Flex justifyContent="center" marginTop="20px">
              <Link href="/post">
                <Button backgroundColor="var(--primary-button)" color="var(--secondary-text)" pl="22px" pr="22px" _hover={{bg: "var(--primary-button-hover)"}}>
                  <Text mr="8px">Post</Text>
                  {/* <FontAwesomeIcon icon={faRightLong} width="18px"/> */}
                </Button>
              </Link>
            </Flex>
            <VStack align="start" marginBottom="16px">
              <Heading as="h2" size="md" marginTop="10px">
                Work
              </Heading>
            </VStack>
            <Flex flexWrap="wrap" justifyContent="space-around">
                <Image  src="/assets/images/computer-icon3.png" boxSize="250px" borderRadius="54px"/>
                <Image  src="/assets/images/computer-icon5.png" boxSize="250px" borderRadius="54px"/>
            </Flex>
          </Box>
          <Flex justifyContent="center">
            <Link href="/work">
              <Button backgroundColor="var(--secondary-button)" color="var(--secondary-text)" mt="18px" pl="22px" pr="22px" _hover={{bg: "var(--secondary-button-hover)"}}>
                <Text mr="8px">Portfolio</Text>
                {/* <FontAwesomeIcon icon={faRightLong} width="18px"/> */}
              </Button>
            </Link>
          </Flex>
        </AnimatedBox>
      </AnimatedBox>
    </Box>
  )
}

export default Home;