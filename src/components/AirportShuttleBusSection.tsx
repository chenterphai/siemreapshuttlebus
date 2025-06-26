
import React from 'react'
import { Button } from './ui/button'
import { Maps } from './Map'

const AirportShuttleBusSection = ({
    support
}: {
    support: {
        value: string;
        title: string;
        url: string;
    }
}) => {

    const handleMapClick = () => {
        window.open(support.value)
    }

    return (
        <section className='container mx-auto mt-[62px]'>
            <div>
                <h1 className='text-2xl font-medium text-neutral-800'>Airport Shuttle Bus</h1>
                <p className='text-sm text-neutral-500 max-w-[80%] mt-2'>Book your ticket for the Airport Shuttle Bus from Siem Reap Angkor International Airport to Siem Reap Town and back.
                    Get instant confirmation.</p>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 mt-6'>
                <div className='md:me-6 me-0'>
                    <div className='bg-primary p-5 rounded-xl'>
                        <div className='flex justify-between'>
                            <div className='text-3xl text-white font-bold'>
                                Bus Station in <br /> Town
                            </div>
                            <div>
                                <div className='bg-white text-neutral-800 px-2 py-1 text-xl font-semibold rounded-md'>
                                    $8
                                </div>
                            </div>
                        </div>
                        <div>
                            <p className='text-[13px] text-neutral-50 font-light mt-5'>
                                Our bus station is conveniently situated on 7 Makara Road, right in front of ACE, and just a short walk from the Old Market area.
                            </p>
                            <p className='text-[13px] text-neutral-50 font-light mt-5'>
                                Most hotels and guesthouses are only a few minutes away by TukTuk. A group of friendly TukTuk drivers is always on hand at the station, ready to take you to your accommodation for a fixed fare of just $1.
                            </p>
                        </div>
                        <div className='mt-24'>
                            <Button onClick={handleMapClick} className='bg-white text-neutral-800 w-full py-5 cursor-pointer hover:bg-neutral-200'>
                                Chat with Us
                            </Button>
                        </div>
                    </div>
                </div>
                <div>
                    <Maps />
                </div>
            </div>
        </section>
    )
}

export default AirportShuttleBusSection