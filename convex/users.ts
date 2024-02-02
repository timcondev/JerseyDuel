import { v } from 'convex/values';
import { internalMutation } from './_generated/server';

export const createUser = internalMutation({
  args: { email: v.string(), userId: v.string() },
  handler: async (ctx, args) => {
    await ctx.db.insert('users', {
      email: args.email,
      userId: args.userId,
    });
  },
});

export const setStripeId = internalMutation({
  args: { stripeId: v.string(), userId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query('users')
      .withIndex('by_userId', (q) => q.eq('userId', args.userId))
      .first();

    if (!user) {
      throw Error('no user found in stripe');
    }
    await ctx.db.patch(user?._id, {
      stripeId: args.stripeId,
    });
  },
});
