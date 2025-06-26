"use client"
import Image from 'next/image'
import React from 'react'
// import Navigation from './Navigation'
import Link from 'next/link'
import { Send } from 'lucide-react'

const HeaderComponent = () => {


    return (
        <header className='bg-white fixed left-0 right-0 top-0 z-50 shadow-[0px_2px_15px_rgba(0,0,0,0.05)]'>
            <div className='container mx-auto grid grid-cols-3 items-center h-[92px] md:px-0 px-6'>
                <Link href="/" className='flex items-center gap-2'>
                    <div className='w-[104px]'>
                        <Image
                            src="/_logo.png"
                            alt='Logo'
                            width={512}
                            height={256}
                            className='w-full'
                        />
                    </div>
                </Link>
                <nav>
                    <ul className='flex items-center justify-center gap-6'>
                        {/* <Navigation /> */}
                        <li>
                            <Link href="/">
                                <Image src="/logo.png" width={70} height={70} alt='Logo' loading='lazy' />
                            </Link>
                        </li>
                    </ul>
                </nav>
                <div className='flex justify-end gap-5'>
                    <Link href='https://t.me/siemreapshuttlebus1bot/miniapp' target='_blank' >
                        <div className='flex items-center gap-2'>
                            <div className='flex items-center justify-center w-5 h-5'>
                                <Send size={16} className='text-primary' />
                            </div>
                            <span className='text-sm max-sm:hidden text-neutral-500'>Mini App</span>
                        </div>
                    </Link>
                    <Link href="/help-center">
                        <div className='flex items-center gap-2'>
                            <Image
                                src="/help.svg"
                                width={20}
                                height={20}
                                alt='Help'
                                loading='lazy'
                            />
                            <span className='text-sm text-neutral-500 max-[470px]:hidden'>
                                Help
                            </span>
                        </div>
                    </Link>
                </div>
            </div>
        </header>
    )
}

export default HeaderComponent