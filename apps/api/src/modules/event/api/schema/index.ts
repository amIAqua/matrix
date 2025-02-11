import * as Schema from 'effect/Schema';

const EventGuestSchema = Schema.Struct({
    id: Schema.NonEmptyString,
    name: Schema.NonEmptyString,
}).pipe(Schema.annotations({ identifier: 'EventGuestSchema' }));

const EventSchema = Schema.Struct({
    id: Schema.NonEmptyString,
    title: Schema.optional(Schema.String),
    description: Schema.optional(Schema.String),
    dateTime: Schema.NonEmptyString,
    creatorId: Schema.NonEmptyString,
    guests: Schema.Array(EventGuestSchema),
}).pipe(Schema.annotations({ identifier: 'EventSchema' }));

type DeepMutable<T> = {
    -readonly [P in keyof T]: T[P] extends object
        ? DeepMutable<T[P]>
        : T[P] extends ReadonlyArray<infer U>
          ? Array<DeepMutable<U>>
          : T[P];
};

export type EventGuest = DeepMutable<
    Schema.Schema.Type<typeof EventGuestSchema>
>;
export type Event = DeepMutable<Schema.Schema.Type<typeof EventSchema>>;
