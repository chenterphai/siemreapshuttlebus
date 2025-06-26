"use client"
import React from 'react'
import moment from 'moment'
import Link from 'next/link'


const FooterComponent = () => {

    const date = new Date()
    const year = moment(date).format("YYYY")

    return (
        <footer className='bg-primary'>
            <div className="container mx-auto py-10">
                <div className='flex flex-col gap-y-6 md:flex-row items-center justify-between border-t border-neutral-200 mt-6 pt-2'>
                    <div className='text-xs text-neutral-100 md:mt-2'>&copy; Copyright {year}</div>
                    <div className='flex items-center gap-5'>
                        <Link href="/terms-conditions" className='text-xs text-neutral-100 hover:underline'>
                            Terms & Conditions
                        </Link>
                        <div className='w-1 h-1 bg-neutral-100 rounded-full' />
                        {/* <Link href="#" className='text-xs text-neutral-100 hover:underline'>
                            Privacy policy
                        </Link> */}
                        <div className='flex items-center gap-2'>
                            <Link href="#">
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24"><path fill="#FFFFFF" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669c1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                            </Link>
                            <Link href="#">
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 432 384"><path fill="#FFFFFF" d="M383 105v11q0 45-16.5 88.5t-47 79.5t-79 58.5T134 365q-73 0-134-39q10 1 21 1q61 0 109-37q-29-1-51.5-18T48 229q8 2 16 2q12 0 23-4q-30-6-50-30t-20-55v-1q19 10 40 11q-39-27-39-73q0-24 12-44q33 40 79.5 64T210 126q-2-10-2-20q0-36 25.5-61.5T295 19q38 0 64 27q30-6 56-21q-10 31-39 48q27-3 51-13q-18 26-44 45z" /></svg>
                            </Link>
                            <Link href="#">
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 432 432"><path fill="#FFFFFF" d="M319 221.5q-8-10.5-30-10.5q-27 0-38 16t-11 45v146q0 5-3 8t-8 3h-76q-4 0-7.5-3t-3.5-8V148q0-4 3.5-7.5t7.5-3.5h74q4 0 6.5 2t3.5 6v5q1 2 1 7q28-27 76-27q53 0 83 27t30 79v182q0 5-3.5 8t-7.5 3h-78q-4 0-7.5-3t-3.5-8V254q0-22-8-32.5zM88 91.5Q73 107 51.5 107T15 91.5t-15-37T15 18T51.5 3T88 18t15 36.5t-15 37zm13 56.5v270q0 5-3.5 8t-7.5 3H14q-5 0-8-3t-3-8V148q0-4 3-7.5t8-3.5h76q4 0 7.5 3.5t3.5 7.5z" /></svg>
                            </Link>
                            <Link href="#">
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 16 16"><path fill="#FFFFFF" d="M8 5.67C6.71 5.67 5.67 6.72 5.67 8S6.72 10.33 8 10.33S10.33 9.28 10.33 8S9.28 5.67 8 5.67ZM15 8c0-.97 0-1.92-.05-2.89c-.05-1.12-.31-2.12-1.13-2.93c-.82-.82-1.81-1.08-2.93-1.13C9.92 1 8.97 1 8 1s-1.92 0-2.89.05c-1.12.05-2.12.31-2.93 1.13C1.36 3 1.1 3.99 1.05 5.11C1 6.08 1 7.03 1 8s0 1.92.05 2.89c.05 1.12.31 2.12 1.13 2.93c.82.82 1.81 1.08 2.93 1.13C6.08 15 7.03 15 8 15s1.92 0 2.89-.05c1.12-.05 2.12-.31 2.93-1.13c.82-.82 1.08-1.81 1.13-2.93c.06-.96.05-1.92.05-2.89Zm-7 3.59c-1.99 0-3.59-1.6-3.59-3.59S6.01 4.41 8 4.41s3.59 1.6 3.59 3.59s-1.6 3.59-3.59 3.59Zm3.74-6.49c-.46 0-.84-.37-.84-.84s.37-.84.84-.84s.84.37.84.84a.8.8 0 0 1-.24.59a.8.8 0 0 1-.59.24Z" /></svg>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default FooterComponent