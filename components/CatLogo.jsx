import { Box, useColorModeValue } from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCat } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

const CatLogo = () => {
  const color = useColorModeValue("var(--text)", "var(--dark-text)");

  return (
    <Link href="/" passHref>
      <Box
        as="span"
        display="inline-flex"
        alignItems="center"
        cursor="pointer"
        aria-label="Home"
        role="link"
        color={color}
      >
        <FontAwesomeIcon width={26} height={26} icon={faCat} />
      </Box>
    </Link>
  );
};

export default CatLogo;
