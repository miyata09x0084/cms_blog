import type { NextPage } from "next";
import Link from "next/link";
import Head from "next/head";
import Image from "next/image";
import { getPosts } from "../services";
import {
  Box,
  Text,
  Flex,
  Heading,
  VStack,
  HStack,
  useColorModeValue,
} from "@chakra-ui/react";

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
        <title>Rio Miyata's Website</title>
      </Head>
      <Box
        maxWidth="720px"
        mx="auto"
        px={{ base: 5, md: 0 }}
        py={16}
        fontSize="15px"
        letterSpacing="0.01em"
        lineHeight="1.7"
      >
        {/* Hero */}
        <Flex alignItems="center" mb={16}>
          <Box flex="1">
            <Text fontSize="3xl" fontWeight="700" letterSpacing="-0.02em">
              Rio Miyata
            </Text>
            <Text fontSize="md" fontWeight="500" color={textSecondary} mt={1}>
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

        {/* About */}
        <Box mb={16}>
          <VStack align="start" spacing={4}>
            <Text fontSize="15px" lineHeight="1.8" color={textSecondary}>
              I&apos;m a full-stack engineer with a focus on building web
              applications that are structured to last. I enjoy working across
              the entire stack — from crafting intuitive, component-driven UIs
              to designing backend architectures with clean module boundaries
              and strong data integrity. What drives me is creating systems
              where both the user experience and the underlying code are equally
              well thought out.
            </Text>
            <Text fontSize="15px" lineHeight="1.8" color={textSecondary}>
              Most recently, I built a home-buying simulation platform from
              scratch, owning the entire stack end to end — designing a NestJS
              API layer with dependency-aware modularization, building the React
              frontend with optimized state management, and setting up secure
              file handling with AWS S3. What I&apos;m most proud of is the
              deliberate investment in long-term maintainability: automated API
              documentation, model visualization with PlantUML, and coding
              standards that kept the codebase approachable well beyond the
              initial build.
            </Text>
            <Text fontSize="15px" lineHeight="1.8" color={textSecondary}>
              Outside of work, you can usually find me soaking in hot springs
              around Japan, hunting down cozy local cafés, or tinkering with
              whatever side project has my attention that week.
            </Text>
          </VStack>
        </Box>

        {/* Posts */}
        <Box mb={16}>
          <Heading as="h2" fontSize="sm" fontWeight="600" textTransform="uppercase" letterSpacing="0.1em" color={textSecondary} mb={6}>
            Posts
          </Heading>
          <VStack align="start" spacing={4}>
            <Box
              as="a"
              href="https://note.com/miyata_ryo3/n/n547f8cd950c5"
              target="_blank"
              rel="noopener noreferrer"
              w="100%"
              py={3}
              borderBottom="1px solid"
              borderColor={borderColor}
              transition="color 0.2s"
              _hover={{ color: linkColor }}
            >
              <Flex justifyContent="space-between" alignItems="baseline" flexWrap="wrap" gap={2}>
                <Text fontSize="15px">ネットの安全はなぜ？ 行きは簡単なのに戻るのは驚くほど難しい数学が鍵</Text>
                <Text fontSize="sm" color={textSecondary} flexShrink={0}>2025.12.26</Text>
              </Flex>
            </Box>
            <Box
              as="a"
              href="https://note.com/miyata_ryo3/n/n3e17e24dd31c"
              target="_blank"
              rel="noopener noreferrer"
              w="100%"
              py={3}
              borderBottom="1px solid"
              borderColor={borderColor}
              transition="color 0.2s"
              _hover={{ color: linkColor }}
            >
              <Flex justifyContent="space-between" alignItems="baseline" flexWrap="wrap" gap={2}>
                <Text fontSize="15px">人を表すソウルバンドトークンとよばれるNFT</Text>
                <Text fontSize="sm" color={textSecondary} flexShrink={0}>2023.1.23</Text>
              </Flex>
            </Box>
          </VStack>
          <Box mt={6}>
            <Link href="/post">
              <Text
                as="span"
                fontSize="sm"
                fontWeight="500"
                color={linkColor}
                transition="opacity 0.2s"
                _hover={{ opacity: 0.7 }}
              >
                All posts &rarr;
              </Text>
            </Link>
          </Box>
        </Box>

        {/* Creations */}
        <Box mb={16}>
          <Heading as="h2" fontSize="sm" fontWeight="600" textTransform="uppercase" letterSpacing="0.1em" color={textSecondary} mb={6}>
            Creations
          </Heading>
          <HStack spacing={6} width="100%" alignItems="flex-start" flexWrap={{ base: "wrap", md: "nowrap" }}>
            <Box flex="1" minW={{ base: "100%", md: "0" }}>
              <Link
                href="https://slide-pilot-474305.web.app/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Box
                  bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                  borderRadius="12px"
                  aspectRatio="1"
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="center"
                  transition="transform 0.2s, box-shadow 0.2s"
                  _hover={{ transform: "translateY(-2px)", boxShadow: "0 8px 30px rgba(0,0,0,0.12)" }}
                >
                  <Text color="white" fontSize="md" fontWeight="600">Multimodal LLM App</Text>
                  <Text color="whiteAlpha.700" fontSize="sm" mt={2}>PDF &rarr; Video</Text>
                </Box>
              </Link>
            </Box>
            <Box flex="1" minW={{ base: "100%", md: "0" }}>
              <Link
                href="https://kangeki-dapps.web.app/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Box
                  borderRadius="12px"
                  overflow="hidden"
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
                    style={{ width: "100%", height: "auto" }}
                  />
                </Box>
              </Link>
            </Box>
          </HStack>
          <Box mt={6}>
            <Link href="/work">
              <Text
                as="span"
                fontSize="sm"
                fontWeight="500"
                color={linkColor}
                transition="opacity 0.2s"
                _hover={{ opacity: 0.7 }}
              >
                All creations &rarr;
              </Text>
            </Link>
          </Box>
        </Box>

        {/* Bio */}
        <Box mb={16}>
          <Heading as="h2" fontSize="sm" fontWeight="600" textTransform="uppercase" letterSpacing="0.1em" color={textSecondary} mb={6}>
            Bio
          </Heading>
          <VStack align="start" spacing={3}>
            {[
              { year: "1989", text: "Born in Aichi, Japan", sub: "日本の愛知県出身" },
              { year: "2014", text: "Master's Degree, Graduate School of Science and Engineering @Hosei University", sub: "法政大学理工学研究科 修士課程修了" },
              { year: "2019", text: "Server-Side Engineering Course @Tech Camp", sub: "サーバーサイドエンジニアコース修了" },
              { year: "2020", text: "Web Developer @AnkhSystems (Digital Media)", sub: "アンクシステムズ-デジタルメディア開発" },
              { year: "2023–", text: "Freelance Software Engineer @Japan", sub: "フリーランスの活動開始" },
            ].map((item) => (
              <Flex key={item.year} py={2} borderBottom="1px solid" borderColor={borderColor} w="100%">
                <Text fontWeight="600" fontSize="sm" minW="60px" color={textSecondary}>
                  {item.year}
                </Text>
                <Box>
                  <Text fontSize="15px">{item.text}</Text>
                  <Text fontSize="sm" color={textSecondary}>{item.sub}</Text>
                </Box>
              </Flex>
            ))}
          </VStack>
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
