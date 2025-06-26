import Image from 'next/image'
import Link from 'next/link'

export default function NotFound() {
    return (
        <div className='h-screen flex flex-col items-center justify-center'>
            <Image
                src="/404.svg"
                alt='not fount'
                width={300}
                height={300}
                loading='lazy'
            />
            <p className='text-sm text-neutral-500'>Could not find requested resource</p>
            <div className='mt-6'>
                <Link href="/" className='bg-primary text-white px-4 py-2 rounded-md'>Return Home</Link>
            </div>
        </div>
    )
}