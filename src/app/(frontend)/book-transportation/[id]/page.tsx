import BookTransportationMainPage from '@/components/pages/BookTransportationMainPage'
import React from 'react'
import { preloadQuery } from "convex/nextjs";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";
import { Metadata } from 'next';

interface RequestParams {
    params: Promise<{ id: string }>
}

export async function generateMetadata(): Promise<Metadata> {
    // const { id } = await params;
    return {
        title: "Private Transportation Booking",
        description: "Private Transportation Booking"
    }
}

export default async function Page({
    params
}: RequestParams) {

    const { id } = await params

    const transportationId = id as Id<"transportations">;

    const preloadedTransportation = await preloadQuery(api.transportation.select, { id: transportationId })

    const preloadPayments = await preloadQuery(api.payments.get, {})


    return <BookTransportationMainPage
        preloadedTransportation={preloadedTransportation}
        preloadedPayment={preloadPayments}
    />
}
