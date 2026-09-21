ALTER TABLE "post_user_votes" RENAME CONSTRAINT "post_user_vote_unique" TO "post_user_vote_type_unique";--> statement-breakpoint
ALTER TABLE "post_user_votes" DROP CONSTRAINT "post_user_vote_type_unique";--> statement-breakpoint
ALTER TABLE "post_user_votes" ADD CONSTRAINT "post_user_vote_type_unique" UNIQUE("post_id","user_id","vote_type");