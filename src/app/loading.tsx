"use client"
import { CircularProgress } from '@mui/material'
import React from 'react'

export default function Loading() {
    return (
        <div className='fixed z-50 overflow-hidden inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center'>
            <div className='bg-white shadow-2xl rounded-md p-6 flex flex-col justify-center items-center gap-y-4'>
                <CircularProgress size={24} />
                <span className='text-sm text-neutral-800'>Loading...</span>
            </div>
        </div>
    )
}
