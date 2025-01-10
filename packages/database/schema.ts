import { sql } from 'drizzle-orm';
import {
  bigint,
  boolean,
  check,
  date,
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  unique,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core';

export const users = pgTable(
  'users',
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    name: text('name').notNull(),
    email: text('email').notNull().unique(),
    emailVerified: boolean('email_verified').notNull(),
    image: text('image'),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', {
      withTimezone: true,
      mode: 'string',
    })
      .defaultNow()
      .$onUpdate(() => sql`CURRENT_TIMESTAMP`)
      .notNull(),
    role: text('role').default('user'),
    banned: boolean('banned'),
    banReason: text('ban_reason'),
    banExpires: timestamp('ban_expires'),
    initialOrganizationId: uuid('initial_organization_id')
      .notNull()
      .references(() => organizations.id),
    onboarded: boolean().default(false).notNull(),
  },
  (table) => [uniqueIndex('users_email_idx').on(table.email)]
);

// We are not really using this table, rather using in the secondary storage (Redis)
export const sessions = pgTable(
  'sessions',
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    expiresAt: timestamp('expires_at', {
      withTimezone: true,
      mode: 'string',
    }).notNull(),
    token: text('token').notNull().unique(),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', {
      withTimezone: true,
      mode: 'string',
    })
      .defaultNow()
      .$onUpdate(() => sql`CURRENT_TIMESTAMP`)
      .notNull(),
    ipAddress: text('ip_address'),
    userAgent: text('user_agent'),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id),
    impersonatedBy: text('impersonated_by'),
    activeOrganizationId: uuid('active_organization_id'),
  },
  (table) => [
    index('sessions_user_id_idx').on(table.userId),
    index('sessions_token_idx').on(table.token),
  ]
);

export const accounts = pgTable(
  'accounts',
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    accountId: uuid('account_id').notNull(),
    providerId: text('provider_id').notNull(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id),
    accessToken: text('access_token'),
    refreshToken: text('refresh_token'),
    idToken: text('id_token'),
    accessTokenExpiresAt: timestamp('access_token_expires_at'),
    refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
    scope: text('scope'),
    password: text('password'),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', {
      withTimezone: true,
      mode: 'string',
    })
      .defaultNow()
      .$onUpdate(() => sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => [
    index('account_user_idx').on(table.userId),
    index('account_account_id_idx').on(table.accountId),
  ]
);

export const verifications = pgTable(
  'verifications',
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    identifier: text('identifier').notNull(),
    value: text('value').notNull(),
    expiresAt: timestamp('expires_at', {
      withTimezone: true,
      mode: 'string',
    }).notNull(),
    createdAt: timestamp('created_at', {
      withTimezone: true,
      mode: 'string',
    }).defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' })
      .defaultNow()
      .$onUpdate(() => sql`CURRENT_TIMESTAMP`),
  },
  (table) => [
    index('verifications_identifier_idx').on(table.identifier),
    index('verifications_value_idx').on(table.value),
  ]
);

export const organizations = pgTable(
  'organizations',
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    name: text('name').notNull(),
    slug: text('slug').notNull().unique(),
    logo: text('logo'),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' })
      .defaultNow()
      .notNull(),
    metadata: text('metadata'),
  },
  (table) => [
    index('organizations_name_idx').on(table.name),
    index('organizations_slug_idx').on(table.slug),
  ]
);

export const members = pgTable(
  'members',
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    organizationId: uuid('organization_id')
      .notNull()
      .references(() => organizations.id),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id),
    role: text('role').default('member').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index('members_organization_id_idx').on(table.organizationId),
    index('members_user_id_idx').on(table.userId),
  ]
);

