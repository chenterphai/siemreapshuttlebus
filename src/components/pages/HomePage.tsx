"use client"
// import { useQuery } from 'convex/react'
import React from 'react'
import TicketBookingSection from '../TicketBookingSection'
import AirportShuttleBusSection from '../AirportShuttleBusSection'
import PrivateTransportationServiceSection from '../PrivateTransportationServiceSection'
import { Preloaded, usePreloadedQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
// import { api } from '../../convex/_generated/api'

const HomePage = (props: {
    preloadedDepartureFrom: Preloaded<typeof api.airplane_time.getFrom>,
    preloadedDepartureTo: Preloaded<typeof api.airplane_time.getTo>,
    preloadedTransportation: Preloaded<typeof api.transportation.get>,
    preloadedSupport: Preloaded<typeof api.support.select>
}) => {
    const departureTimeFrom = usePreloadedQuery(props.preloadedDepartureFrom);
    const departureTimeTo = usePreloadedQuery(props.preloadedDepartureTo);
    const transportation = usePreloadedQuery(props.preloadedTransportation);
    const support = usePreloadedQuery(props.preloadedSupport)
    return (
        <>
            <TicketBookingSection departureTo={departureTimeTo} departureFrom={departureTimeFrom} />
            <AirportShuttleBusSection support={support} />
            <PrivateTransportationServiceSection transportations={transportation} />
        </>
    )
}

export default HomePage