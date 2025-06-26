import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const generateUploadUrl = mutation({
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

export const get = query({
  args: {},
  handler: async (ctx) => {
    const transportations = await ctx.db.query("transportations").collect();
    return Promise.all(
      transportations.map(async (transportation) => ({
        ...transportation,
        url: await ctx.storage.getUrl(transportation.storageId),
      }))
    );
  },
});

export const select = query({
  args: { id: v.id("transportations") },
  handler: async (ctx, args) => {
    const transportation = await ctx.db.get(args.id);
    const url = await ctx.storage.getUrl(transportation.storageId);
    return {
      ...transportation,
      url,
    };
  },
});
