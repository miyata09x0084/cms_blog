import React, { useContext, useState } from 'react';
import Link from 'next/link';
import { useTheme } from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDove, faBars } from '@fortawesome/free-solid-svg-icons';
import { Menu, MenuButton, MenuItem, MenyItemOption, MenuGroup, MenuOptionGroup, MenuDivider, Show, Hide, Box } from '@chakra-ui/react';


const Header = () => {
  const theme = useTheme()
  return (
    <header>
        <div className='flex justify-between mx-auto max-w-screen-md @screen py-4 px-10 md:px-0 mb-8 font-MplusRounded text-xl font-mycolor'>
          <div style = {{color: theme.site}} className='cursor-pointer items-center font-bold flex'>
            <FontAwesomeIcon icon={faDove} className="mr-1 logo-size"/>
            <Link href='/' className="tracking-tighter">
              Rio Miyata
            </Link>
          </div>
          <Show above="sm">
            <nav>
              <ul className="flex space-x-3">
                <li>
                  <Link href="/blog">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/work">
                    Work
                  </Link>
                </li>
                <li>
                  <Link href="https://github.com/miyata09x0084">
                    Github
                  </Link>
                </li>
              </ul>
            </nav>
          </Show>
          <Hide above="sm">
              <FontAwesomeIcon icon={faBars} width="18px"/>
          </Hide>
        </div>
    </header>
  )
}

export default Header