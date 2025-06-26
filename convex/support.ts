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
    const supports = await ctx.db.query("support").collect();
    return Promise.all(
      supports.map(async (support) => ({
        ...support,
        url: await ctx.storage.getUrl(support.storageId),
      }))
    );
  },
});

export const select = query({
  args: { id: v.id("support") },
  handler: async (ctx, args) => {
    const support = await ctx.db.get(args.id);
    const url = await ctx.storage.getUrl(support.storageId);
    return {
      ...support,
      url,
    };
  },
});
