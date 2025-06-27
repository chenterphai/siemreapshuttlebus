import HomePage from "@/components/pages/HomePage";

import { preloadQuery } from "convex/nextjs";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";

export default async function Home() {
  const preloadDepartureFrom = await preloadQuery(api.airportTime.getFrom, {});
  const preloadDepartureTo = await preloadQuery(api.airportTime.getTo, {});
  const preloadTransportation = await preloadQuery(api.transportation.get, {});
  const supportId = "j977x5723v81advgh65912ycbh7jmkee" as Id<"support">;
  const preloaedSupport = await preloadQuery(api.support.select, {
    id: supportId,
  });

  // await getChatId();

  return (
    <HomePage
      preloadedDepartureFrom={preloadDepartureFrom}
      preloadedDepartureTo={preloadDepartureTo}
      preloadedTransportation={preloadTransportation}
      preloadedSupport={preloaedSupport}
    />
  );
}
