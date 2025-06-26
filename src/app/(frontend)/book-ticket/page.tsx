import BookNowMainPage from "@/components/pages/BookNowMainPage";
import { preloadQuery } from "convex/nextjs";
import { api } from "../../../../convex/_generated/api";
import { Metadata } from "next";


export const metadata: Metadata = {
    title: 'Airport Bus Booking'
}

export default async function Page() {

    const preloadPayments = await preloadQuery(api.payments.get, {})

    return <BookNowMainPage preloadedPayments={preloadPayments} />
}