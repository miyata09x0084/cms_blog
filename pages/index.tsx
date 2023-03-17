import type { NextPage } from 'next'
import Head from 'next/head'
import { Box, Text, Image, Flex, Heading, VStack, HStack, Button } from '@chakra-ui/react'

interface Props {
  posts: Array<any>;
}

const Home: NextPage<Props> = () => {

  return (
    <div className="mx-auto max-w-screen-md @screen px-8 md:px-0 mb-8 font-MplusRounded font-mycolor">
      <Head>
        <title>Rio Miyata's Website</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=M+PLUS+Rounded+1c:wght@100;300;400;500;700;800;900&family=Source+Code+Pro:ital,wght@0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet" />
      </Head>
      {/* ChakraUi */}
      <Box width="570px" mx="auto">
        <Box boxSize='300px' mx="auto" marginBottom="30px" >
          <Image src='/assets/images/computer-icon2.png' alt='computer' borderRadius="20px" opacity='0.9' />
        </Box>
        <Box display="flex" justifyContent="center" flex="1">
          <Text fontFamily="Source Code Pro" backgroundColor="white" borderRadius="20px" padding=" 20px 30px" fontWeight="bold">Welcome,I'm Web Developer/Blockchain Enthusiast👋</Text>
        </Box>
        <Flex width="100%" justifyContent="center" marginTop="20px" alignItems="center">
          <Text fontSize="3xl" fontWeight="bold" marginRight="20px" marginLeft="15px">Rio Miyata</Text>
          <Image
            boxSize='70px'
            borderRadius='full'
            src='https://avatars.githubusercontent.com/u/59190800?s=400&u=ea17e57c3dc9ef662b1f5ce525b8ebaf777e9713&v=4'
            alt='Rio Miyata'
          />
        </Flex>
        <Box marginLeft="8px" marginTop="40px" fontFamily="M PLUS Rounded 1c">
          <VStack align="start" spacing={2}>
            <Heading as="h2" size="md" fontFamily="M PLUS Rounded 1c">
              History
            </Heading>
            <VStack align="start" spacing={1}>
              <Text>
                2014 Master of Science in Engineering from Hosei University
              </Text>
              <Text>
                2019 Server Side Engineer Course at Tech Camp
              </Text>
              <Text>
                2020 AnkhSystems Inc. as an Web Developer
              </Text>
              <Text>
                2022 Freelance
              </Text>
            </VStack>
          </VStack>
          <VStack align="start" spacing={2} marginTop="25px">
            <Heading as="h2" size="md" marginTop="10px" fontFamily="M PLUS Rounded 1c">
              Readme
            </Heading>
            <Text>I am a full stack engineer. I like to build things since I was a little kid.I am a full stack engineer. I like to build things since I was a little kid.I am a full stack engineer. I like to build things since I was a little kid.I am a full stack engineer. I like to build things since I was a little kid.I am a full stack engineer. I like to build things since I was a little kid.</Text>
          </VStack>
          <Flex justifyContent="center">
            <Button backgroundColor="#F4B942" color="#ffffff">Portfolio</Button>
          </Flex>
          <Heading as="h2" size="md" marginTop="10px" fontFamily="M PLUS Rounded 1c">
            Works
          </Heading>
        </Box>
        <Flex justifyContent="center">
          <Button backgroundColor="#67C46A" color="#ffffff">Portfolio</Button>
        </Flex>
      </Box>
    </div>
  )
}

export default Home;