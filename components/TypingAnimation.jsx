import { Box, Flex } from "@chakra-ui/react";
import { useState, useEffect } from "react";

const TypingAnimation = () => {
  const texts = [
    "Hi, I'm Full Stack Developer based in Japan.",
    "Welcome! Thanks for visiting my site!"
  ];
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    let typingInterval;
    let cursorInterval;
    let index = isDeleting ? displayText.length : 0;
    const currentText = texts[currentTextIndex];

    const animate = () => {
      if (!isDeleting) {
        // タイピング中
        if (index <= currentText.length) {
          setDisplayText(currentText.slice(0, index));
          index++;
        } else {
          // タイピング完了、少し待ってから削除開始
          clearInterval(typingInterval);
          setTimeout(() => {
            setIsDeleting(true);
            setIsTyping(false);
          }, 2000);
          return;
        }
      } else {
        // バックスペース中
        if (index > 0) {
          index--;
          setDisplayText(currentText.slice(0, index));
        } else {
          // 削除完了、次のテキストに移動して再度タイピング開始
          clearInterval(typingInterval);
          setCurrentTextIndex((prev) => (prev + 1) % texts.length);
          setIsDeleting(false);
          setIsTyping(true);
          return;
        }
      }
    };

    // カーソル点滅アニメーション
    cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);

    // アニメーション実行
    typingInterval = setInterval(animate, 80);

    return () => {
      clearInterval(typingInterval);
      clearInterval(cursorInterval);
    };
  }, [isDeleting, currentTextIndex]);

  return (
    <Flex w="100%" justifyContent="center" alignItems="center" pt={4}>
      <Box
        mx={{ base: 2, md: 0 }}
        px={{ base: 3, md: 4 }}
        py={{ base: 2, md: 2 }}
        fontWeight="700"
        borderRadius={17}
        textAlign="center"
        border="1px solid #000"
        minHeight={{ base: "auto", md: "40px" }}
        maxWidth={{ base: "90vw", md: "600px" }}
        display="flex"
        alignItems="center"
        justifyContent="center"
        fontSize={{ base: "14px", md: "16px" }}
        whiteSpace={{ base: "normal", md: "nowrap" }}
        wordBreak="break-word"
      >
        <span>
          {displayText || "\u00A0"}
          <span 
            style={{
              opacity: showCursor ? 1 : 0,
              fontWeight: "normal",
              fontSize: "1.2em"
            }}
          >
            |
          </span>
        </span>
      </Box>
    </Flex>
  );
};

export default TypingAnimation;
