CREATE TABLE "guests_to_events" (
	"guestId" uuid NOT NULL,
	"eventId" uuid NOT NULL,
	CONSTRAINT "guests_to_events_guestId_eventId_pk" PRIMARY KEY("guestId","eventId")
);
--> statement-breakpoint
ALTER TABLE "events" ADD PRIMARY KEY ("id");--> statement-breakpoint
ALTER TABLE "events" ALTER COLUMN "id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD PRIMARY KEY ("id");--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "guests_to_events" ADD CONSTRAINT "guests_to_events_guestId_users_id_fk" FOREIGN KEY ("guestId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "guests_to_events" ADD CONSTRAINT "guests_to_events_eventId_events_id_fk" FOREIGN KEY ("eventId") REFERENCES "public"."events"("id") ON DELETE no action ON UPDATE no action;