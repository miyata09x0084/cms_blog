import React, { useContext, useState } from 'react';
import { useTheme } from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDove, faBars } from '@fortawesome/free-solid-svg-icons';
import { Box, Flex, Text, Spacer, Link, HStack, IconButton, Drawer, DrawerOverlay, DrawerContent, DrawerCloseButton, DrawerHeader, DrawerBody, VStack, useDisclosure} from '@chakra-ui/react';
import { HamburgerIcon } from '@chakra-ui/icons';


const Header = () => {
  const theme = useTheme()

  const { isOpen, onOpen, onClose } = useDisclosure();

  const MenuItems = () => (
    <>
      <Link href="/post">Post</Link>
      <Link href="/work">Work</Link>
      <Link href="https://github.com/miyata09x0084">GitHub</Link>
    </>
  );

  return (
    <header>
      <Box className="font-MplusRounded" w="100%" mt="10px" mb="30px" fontSize="xl" px={{base: 8, md: 0}} maxWidth="768px" mx="auto" style={{color: theme.font}}>
        <Flex>
            <FontAwesomeIcon icon={faDove} width="20px"/>
            <Text mx={1}  fontWeight="bold" display="flex" alignItems="center">
              <Link href="/">Rio Miyata</Link>
            </Text>
            <Spacer />
            <HStack spacing={4} display={{base: "none", md: "flex"}}>
              <MenuItems />
            </HStack>
            <IconButton
              display={{base: "flex", md: "none"}}
              aria-label="Open menu"
              bg="#524C44"
              icon ={<HamburgerIcon color="#fcf9f4"/>}
              onClick={onOpen}
            />
        </Flex>
        <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
          <DrawerOverlay>
            <DrawerContent color="var(--primary-text)" className="font-MplusRounded">
              <DrawerCloseButton/>
              <DrawerHeader borderBottomWidth="1px"  bg="#fcf9f4">Menu</DrawerHeader>
              <DrawerBody  fontWeight="medium" bg="#fcf9f4">
                <VStack align="start">
                  <MenuItems />
                </VStack>
              </DrawerBody>
            </DrawerContent>
          </DrawerOverlay>
        </Drawer>
      </Box>
    </header>
  )
}

export default Header