export const invitations = pgTable(
  'invitations',
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    organizationId: uuid('organization_id')
      .notNull()
      .references(() => organizations.id),
    email: text('email').notNull(),
    role: text('role').default('member'),
    status: text('status').notNull(),
    expiresAt: timestamp('expires_at', {
      withTimezone: true,
      mode: 'string',
    }).notNull(),
    inviterId: uuid('inviter_id')
      .notNull()
      .references(() => users.id),
  },
  (table) => [
    index('invitations_organization_id_idx').on(table.organizationId),
    index('invitations_email_idx').on(table.email),
    index('invitations_inviter_id_idx').on(table.inviterId),
  ]
);

export const passkeys = pgTable('passkeys', {
  id: uuid().defaultRandom().primaryKey().notNull(),
  name: text('name'),
  publicKey: text('public_key').notNull(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id),
  credentialID: text('credential_id').notNull(),
  counter: integer('counter').notNull(),
  deviceType: text('device_type').notNull(),
  backedUp: boolean('backed_up').notNull(),
  transports: text('transports'),
  createdAt: timestamp('created_at', {
    withTimezone: true,
    mode: 'string',
  }).defaultNow(),
});

export const profiles = pgTable(
  'profiles',
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
    organizationId: uuid('organization_id')
      .notNull()
      .references(() => organizations.id, {
        onDelete: 'cascade',
        onUpdate: 'cascade',
      }),
    ordDate: date('ord_date'),
    blockoutDates: date('blockout_dates').array(),
    maxBlockouts: integer('max_blockouts').default(8).notNull(),
    weekdayPoints: integer('weekday_points').default(0).notNull(),
    weekendPoints: integer('weekend_points').default(0).notNull(),
    noOfExtras: integer('no_of_extras').default(0),
    userSettings: jsonb('user_settings')
      .default({
        notify_on_duty_reminder: true,
        notify_on_swap_requests: true,
        notify_on_rosters_published: true,
      })
      .notNull()
      .$type<{
        notify_on_duty_reminder: boolean;
        notify_on_swap_requests: boolean;
        notify_on_rosters_published: boolean;
      }>(),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' })
      .defaultNow()
      .$onUpdate(() => sql`CURRENT_TIMESTAMP`),
  },
  (table) => [
    index('profiles_user_id_idx').using(
      'btree',
      table.userId.asc().nullsLast().op('uuid_ops')
    ),
    index('profiles_organization_id_idx').using(
      'btree',
      table.organizationId.asc().nullsLast().op('uuid_ops')
    ),
    check('max_blockouts', sql`max_blockouts > 0`),
  ]
);

export const rosters = pgTable(
  'rosters',
  {
    id: bigint({ mode: 'number' }).primaryKey().generatedByDefaultAsIdentity({
      name: 'rosters_id_seq',
      startWith: 1,
      increment: 1,
      minValue: 1,
      cache: 1,
    }),
    organizationId: uuid('organization_id')
      .notNull()
      .references(() => organizations.id, {
        onDelete: 'cascade',
        onUpdate: 'cascade',
      }),
    dutyDate: date('duty_date').notNull().unique(),
    isExtra: boolean('is_extra').default(false).notNull(),
    dutyPersonnelId: uuid('duty_personnel_id').references(() => profiles.id, {
      onDelete: 'cascade',
      onUpdate: 'cascade',
    }),
    reserveDutyPersonnelId: uuid('reserve_duty_personnel_id').references(
      () => profiles.id,
      { onDelete: 'cascade', onUpdate: 'cascade' }
    ),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' })
      .defaultNow()
      .$onUpdate(() => sql`CURRENT_TIMESTAMP`),
  },
  (table) => [
    index('rosters_multi_idx').using(
      'btree',
      table.organizationId.asc().nullsLast().op('uuid_ops'),
      table.dutyPersonnelId.asc().nullsLast().op('uuid_ops'),
      table.reserveDutyPersonnelId.asc().nullsLast().op('uuid_ops')
    ),
  ]
);

