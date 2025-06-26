import { query } from "./_generated/server";

export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("airplane_time").collect();
  },
});

export const getFrom = query({
  args: {},
  handler: async (ctx) => {
    const departures = await ctx.db.query("airplane_time").collect();
    return departures.filter((dep) => dep.from_town === true);
  },
});

export const getTo = query({
  args: {},
  handler: async (ctx) => {
    const arrivals = await ctx.db.query("airplane_time").collect();
    return arrivals.filter((arr) => arr.from_town === false);
  },
});
