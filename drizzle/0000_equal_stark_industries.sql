CREATE TABLE "project" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"image_url" text,
	"is_public" boolean NOT NULL,
	"url" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "project_description_unique" UNIQUE("description")
);
--> statement-breakpoint
CREATE TABLE "case_study" (
	"id" text PRIMARY KEY NOT NULL,
	"project_id" text NOT NULL,
	"overview" text,
	"problem" text NOT NULL,
	"solution" text NOT NULL,
	"implementation" text NOT NULL,
	"start_date" timestamp NOT NULL,
	"end_date" timestamp NOT NULL,
	"technologies" text[],
	"outcome" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "case_study_project_id_unique" UNIQUE("project_id")
);
--> statement-breakpoint
ALTER TABLE "case_study" ADD CONSTRAINT "case_study_project_id_project_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."project"("id") ON DELETE cascade ON UPDATE no action;