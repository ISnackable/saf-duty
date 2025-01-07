import type * as schema from '@repo/database/schema';

export type Profiles = typeof schema.profiles.$inferSelect;
export type Rosters = typeof schema.rosters.$inferSelect;
export type SwapRequests = typeof schema.swapRequests.$inferSelect;
