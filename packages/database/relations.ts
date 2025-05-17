import { relations } from 'drizzle-orm/relations';
import {
  accounts,
  invitations,
  members,
  notifications,
  organizations,
  passkeys,
  profiles,
  pushSubscriptions,
  rosters,
  sessions,
  swapRequests,
  users,
} from './schema';

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, {
    fields: [accounts.userId],
    references: [users.id],
  }),
}));

export const usersRelations = relations(users, ({ one, many }) => ({
  accounts: many(accounts),
  profiles: many(profiles),
  pushSubscriptions: many(pushSubscriptions),
  sessions: many(sessions),
  organization: one(organizations, {
    fields: [users.initialOrganizationId],
    references: [organizations.id],
  }),
  invitations: many(invitations),
  members: many(members),
  passkeys: many(passkeys),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
  organization: one(organizations, {
    fields: [notifications.organizationId],
    references: [organizations.id],
  }),
  profile: one(profiles, {
    fields: [notifications.dutyPersonnelId],
    references: [profiles.id],
  }),
}));

export const organizationsRelations = relations(organizations, ({ many }) => ({
  notifications: many(notifications),
  profiles: many(profiles),
  rosters: many(rosters),
  swapRequests: many(swapRequests),
  users: many(users),
  invitations: many(invitations),
  members: many(members),
}));

export const profilesRelations = relations(profiles, ({ one, many }) => ({
  notifications: many(notifications),
  user: one(users, {
    fields: [profiles.userId],
    references: [users.id],
  }),
  organization: one(organizations, {
    fields: [profiles.organizationId],
    references: [organizations.id],
  }),
  rosters_dutyPersonnelId: many(rosters, {
    relationName: 'rosters_dutyPersonnelId_profiles_id',
  }),
  rosters_reserveDutyPersonnelId: many(rosters, {
    relationName: 'rosters_reserveDutyPersonnelId_profiles_id',
  }),
  swapRequests_receiverId: many(swapRequests, {
    relationName: 'swapRequests_receiverId_profiles_id',
  }),
  swapRequests_requesterId: many(swapRequests, {
    relationName: 'swapRequests_requesterId_profiles_id',
  }),
}));

export const pushSubscriptionsRelations = relations(
  pushSubscriptions,
  ({ one }) => ({
    user: one(users, {
      fields: [pushSubscriptions.userId],
      references: [users.id],
    }),
  })
);

export const rostersRelations = relations(rosters, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [rosters.organizationId],
    references: [organizations.id],
  }),
  profile_dutyPersonnelId: one(profiles, {
    fields: [rosters.dutyPersonnelId],
    references: [profiles.id],
    relationName: 'rosters_dutyPersonnelId_profiles_id',
  }),
  profile_reserveDutyPersonnelId: one(profiles, {
    fields: [rosters.reserveDutyPersonnelId],
    references: [profiles.id],
    relationName: 'rosters_reserveDutyPersonnelId_profiles_id',
  }),
  swapRequests_receiverRosterId: many(swapRequests, {
    relationName: 'swapRequests_receiverRosterId_rosters_id',
  }),
  swapRequests_requesterRosterId: many(swapRequests, {
    relationName: 'swapRequests_requesterRosterId_rosters_id',
  }),
}));

export const swapRequestsRelations = relations(swapRequests, ({ one }) => ({
  profile_receiverId: one(profiles, {
    fields: [swapRequests.receiverId],
    references: [profiles.id],
    relationName: 'swapRequests_receiverId_profiles_id',
  }),
  profile_requesterId: one(profiles, {
    fields: [swapRequests.requesterId],
    references: [profiles.id],
    relationName: 'swapRequests_requesterId_profiles_id',
  }),
  organization: one(organizations, {
    fields: [swapRequests.organizationId],
    references: [organizations.id],
  }),
  roster_receiverRosterId: one(rosters, {
    fields: [swapRequests.receiverRosterId],
    references: [rosters.id],
    relationName: 'swapRequests_receiverRosterId_rosters_id',
  }),
  roster_requesterRosterId: one(rosters, {
    fields: [swapRequests.requesterRosterId],
    references: [rosters.id],
    relationName: 'swapRequests_requesterRosterId_rosters_id',
  }),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));

export const invitationsRelations = relations(invitations, ({ one }) => ({
  organization: one(organizations, {
    fields: [invitations.organizationId],
    references: [organizations.id],
  }),
  user: one(users, {
    fields: [invitations.inviterId],
    references: [users.id],
  }),
}));

export const membersRelations = relations(members, ({ one }) => ({
  organization: one(organizations, {
    fields: [members.organizationId],
    references: [organizations.id],
  }),
  user: one(users, {
    fields: [members.userId],
    references: [users.id],
  }),
}));

export const passkeysRelations = relations(passkeys, ({ one }) => ({
  user: one(users, {
    fields: [passkeys.userId],
    references: [users.id],
  }),
}));
