import { sql, relations } from 'drizzle-orm';
import {
    pgTable,
    varchar,
    uuid,
    timestamp,
    text,
    primaryKey,
} from 'drizzle-orm/pg-core';

export const sessionsTable = pgTable('sessions', {
    id: uuid().default(sql`gen_random_uuid()`),
    key: text().notNull(),
    userId: uuid().notNull(),
    expiresIn: timestamp().notNull(),
});

export const usersTable = pgTable('users', {
    id: uuid()
        .default(sql`gen_random_uuid()`)
        .primaryKey(),
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
    guestsToEvents: many(guestsToEventsTable),
}));

export const eventsTable = pgTable('events', {
    id: uuid()
        .default(sql`gen_random_uuid()`)
        .primaryKey(),
    title: varchar({ length: 256 }),
    description: varchar({ length: 496 }),
    creatorId: uuid(),
    dateTime: timestamp({ mode: 'string' }).notNull(),
    guestIds: varchar({ length: 100 }).array().default([]),
});

export const eventsRelations = relations(eventsTable, ({ one, many }) => ({
    eventCreator: one(usersTable, {
        fields: [eventsTable.creatorId],
        references: [usersTable.id],
    }),
    guestsToEvents: many(guestsToEventsTable),
}));

export const guestsToEventsTable = pgTable(
    'guests_to_events',
    {
        guestId: uuid()
            .notNull()
            .references(() => usersTable.id),
        eventId: uuid()
            .notNull()
            .references(() => eventsTable.id),
    },
    (t) => [primaryKey({ columns: [t.guestId, t.eventId] })],
);

export const guestsToEventsRelations = relations(
    guestsToEventsTable,
    ({ one }) => ({
        event: one(eventsTable, {
            fields: [guestsToEventsTable.eventId],
            references: [eventsTable.id],
        }),
        guest: one(usersTable, {
            fields: [guestsToEventsTable.guestId],
            references: [usersTable.id],
        }),
    }),
);
