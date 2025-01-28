import { sql } from 'drizzle-orm';
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
    createdAt: timestamp()
        .default(sql`now()`)
        .notNull(),
});
