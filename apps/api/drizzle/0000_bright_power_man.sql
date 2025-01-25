CREATE TABLE "users" (
	"id" uuid DEFAULT gen_random_uuid(),
	"name" varchar(100) NOT NULL,
	"surname" varchar(100) NOT NULL,
	"email" varchar(255) NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
