import type { profiles } from '@repo/database/schema';

export type Profiles = typeof profiles.$inferSelect;
