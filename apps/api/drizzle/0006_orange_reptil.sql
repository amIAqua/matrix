CREATE TABLE "guests_to_event" (
	"guestId" uuid,
	"eventId" uuid,
	CONSTRAINT "guests_to_event_guestId_eventId_pk" PRIMARY KEY("guestId","eventId")
);
--> statement-breakpoint
ALTER TABLE "guestsToEvents" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "guestsToEvents" CASCADE;--> statement-breakpoint
ALTER TABLE "events" ALTER COLUMN "dateTime" DROP DEFAULT;