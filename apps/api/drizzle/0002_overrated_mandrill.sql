CREATE TABLE "sessions" (
	"id" uuid DEFAULT gen_random_uuid(),
	"key" text NOT NULL,
	"userId" uuid NOT NULL,
	"expiresIn" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "createdAt" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "hashedPassword" varchar(100) NOT NULL;