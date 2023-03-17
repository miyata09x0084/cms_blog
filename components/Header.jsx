import React, { useContext, useState } from 'react';
import Link from 'next/link';
import { useTheme } from 'styled-components';

const Header = () => {
  const theme = useTheme()
  return (
    <header>
        <div className='container flex justify-between mx-auto max-w-screen-md @screen py-4 px-10 md:px-0 mb-8 font-MplusRounded text-xl font-mycolor'>
          <div style = {{color: theme.site}} className='cursor-pointer items-center font-bold'>
            <Link href='/'>
              Rio Miyata
            </Link>
          </div>
          <nav>
            <ul className="flex space-x-4">
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
        </div>
    </header>
  )
}

export default Header