import type { NextPage } from "next";
import Link from "next/link";
import Head from "next/head";
import Image from "next/image";
import { getPosts } from "../services";
import { PostCard, TypingAnimation } from "../components";
import {
  Box,
  Text,
  Flex,
  Heading,
  VStack,
  HStack,
  useColorModeValue,
  Button,
} from "@chakra-ui/react";
import { useSpring, animated, config, to } from "react-spring";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCaretRight,
  faFaceLaughBeam,
} from "@fortawesome/free-solid-svg-icons";

interface Props {
  posts: Array<any>;
}

const AnimatedBox = animated(Box);

const Home: NextPage<Props> = ({ posts }) => {
  // const bgSub = useColorModeValue("var(--secondary-bg)", "var(--dark-bg-sub)");
  // const color = useColorModeValue('var(--primary-text)', 'var(--dark-text)');
  // const colorSub = useColorModeValue('var(--secondary-text)', 'var(--dark-text)');

  const fadeIn = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 },
    config: config.molasses,
  });

  const slideIn = useSpring({
    from: { transform: "translate3d(0, 500px, 0)" },
    to: { transform: "translate3d(0, 0, 0)" },
    config: config.wobbly,
  });

  return (
    <Box>
      <Head>
        <title>Rio Miyata's Website</title>
      </Head>
      <Box>
        <Box
          maxWidth="768px"
          mx="auto"
          px={{ base: 4, md: 0 }}
          fontSize="17px"
          letterSpacing="0.06em"
          lineHeight="1.5"
        >
          <Flex justifyContent="center" width="100%">
            <Image
              src="/assets/images/typing-image.png"
              alt="keyboard"
              width={550}
              height={510}
              priority={true}
              loading="eager"
            />
          </Flex>
          <TypingAnimation />
          <Flex
            width="100%"
            justifyContent="center"
            mt={14}
            alignItems="center"
          >
            <Box>
              <Text fontSize="4xl" fontWeight="800">
                Rio Miyata
              </Text>
              <Text fontSize="lg" fontWeight="900" mt="-4px">
                Software Engineer
              </Text>
            </Box>
            <Image
              src="/assets/images/self-image.jpg"
              width={72}
              height={72}
              priority={true}
              loading="eager"
              className="round-image"
              alt="Rio Miyata"
            />
          </Flex>
          <Box marginLeft="8px" mt={14}>
            <VStack align="start" spacing={5} mb={12}>
              <Heading as="h2" fontSize="2xl" fontWeight="900">
                /Bio
              </Heading>
              <VStack align="start" spacing={1.5}>
                <Flex>
                  <Text mr="10px" fontWeight="900">
                    1989
                  </Text>
                  <Box>
                    <Text>Born in Aichi, Japan </Text>
                    <Text>日本の愛知県出身</Text>
                  </Box>
                </Flex>
                <Flex>
                  <Text mr="10px" fontWeight="900">
                    2014
                  </Text>
                  <Box>
                    <Text>
                      Master's Degree, Graduate School of Science and
                      Engineering @Hosei University
                    </Text>
                    <Text>法政大学理工学研究科 修士課程修了</Text>
                  </Box>
                </Flex>
                <Flex>
                  <Text mr="10px" fontWeight="900">
                    2019
                  </Text>
                  <Box>
                    <Text>Server-Side Engineering Course @Tech Camp</Text>
                    <Text>サーバーサイドエンジニアコース修了</Text>
                  </Box>
                </Flex>
                <Flex>
                  <Text mr="10px" fontWeight="900">
                    2020
                  </Text>
                  <Box>
                    <Text>Web Developer @AnkhSystems (Digital Media)</Text>
                    <Text>アンクシステムズ-デジタルメディア開発</Text>
                  </Box>
                </Flex>
                <Flex>
                  <VStack spacing={0} align="center" mr="10px">
                    <Text fontWeight="900">2023</Text>
                    <Text fontWeight="900" transform="rotate(90deg)" pb="5px">
                      〜
                    </Text>
                  </VStack>

                  <Box>
                    <Text>Freelance Software Engineer @Japan</Text>
                    <Text>フリーランスの活動開始</Text>
                  </Box>
                </Flex>
              </VStack>
            </VStack>
            <VStack align="start" spacing={5} mb={12}>
              <Heading as="h2" fontSize="2xl" fontWeight="900">
                /Interests
              </Heading>
              <Text>#Thinking #FoodTouring #Camping #Traveling</Text>
            </VStack>

            <VStack align="start" spacing={5} mb={12}>
              <Heading as="h2" fontSize="2xl" fontWeight="900">
                <HStack alignItems="center">
                  <Text>/About</Text>
                </HStack>
              </Heading>
              <Text>
                I solve problems through code. With 4 years in full-stack development (TypeScript/React/NestJS), I craft systems designed for evolution. Now diving into AI agents with LangGraph—because the best way to understand new tech is to build with it.
              </Text>
            </VStack>
            <VStack align="start" spacing={5} mb={8}>
              <Heading as="h2" fontSize="2xl" fontWeight="900">
                /Creations
              </Heading>
              <HStack spacing={4} width="100%" justifyContent="center">
                <Box maxW="280px">
                  <Link
                    href="https://slide-pilot-474305.web.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Box
                      bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                      width={280}
                      height={303}
                      borderRadius="15px"
                      display="flex"
                      flexDirection="column"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Text color="white" fontSize="md" fontWeight="600">Multimodal LLM App</Text>
                      <Text color="whiteAlpha.700" fontSize="sm" mt={2}>PDF → Video</Text>
                    </Box>
                  </Link>
                </Box>
                <Box maxW="280px">
                  <Link
                    href="https://kangeki-dapps.web.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Image
                      src="/assets/images/dev-image1.png"
                      alt="SoulBound Token DApp"
                      width={280}
                      height={303}
                      quality={90}
                      loading="lazy"
                      className="round-card"
                    />
                  </Link>
                </Box>
              </HStack>
            </VStack>
            <Flex justifyContent="center" mb={6}>
              <Link href="/work">
                <Button
                  fontWeight="600"
                  borderRadius="25px"
                  bg="#4a5568 !important"
                  color="#ffffff"
                  boxShadow="2px 2px 10px rgba(74, 85, 104, 0.2)"
                  _hover={{ opacity: 0.7 }}
                  pb={1}
                >
                  <Flex alignItems="center" mr={-1}>
                    <Text mr={0.5}>Creations</Text>
                    <FontAwesomeIcon
                      icon={faCaretRight}
                      width={15}
                      height={15}
                    />
                  </Flex>
                </Button>
              </Link>
            </Flex>
            <VStack align="start" spacing={5}>
              <Heading as="h2" fontSize="2xl" fontWeight="900">
                /Posts
              </Heading>
              {/* ブログの埋め込み */}
              {/* <VStack align="center">
                  {posts.map((post, index) => (
                    <PostCard post={post.node} key={index} />
                  ))}
                </VStack> */}
              <VStack align="start" spacing={2} width="100%" mb={5}>
                <a
                  href="https://note.com/miyata_ryo3/n/n547f8cd950c5"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#0066cc", textDecoration: "underline", fontSize: "16px" }}
                >
                  ネットの安全はなぜ？ 行きは簡単なのに戻るのは驚くほど難しい数学が鍵 (2025.12.26)
                </a>
                <a
                  href="https://note.com/miyata_ryo3/n/n3e17e24dd31c"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#0066cc", textDecoration: "underline", fontSize: "16px" }}
                >
                  人を表すソウルバンドトークンとよばれるNFT (2023.1.23)
                </a>
              </VStack>
            </VStack>
            <Flex justifyContent="center" mb={12}>
              <Link href="/post">
                <Button
                  fontWeight="600"
                  borderRadius="25px"
                  bg="#4a5568 !important"
                  color="#ffffff"
                  boxShadow="2px 2px 10px rgba(74, 85, 104, 0.2)"
                  _hover={{ opacity: 0.7 }}
                  pb={1}
                >
                  <Flex alignItems="center" mr={-1}>
                    <Text mr={0.5}>Posts</Text>
                    <FontAwesomeIcon
                      icon={faCaretRight}
                      width={15}
                      height={15}
                    />
                  </Flex>
                </Button>
              </Link>
            </Flex>
          </Box>

          <VStack align="start" mb={6}>
            <Heading as="h2" fontSize="2xl" fontWeight="900">
              /Contact
            </Heading>
          </VStack>
          <Flex justifyContent="center" mb={12}>
            <Button
              fontWeight="600"
              borderRadius="25px"
              bg="#4a5568 !important"
              color="#ffffff"
              boxShadow="2px 2px 10px rgba(74, 85, 104, 0.2)"
              _hover={{ opacity: 0.7 }}
              pb={0.5}
            >
              <Flex alignItems="center" mr={-1}>
                <Text>TwitterでDMを送る</Text>
                <FontAwesomeIcon icon={faCaretRight} width={15} height={15} />
              </Flex>
            </Button>
          </Flex>
        </Box>
      </Box>
    </Box>
  );
};

export async function getStaticProps() {
  const posts = (await getPosts()) || [];

  return {
    props: { posts },
  };
}

export default Home;
