import React from 'react'
import Link from 'next/link'
import Image from 'next/image'

export const Navbar = () => {
    return (
        <div className='navbar'>
            <div className='left'>
                <Image 
                    src='/images/nusbg.png'
                    width={100}
                    height={100}
                    alt=""
                />
                <div className='leftHome'>
                    <Link href='/' className='returnHome'>onBoard</Link>
                </div>
            </div>
            <div className='right'>
                <Link href='/login' className='loginlink'>Log in</Link>
            </div>
        </div>
    )
}
