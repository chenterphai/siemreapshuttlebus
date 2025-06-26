import HelpCenterPage from '@/components/pages/HelpCenterPage'
import { preloadQuery } from 'convex/nextjs'
import React from 'react'
import { api } from '../../../../convex/_generated/api'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: "Support"
}

export default async function page() {

    const preloadedHelpCenter = await preloadQuery(api.support.get, {})

    return <HelpCenterPage preloadedHelpCenter={preloadedHelpCenter} />
}
