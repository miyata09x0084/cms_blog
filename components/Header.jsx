import React, { useContext } from 'react';
import Link from 'next/link';

const Header = () => {
  return (
    <div className='container mx-auto'>
        <Link href='/'>
            <h1 className='text-center text-4xl mt-12'>
                <span className='cursor-pointer font-bold text-4xl'>
                    Rio's Website
                </span>
            </h1>
        </Link>
    </div>
  )
}

export default Header