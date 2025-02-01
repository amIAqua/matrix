CREATE TABLE "events" (
	"id" uuid DEFAULT gen_random_uuid(),
	"title" varchar(256),
	"description" varchar(496),
	"creatorId" uuid,
	"dateTime" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "guestsToEvents" (
	"guestId" uuid,
	"eventId" uuid,
	CONSTRAINT "guestsToEvents_guestId_eventId_pk" PRIMARY KEY("guestId","eventId")
);
