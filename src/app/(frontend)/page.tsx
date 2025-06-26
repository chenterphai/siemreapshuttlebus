import HomePage from "@/components/pages/HomePage";

import { preloadQuery } from "convex/nextjs";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";

export default async function Home() {

  const preloadDepartureFrom = await preloadQuery(api.airplane_time.getFrom, {});
  const preloadDepartureTo = await preloadQuery(api.airplane_time.getTo, {});
  const preloadTransportation = await preloadQuery(api.transportation.get, {});
  const supportId = 'k57dz98csea0e3gt940a88pcvs7h07bq' as Id<'support'>
  const preloaedSupport = await preloadQuery(api.support.select, { id: supportId })

  // await getChatId();

  return <HomePage
    preloadedDepartureFrom={preloadDepartureFrom}
    preloadedDepartureTo={preloadDepartureTo}
    preloadedTransportation={preloadTransportation}
    preloadedSupport={preloaedSupport}
  />;
}
