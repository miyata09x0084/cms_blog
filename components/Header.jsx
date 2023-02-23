import React, { useContext, useState } from 'react';
import Link from 'next/link';
import { useTheme } from 'styled-components';

const Header = () => {
  const theme = useTheme()
  return (
    <div className='container mx-auto'>
        <Link href='/'>
            <h1 className='text-center text-4xl mt-24'>
                <span style = {{color: theme.site}} className='cursor-pointer font-bold text-4x'>
                    Rio's Website
                </span>
            </h1>
        </Link>
    </div>
  )
}

export default Header