export const swapRequests = pgTable(
  'swap_requests',
  {
    id: bigint({ mode: 'number' }).primaryKey().generatedByDefaultAsIdentity({
      name: 'swap_requests_id_seq',
      startWith: 1,
      increment: 1,
      minValue: 1,
      cache: 1,
    }),
    receiverId: uuid('receiver_id')
      .notNull()
      .references(() => profiles.id, {
        onDelete: 'cascade',
        onUpdate: 'cascade',
      }),
    requesterId: uuid('requester_id')
      .notNull()
      .references(() => profiles.id, {
        onDelete: 'cascade',
        onUpdate: 'cascade',
      }),
    reason: text(),
    organizationId: uuid('organization_id')
      .notNull()
      .references(() => organizations.id, {
        onDelete: 'cascade',
        onUpdate: 'cascade',
      }),
    receiverRosterId: bigint('receiver_roster_id', {
      mode: 'number',
    })
      .notNull()
      .references(() => rosters.id, {
        onDelete: 'cascade',
        onUpdate: 'cascade',
      }),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    requesterRosterId: bigint('requester_roster_id', {
      mode: 'number',
    })
      .notNull()
      .references(() => rosters.id, {
        onDelete: 'cascade',
        onUpdate: 'cascade',
      }),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' })
      .defaultNow()
      .$onUpdate(() => sql`CURRENT_TIMESTAMP`),
  },
  (table) => [
    index('swap_requests_multi_idx').using(
      'btree',
      table.organizationId.asc().nullsLast().op('uuid_ops'),
      table.requesterId.asc().nullsLast().op('uuid_ops'),
      table.receiverId.asc().nullsLast().op('uuid_ops'),
      table.receiverRosterId.asc().nullsLast().op('int8_ops'),
      table.requesterRosterId.asc().nullsLast().op('int8_ops')
    ),
    unique(
      'swap_requests_organization_id_requester_id_receiver_roster_id_key'
    ).on(table.receiverId, table.organizationId, table.receiverRosterId),
    unique(
      'swap_requests_organization_id_requester_id_requester_roster_id_key'
    ).on(table.requesterId, table.organizationId, table.requesterRosterId),
  ]
);

export const notifications = pgTable(
  'notifications',
  {
    id: bigint({ mode: 'number' }).primaryKey().generatedByDefaultAsIdentity({
      name: 'notifications_id_seq',
      startWith: 1,
      increment: 1,
      minValue: 1,
      cache: 1,
    }),
    organizationId: uuid('organization_id')
      .notNull()
      .references(() => organizations.id, {
        onDelete: 'cascade',
        onUpdate: 'cascade',
      }),
    dutyPersonnelId: uuid('duty_personnel_id')
      .notNull()
      .references(() => profiles.id, {
        onDelete: 'cascade',
        onUpdate: 'cascade',
      }),
    title: text().notNull(),
    message: text().notNull(),
    isRead: boolean('is_read').default(false).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' })
      .defaultNow()
      .$onUpdate(() => sql`CURRENT_TIMESTAMP`),
  },
  (table) => [
    index('notifications_multi_idx').using(
      'btree',
      table.organizationId.asc().nullsLast().op('uuid_ops'),
      table.dutyPersonnelId.asc().nullsLast().op('uuid_ops')
    ),
  ]
);

export const pushSubscriptions = pgTable(
  'push_subscriptions',
  {
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    id: bigint({ mode: 'number' }).primaryKey().generatedByDefaultAsIdentity({
      name: 'push_subscriptions_id_seq',
      startWith: 1,
      increment: 1,
      minValue: 1,
      cache: 1,
    }),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' })
      .defaultNow()
      .$onUpdate(() => sql`CURRENT_TIMESTAMP`),
    userId: uuid('user_id')
      .notNull()
      .unique()
      .references(() => users.id, {
        onDelete: 'cascade',
        onUpdate: 'cascade',
      }),
    pushSubscriptionDetails: jsonb('push_subscription_details').notNull(),
  },
  (table) => [
    index('push_subscriptions_user_id_idx').using(
      'btree',
      table.userId.asc().nullsLast().op('uuid_ops')
    ),
  ]
);
