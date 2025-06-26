"use client"
import Image from 'next/image'
import React from 'react'
import { Phone, ContentCopy, Email } from "@mui/icons-material"
import { IconButton } from '@mui/material'
// import QRCode from 'react-qr-code';
import { Preloaded, usePreloadedQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';

export default function HelpCenterPage({
    preloadedHelpCenter
}: {
    preloadedHelpCenter: Preloaded<typeof api.support.get>
}) {

    const supports = usePreloadedQuery(preloadedHelpCenter);

    return (
        <div className='mt-[102px] container mx-auto h-screen'>
            <div className='flex flex-col items-center justify-center mt-32'>
                <Image
                    src="/CallCenter.svg"
                    alt='Cal Center'
                    width={200}
                    height={200}
                    loading='lazy'
                />
                <div className='bg-white rounded-lg p-5 mt-10 flex flex-col gap-y-3'>
                    <div className='flex items-center gap-3'>
                        <Phone className='text-neutral-500' fontSize='small' />
                        <div className='flex items-center gap-2 justify-between w-full'>
                            <span className='text-neutral-700 font-medium text-lg'>
                                {supports && supports.find((item) => item.title === "Phone Number")?.value}
                            </span>
                            <IconButton>
                                <ContentCopy fontSize='small' />
                            </IconButton>
                        </div>
                    </div>
                    <div className='border-b' />
                    <div className='flex items-center gap-3'>
                        <Email className='text-neutral-500' fontSize='small' />
                        <div className='flex items-center justify-between gap-2'>
                            <span className='text-neutral-700 font-medium text-lg'>
                                {supports && supports.find((item) => item.title === "Email Address")?.value}
                            </span>
                            <IconButton>
                                <ContentCopy fontSize='small' />
                            </IconButton>
                        </div>
                    </div>
                </div>
                <div className='mt-10 flex flex-col items-center justify-center gap-y-4 relative'>
                    {/* <QRCode value='https://siemreapshuttlebus.com/contact' size={140} /> */}
                    {/* <div className='absolute -top-3 -left-3 border-t-2 border-primary rounded-tl-md border-l-2 w-8 h-8' /> */}
                    {/* <div className='absolute -top-3 -right-3 border-t-2 border-primary rounded-tr-md border-r-2 w-8 h-8' /> */}
                    {/* <div className='absolute -bottom-2.5 -right-2.5 border-b-2 border-primary rounded-br-md border-r-2 w-8 h-8' /> */}
                    {/* <div className='absolute -bottom-3 -left-3 border-b-2 border-primary rounded-bl-md border-l-2 w-8 h-8' /> */}
                    {supports && supports.find((item) => item.title === "Telegram")?.url && (
                        <Image
                            src={supports.find((item) => item.title === "Telegram")?.url}
                            alt='Telegram'
                            width={512}
                            height={512}
                            className='w-[240px]'
                            loading='lazy'
                        />
                    )}
                </div>
            </div>

        </div>
    )
}
