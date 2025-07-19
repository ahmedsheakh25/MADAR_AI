CREATE TABLE "generation_usage" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"style_used" text,
	"prompt_used" text,
	"uploaded_image_used" text,
	"colors_used" text[],
	"generated_image_url" text,
	"success" boolean DEFAULT true,
	"error_message" text,
	"timestamp" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "role" varchar(20) DEFAULT 'user';--> statement-breakpoint
ALTER TABLE "generation_usage" ADD CONSTRAINT "generation_usage_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;