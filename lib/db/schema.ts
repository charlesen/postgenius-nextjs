import {
  pgTable,
  serial,
  varchar,
  text,
  timestamp,
  integer,
} from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  role: varchar('role', { length: 20 }).notNull().default('member'),
  stripeCustomerId: text('stripe_customer_id').unique(),
  stripeSubscriptionId: text('stripe_subscription_id').unique(),
  stripeProductId: text('stripe_product_id'),
  planName: varchar('plan_name', { length: 50 }),
  subscriptionStatus: varchar('subscription_status', { length: 20 }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  deletedAt: timestamp('deleted_at'),
});

export const generations = pgTable('generations', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id),
  prompt: text('prompt').notNull(),
  result: text('result').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const activityLogs = pgTable('activity_logs', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id),
  action: varchar('action', { length: 100 }).notNull(),
  ipAddress: varchar('ip_address', { length: 45 }),
  timestamp: timestamp('timestamp').notNull().defaultNow(),
});

export type ActivityLog = typeof activityLogs.$inferSelect;
export type NewActivityLog = typeof activityLogs.$inferInsert;

export enum ActivityType {
  SIGN_UP = 'SIGN_UP',
  SIGN_IN = 'SIGN_IN',
  SIGN_OUT = 'SIGN_OUT',
  UPDATE_PASSWORD = 'UPDATE_PASSWORD',
  DELETE_ACCOUNT = 'DELETE_ACCOUNT',
  UPDATE_ACCOUNT = 'UPDATE_ACCOUNT',
}

export const linkedinPosts = pgTable('linkedin_posts', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id),
  topic: text('topic').notNull(),
  tone: text('tone'),
  audience: text('audience'),
  content: text('content').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export type LinkedInPost = typeof linkedinPosts.$inferSelect;
export type NewLinkedInPost = typeof linkedinPosts.$inferInsert;



export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Generation = typeof generations.$inferSelect;
export type NewGeneration = typeof generations.$inferInsert;
