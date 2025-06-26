"use client"

import React from 'react'
import Modal from '../ui/modal'
import { ArrowRightAltOutlined } from "@mui/icons-material"
import { Button } from '../ui/button'
import { Preloaded, usePreloadedQuery } from 'convex/react';
import { api } from "../../../convex/_generated/api";
import { Transaction } from '@/types/transaction'
import { useRouter } from 'next/navigation'

const BookingDetailPage = ({
    transactionPreloaded
}: {
    transactionPreloaded: Preloaded<typeof api.transactions.select>
}) => {

    const transaction: Transaction = usePreloadedQuery(transactionPreloaded);

    const router = useRouter()

    const handleClose = () => {
        router.back();
    }

    return (
        <div className='h-screen'>
            <Modal>
                <div className='text-center text-xl md:text-2xl font-medium'>Booking Summary</div>
                <p className='text-neutral-500 text-xs md:text-sm text-center max-w-[70%] mx-auto'>Thank you for booking with Siem Reap Wonder! We&apos;re thrilled to have you with us. A confirmation email with all the details has been sent to you. See you soon for an unforgettable experience! </p>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-4'>
                    <div className='border border-neutral-200/55 rounded-lg p-4'>
                        <p className='text-base font-semibold text-neutral-700'>Order Summary</p>
                        <div className='grid md:grid-cols-1 lg:grid-cols-2 grid-cols-2 max-[500px]:grid-cols-1 gap-x-4 gap-y-6 mt-4'>
                            <div className=''>
                                <p className='text-xs text-neutral-500'>Order Ref</p>
                                <p className='text-sm font-medium text-neutral-700'>{transaction.order_ref}</p>
                            </div>
                            <div className=''>
                                <p className='text-xs text-neutral-500'>Departure Date</p>
                                <p className='text-sm font-medium text-neutral-700'>{transaction.departure_date}</p>
                            </div>
                            <div>
                                <p className='text-xs text-neutral-500'>Status</p>
                                <p className='text-sm font-medium text-neutral-700'>{transaction.from} <ArrowRightAltOutlined fontSize='small' color='action' />  {transaction.to}</p>
                            </div>
                            <div>
                                <p className='text-xs text-neutral-500'>Passager</p>
                                <p className='text-sm font-medium text-neutral-700'>{transaction.passager} passager</p>
                            </div>
                            <div>
                                <p className='text-xs text-neutral-500'>Trip</p>
                                <p className='text-sm font-medium text-neutral-700'>{transaction.trip}</p>
                            </div>
                            <div>
                                <p className='text-xs text-neutral-500'>Payment Method</p>
                                <p className='text-sm font-medium text-neutral-700'>{transaction.payment_method}</p>
                            </div>
                            {transaction.return_date !== "" && (
                                <div>
                                    <p className='text-xs text-neutral-500'>Return Date</p>
                                    <p className='text-sm font-medium text-neutral-700'>{transaction.return_date}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className='border border-neutral-200/55 rounded-lg p-4'>
                        <p className='text-base font-semibold text-neutral-700'>Customer Information</p>
                        <div className='grid md:grid-cols-1 lg:grid-cols-2 max-[500px]:grid-cols-1 grid-cols-2 gap-x-4 gap-y-6 mt-4'>
                            <div className=''>
                                <p className='text-xs text-neutral-500'>Full Name</p>
                                <p className='text-sm font-medium text-neutral-700'>{transaction.name}</p>
                            </div>
                            <div>
                                <p className='text-xs text-neutral-500'>Phone</p>
                                <p className='text-sm font-medium text-neutral-700'>{transaction.phone}</p>
                            </div>
                            <div className=''>
                                <p className='text-xs text-neutral-500'>Email</p>
                                <p className='text-sm font-medium text-neutral-700'>{transaction.email}</p>
                            </div>
                            <div>
                                <p className='text-xs text-neutral-500'>Special Request</p>
                                <p className='text-sm font-medium text-neutral-700'>{transaction.special_request !== "" ? transaction.special_request : "-"}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='bg-neutral-50 shadow p-4 rounded-lg flex max-sm:flex-col max-sm:items-start max-sm:gap-y-3 items-center justify-between mt-4'>
                    <div>
                        <p className='text-sm font-medium text-neutral-600 max-[460px]:text-sm'>Total Amount</p>
                        <p className='text-lg font-semibold text-primary max-[460px]:text-sm'>${parseFloat(`${transaction.total}`).toFixed(2)}</p>
                    </div>
                    <div className='flex items-center gap-x-2'>
                        <Button variant="outline" className='text-neutral-600 text-xs cursor-pointer px-8'>
                            Print
                        </Button>
                        <Button className='text-xs cursor-pointer px-8' onClick={handleClose}>
                            Done
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    )
}

export default BookingDetailPage