DROP TABLE "guests_to_event" CASCADE;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "guestIds" varchar(100)[] DEFAULT '{}';