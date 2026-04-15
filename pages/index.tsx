import type { NextPage } from "next";
import Link from "next/link";
import Head from "next/head";
import Image from "next/image";
import { getPosts } from "../services";
import TypingAnimation from "../components/TypingAnimation";
import {
  Box,
  Text,
  Flex,
  Heading,
  VStack,
  HStack,
  Spacer,
  Button,
  useColorModeValue,
} from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretRight } from "@fortawesome/free-solid-svg-icons";

interface Props {
  posts: Array<any>;
}

const Home: NextPage<Props> = ({ posts }) => {
  const linkColor = useColorModeValue("var(--accent)", "var(--dark-accent)");
  const textSecondary = useColorModeValue("var(--text-secondary)", "var(--dark-text-secondary)");
  const borderColor = useColorModeValue("var(--border)", "var(--dark-border)");

  return (
    <Box className="fade-in">
      <Head>
        <title>Ryo Miyata&apos;s Website</title>
      </Head>
      <Box
        maxWidth="768px"
        mx="auto"
        px={{ base: 4, md: 0 }}
        fontSize="17px"
        letterSpacing="0.06em"
        lineHeight="1.5"
      >
        {/* Hero Image */}
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

        {/* Typing */}
        <Box mt={8}>
          <TypingAnimation />
        </Box>

        {/* Hero */}
        <Flex mt={14} alignItems="center">
          <Box>
            <Text fontSize="4xl" fontWeight="800" letterSpacing="-0.02em">
              Ryo Miyata
            </Text>
            <Text fontSize="lg" fontWeight="900" mt="-4px">
              web developer
            </Text>
          </Box>
          <Spacer />
          <Box flexShrink={0}>
            <Image
              src="/assets/images/self-image.jpg"
              width={72}
              height={72}
              priority={false}
              loading="lazy"
              className="round-image"
              alt="Ryo Miyata"
            />
          </Box>
        </Flex>

        <Box marginLeft="8px" mt={14}>
          {/* About Me */}
          <VStack align="start" spacing={5} mb={14}>
            <Heading as="h2" fontSize="2xl" fontWeight="900">
              /About Me
            </Heading>
            <Text>
              I&apos;m the younger of a pair of twins, which might be why I&apos;ve
              always felt most alive turning ideas into something real. My head
              runs on a steady stream of half-formed concepts, and programming
              is the craft that lets me pull them out and shape them into apps
              people can actually use.
            </Text>
          </VStack>

          {/* Bio */}
          <VStack align="start" spacing={5} mb={14}>
            <Heading as="h2" fontSize="2xl" fontWeight="900">
              /Bio
            </Heading>
            <VStack align="start" spacing={3} w="100%">
              {[
                { year: "1989", text: "Born in Aichi, Japan", sub: "日本の愛知県出身" },
                { year: "2015", text: "Master's Degree, Graduate School of Science and Engineering @Hosei University", sub: "法政大学大学院理工学研究科 修士課程修了" },
                { year: "2019", text: "Server-Side Engineering Course @Tech Camp", sub: "サーバーサイドエンジニアコース修了" },
                { year: "2020", text: "Web Developer @AnkhSystems (Digital Media)", sub: "アンクシステムズ-デジタルメディア開発" },
                { year: "2023–", text: "Freelance Software Engineer @Japan", sub: "フリーランスの活動開始" },
              ].map((item) => (
                <Flex key={item.year} py={2} borderBottom="1px solid" borderColor={borderColor} w="100%">
                  <Text fontWeight="700" fontSize="md" minW="70px">
                    {item.year}
                  </Text>
                  <Box>
                    <Text fontSize="md">{item.text}</Text>
                    <Text fontSize="sm" color={textSecondary}>{item.sub}</Text>
                  </Box>
                </Flex>
              ))}
            </VStack>
          </VStack>

          {/* Interests */}
          <VStack align="start" spacing={5} mb={14}>
            <Heading as="h2" fontSize="2xl" fontWeight="900">
              /Interests
            </Heading>
            <HStack spacing={3} flexWrap="wrap">
              {[
                "Morning coffee",
                "Campfire cooking",
                "Hot spring hopping",
                "The beauty of physics",
                "First principles",
                "Running",
              ].map((item) => (
                <Text key={item} fontSize="md">
                  #{item}
                </Text>
              ))}
            </HStack>
          </VStack>

          {/* Posts */}
          <VStack align="start" spacing={5}>
            <Heading as="h2" fontSize="2xl" fontWeight="900">
              /Posts
            </Heading>
            <VStack align="start" spacing={2} width="100%" mb={5}>
              <Box
                as="a"
                href="https://note.com/miyata_ryo3/n/n3e17e24dd31c"
                target="_blank"
                rel="noopener noreferrer"
                color={linkColor}
                textDecoration="underline"
                fontSize="16px"
                _hover={{ opacity: 0.7 }}
              >
                人を表すソウルバンドトークンとよばれるNFT (2023.1.23)
              </Box>
            </VStack>
          </VStack>
          <Flex justifyContent="center" mb={6}>
            <Link href="/post">
              <Button
                fontWeight="600"
                borderRadius="25px"
                bg="#8505b0 !important"
                color="#EDDFD6"
                boxShadow="2px 2px 10px rgba(133, 5, 176, 0.3)"
                _hover={{ opacity: 0.4 }}
                pb={1}
              >
                <Flex alignItems="center" mr={-1}>
                  <Text mr={0.5}>Posts</Text>
                  <FontAwesomeIcon icon={faCaretRight} width={15} height={15} />
                </Flex>
              </Button>
            </Link>
          </Flex>

          {/* Creations */}
          <VStack align="start" spacing={5} mb={8}>
            <Heading as="h2" fontSize="2xl" fontWeight="900">
              /Creations
            </Heading>
            <HStack spacing={6} width="100%" alignItems="stretch" flexWrap={{ base: "wrap", md: "nowrap" }}>
              <Box flex="1" minW={{ base: "100%", md: "0" }} display="flex">
                <Link
                  href="https://slide-pilot-474305.web.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ width: "100%" }}
                >
                  <Box
                    bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                    borderRadius="15px"
                    aspectRatio="1"
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                    transition="transform 0.2s, box-shadow 0.2s"
                    _hover={{ transform: "translateY(-2px)", boxShadow: "0 8px 30px rgba(0,0,0,0.12)" }}
                  >
                    <Text color="white" fontSize="md" fontWeight="600">Multimodal LLM App</Text>
                    <Text color="whiteAlpha.700" fontSize="sm" mt={2}>PDF → Video</Text>
                  </Box>
                </Link>
              </Box>
              <Box flex="1" minW={{ base: "100%", md: "0" }} display="flex">
                <Link
                  href="https://kangeki-dapps.web.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ width: "100%" }}
                >
                  <Box
                    borderRadius="15px"
                    overflow="hidden"
                    aspectRatio="1"
                    transition="transform 0.2s, box-shadow 0.2s"
                    _hover={{ transform: "translateY(-2px)", boxShadow: "0 8px 30px rgba(0,0,0,0.12)" }}
                  >
                    <Image
                      src="/assets/images/dev-image1.png"
                      alt="SoulBound Token DApp"
                      width={400}
                      height={400}
                      quality={90}
                      loading="lazy"
                      className="round-card"
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </Box>
                </Link>
              </Box>
            </HStack>
          </VStack>
          <Flex justifyContent="center" mb={6}>
            <Link href="/work">
              <Button
                fontWeight="600"
                borderRadius="25px"
                bg="#0530b0 !important"
                color="#EDDFD6"
                boxShadow="2px 2px 10px rgba(5, 48, 176, 0.3)"
                _hover={{ opacity: 0.4 }}
                pb={1}
              >
                <Flex alignItems="center" mr={-1}>
                  <Text mr={0.5}>Creations</Text>
                  <FontAwesomeIcon icon={faCaretRight} width={15} height={15} />
                </Flex>
              </Button>
            </Link>
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
