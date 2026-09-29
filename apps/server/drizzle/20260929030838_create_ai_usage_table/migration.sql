CREATE TABLE "ai-usage" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "ai-usage_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"user_id" integer NOT NULL,
	"usageJSON" json NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "ai-usage" ADD CONSTRAINT "ai-usage_user_id_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id");