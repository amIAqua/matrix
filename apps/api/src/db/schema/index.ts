import { sql, relations } from 'drizzle-orm';
import { pgTable, varchar, uuid, timestamp, text } from 'drizzle-orm/pg-core';

export const sessionsTable = pgTable('sessions', {
    id: uuid().default(sql`gen_random_uuid()`),
    key: text().notNull(),
    userId: uuid().notNull(),
    expiresIn: timestamp().notNull(),
});

export const usersTable = pgTable('users', {
    id: uuid().default(sql`gen_random_uuid()`),
    name: varchar({ length: 100 }).notNull(),
    surname: varchar({ length: 100 }).notNull(),
    email: varchar({ length: 255 }).notNull().unique(),
    hashedPassword: varchar({ length: 100 }).notNull(),
    avatarUrl: text().default(''),
    createdAt: timestamp({ mode: 'string' })
        .default(sql`now()`)
        .notNull(),
});

export const usersTableRelations = relations(usersTable, ({ many }) => ({
    events: many(eventsTable),
}));

export const eventsTable = pgTable('events', {
    id: uuid().default(sql`gen_random_uuid()`),
    title: varchar({ length: 256 }),
    description: varchar({ length: 496 }),
    creatorId: uuid(),
    dateTime: timestamp({ mode: 'string' }).notNull(),
    guestIds: varchar({ length: 100 }).array().default([]),
});
