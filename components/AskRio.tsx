import { useState, useRef, useEffect, Fragment } from 'react';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import {
  Box,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import Link from 'next/link';

function getMessageText(message: { parts: Array<{ type: string; text?: string }> }): string {
  return message.parts
    .filter((p) => p.type === 'text' && p.text)
    .map((p) => p.text)
    .join('');
}

function renderWithLinks(
  text: string,
  linkColor: string
): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  let lastIndex = 0;
  let match;

  while ((match = linkRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(
        <Fragment key={`t-${lastIndex}`}>
          {text.slice(lastIndex, match.index)}
        </Fragment>
      );
    }
    parts.push(
      <Link key={`l-${match.index}`} href={match[2]}>
        <Text
          as="span"
          color={linkColor}
          fontWeight="500"
          cursor="pointer"
          transition="opacity 0.2s"
          _hover={{ opacity: 0.7 }}
        >
          {match[1]}
        </Text>
      </Link>
    );
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push(
      <Fragment key={`t-${lastIndex}`}>{text.slice(lastIndex)}</Fragment>
    );
  }

  return parts;
}

const chatTransport = new DefaultChatTransport({ api: '/api/ask' });

const AskRio = () => {
  const { messages, sendMessage, status } = useChat({
    transport: chatTransport,
  });

  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const borderColor = useColorModeValue('var(--border)', 'var(--dark-border)');
  const textSecondary = useColorModeValue(
    'var(--text-secondary)',
    'var(--dark-text-secondary)'
  );
  const linkColor = useColorModeValue('var(--accent)', 'var(--dark-accent)');

  const isLoading = status === 'submitted' || status === 'streaming';

  // Keyboard shortcut: "/" to focus input
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (document.activeElement as HTMLElement)?.tagName;
      if (
        e.key === '/' &&
        tag !== 'INPUT' &&
        tag !== 'TEXTAREA' &&
        tag !== 'SELECT'
      ) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;
    setInput('');
    await sendMessage({ text: trimmed });
  };

  const lastAssistant = messages
    .filter((m) => m.role === 'assistant')
    .pop();

  const responseText = lastAssistant ? getMessageText(lastAssistant) : '';

  return (
    <Box mt={3}>
      <form onSubmit={handleSubmit}>
        <Box
          as="input"
          ref={inputRef}
          name="prompt"
          value={input}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setInput(e.target.value)
          }
          placeholder="Ask me anything..."
          type="text"
          autoComplete="off"
          disabled={isLoading}
          display="block"
          w="100%"
          border="1px solid"
          borderColor={borderColor}
          borderRadius={17}
          px={4}
          py={2}
          fontSize={{ base: 'xs', md: 'sm' }}
          fontFamily="inherit"
          bg="transparent"
          color="inherit"
          outline="none"
          transition="border-color 0.2s"
          _placeholder={{ color: textSecondary, opacity: 0.5 }}
          _focus={{ borderColor: 'var(--accent)' }}
          _hover={{ borderColor: 'var(--accent)' }}
          sx={{
            '&:disabled': { opacity: 0.6, cursor: 'not-allowed' },
          }}
        />
      </form>

      {responseText && (
        <Box
          mt={2}
          border="1px solid"
          borderColor={borderColor}
          borderRadius={17}
          px={4}
          py={3}
          fontSize={{ base: 'xs', md: 'sm' }}
          lineHeight="1.7"
          className="fade-in"
        >
          <Text whiteSpace="pre-wrap">
            {renderWithLinks(responseText, linkColor)}
          </Text>
        </Box>
      )}
    </Box>
  );
};

export default AskRio;
