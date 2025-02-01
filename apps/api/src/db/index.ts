import { drizzle } from 'drizzle-orm/node-postgres';
import { appConfig } from 'src/app/config';

export const db = drizzle(appConfig.DATABASE_URL);

export { usersTable, eventsTable } from 'src/db/schema';
