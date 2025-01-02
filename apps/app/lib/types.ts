import type { profiles, rosters } from '@repo/database/schema';

export type Profiles = typeof profiles.$inferSelect;
export type Rosters = typeof rosters.$inferSelect;
