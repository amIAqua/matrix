import * as iron from 'iron-webcrypto';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { getCookie } from 'hono/cookie';
import { createMiddleware } from 'hono/factory';
import { sessionsTable } from 'src/db/schema';
import { sql } from 'drizzle-orm';

type SessionStore = {
    db: NodePgDatabase;
};

type SessionOptions = {
    store: SessionStore;
    sessionCookieName: string;
    encryptionKey?: string;
};

export async function encrypt(
    key: string,
    payload: object | string,
): Promise<string> {
    return await iron.seal(globalThis.crypto, payload, key, iron.defaults);
}

export async function decrypt(
    password: string,
    encrypted: string,
): Promise<unknown> {
    return await iron.unseal(
        globalThis.crypto,
        encrypted,
        { default: password },
        iron.defaults,
    );
}

export const sessionMiddleware = (options: SessionOptions) => {
    const store = options.store;
    const encryptionKey = options.encryptionKey;
    const sessionCookieName = options.sessionCookieName;

    console.log({
        sessionCookieName,
        encryptionKey,
    });

    if (!sessionCookieName) {
        throw new Error('option `sessionCookieName` is required!');
    }

    if (!encryptionKey) {
        throw new Error('option `encryptionKey` is required!');
    }

    const middleware = createMiddleware(async (ctx, next) => {
        const sessionCookie = getCookie(ctx, sessionCookieName);
        const sessionId = await decrypt(sessionCookieName, encryptionKey);

        let session: any;
        if (sessionCookie) {
            const sessionData = await store.db
                .select()
                .from(sessionsTable)
                .where(sql`${sessionsTable.id} = ${sessionId}`);

            const isSessionValid =
                sessionData && sessionData[0]
                    ? sessionData[0].expiresIn.toISOString() >
                      new Date().toISOString()
                    : false;

            if (isSessionValid) {
                const userIdFromSession = sessionData[0].userId;

                // get user by id from session
                // ....

                session = {
                    id: sessionData[0].id,
                    user: {},
                };

                ctx.set('session', session);
            } else {
                await store.db
                    .delete(sessionsTable)
                    .where(sql`${sessionsTable.id} = ${sessionId}`);
            }
        } else {
            throw new Error('sessionCookie does not exist');
        }

        await next();
    });

    return middleware;
};

// if (createNewSession) {
//   const defaultData = {
//     _data:{},
//     _expire: null,
//     _delete: false,
//     _accessed: null,
//   }

// if (!(store instanceof CookieStore)) {
//   setCookie(c, sessionCookieName, encryptionKey ? await encrypt(encryptionKey, sid) : sid, cookieOptions)
// }

// session.updateAccess()

// c.set('session', session)

// await next()

// const shouldDelete = session.getCache()._delete;
// const shouldRotateSessionKey = c.get("session_key_rotation") === true;
// const storeIsCookieStore = store instanceof CookieStore;

// if (shouldDelete) {
//   store instanceof CookieStore
//     ? await store.deleteSession(c)
//     : await store.deleteSession(sid);
// }

/*
 * Only update session data if we didn't just delete it.
 * If session key rotation is enabled and the store is not a CookieStore,
 * we need to roate the session key by deleting the old session and creating a new one.
 */
// const shouldRecreateSessionForNonCookieStore =
//   !shouldDelete &&
//   !storeIsCookieStore &&
//   shouldRotateSessionKey;

// if (shouldRecreateSessionForNonCookieStore) {
//   await store.deleteSession(sid);
//   sid = globalThis.crypto.randomUUID();
//   await store.createSession(sid, session.getCache());

//   setCookie(
//     c,
//     sessionCookieName,
//     encryptionKey ? await encrypt(encryptionKey, sid) : sid,
//     cookieOptions
//   );
