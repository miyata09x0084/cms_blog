import React, { useContext, useState } from 'react';
import Link from 'next/link';
import { useTheme } from 'styled-components';

const Header = () => {
  const theme = useTheme()
  return (
    <div className="mx-auto max-w-screen-md @screen px-8 md:px-0 mb-8 ">
        <Link href='/'>
            <h1 className='text-center text-4xl mt-24'>
                <span style = {{color: theme.site}} className='cursor-pointer font-bold text-4x'>
                  Satoshi Nakamoto's Website
                </span>
            </h1>
        </Link>
    </div>
  )
}

export default Header