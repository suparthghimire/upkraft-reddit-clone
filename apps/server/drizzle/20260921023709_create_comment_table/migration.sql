CREATE TABLE "comment" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "comment_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"post_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"text" text NOT NULL,
	"parent_comment_id" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE INDEX "comment_post_id_idx" ON "comment" ("post_id");--> statement-breakpoint
CREATE INDEX "comment_parent_comment_id_idx" ON "comment" ("parent_comment_id");--> statement-breakpoint
CREATE INDEX "comment_user_id_idx" ON "comment" ("user_id");--> statement-breakpoint
ALTER TABLE "comment" ADD CONSTRAINT "comment_post_id_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "post"("id");--> statement-breakpoint
ALTER TABLE "comment" ADD CONSTRAINT "comment_user_id_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id");--> statement-breakpoint
ALTER TABLE "comment" ADD CONSTRAINT "comment_parent_comment_id_comment_id_fkey" FOREIGN KEY ("parent_comment_id") REFERENCES "comment"("id");