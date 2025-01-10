import type { User as UserType } from '@repo/auth/types';
import type * as schema from '@repo/database/schema';

export type User = UserType;
export type Profiles = Omit<
  typeof schema.profiles.$inferSelect,
  'createdAt' | 'updatedAt'
> & {
  name: User['name'];
  image: User['image'];
};
export type Rosters = Pick<
  typeof schema.rosters.$inferSelect,
  'id' | 'dutyDate' | 'isExtra'
> & {
  isWeekend: boolean;
  blockout: never[];
  dutyPersonnel: Pick<User, 'id' | 'name' | 'image'> | undefined;
  reserveDutyPersonnel: Pick<User, 'id' | 'name' | 'image'> | undefined;
  allocated: boolean;
};
export type SwapRequests = typeof schema.swapRequests.$inferSelect;
export type Notifications = typeof schema.notifications.$inferSelect;
