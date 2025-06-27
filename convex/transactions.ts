import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const create = mutation({
  args: {
    order_ref: v.string(),
    departure_date: v.string(),
    email: v.string(),
    name: v.string(),
    passager: v.number(),
    phone: v.string(),
    ticket_type: v.string(),
    total: v.number(),
    issued_date: v.string(),
    special_request: v.string() || v.null(),
    payment_method: v.string(),
    return_date: v.string() || v.null(),
    trip: v.string(),
    from: v.string() || v.null(),
    to: v.string() || v.null(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("transactions", {
      order_ref: args.order_ref,
      departure_date: args.departure_date,
      email: args.email,
      name: args.name,
      passager: args.passager,
      phone: args.phone,
      ticket_type: args.ticket_type,
      total: args.total,
      issued_date: args.issued_date,
      status: true,
      special_request: args.special_request,
      payment_method: args.payment_method,
      return_date: args.return_date ?? null,
      trip: args.trip,
      from: args.from ?? "",
      to: args.to ?? "",
    });
  },
});

export const select = query({
  args: { id: v.id("transactions") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("transactions").order("desc").collect();
  },
});
