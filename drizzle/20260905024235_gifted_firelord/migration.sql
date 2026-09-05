CREATE TABLE `card` (
	`id` text PRIMARY KEY,
	`note_id` text NOT NULL,
	`deck_id` text NOT NULL,
	`ordinal` integer NOT NULL,
	`prompt` text NOT NULL,
	`answer` text NOT NULL,
	`phase` text NOT NULL,
	`due_at` integer NOT NULL,
	`interval_days` integer NOT NULL,
	`ease_factor` real NOT NULL,
	`repetitions` integer NOT NULL,
	`lapses` integer NOT NULL,
	`is_suspended` integer DEFAULT false NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	CONSTRAINT `fk_card_note_id_note_id_fk` FOREIGN KEY (`note_id`) REFERENCES `note`(`id`),
	CONSTRAINT `fk_card_deck_id_deck_id_fk` FOREIGN KEY (`deck_id`) REFERENCES `deck`(`id`)
);
--> statement-breakpoint
CREATE TABLE `deck` (
	`id` text PRIMARY KEY,
	`name` text NOT NULL,
	`parent_id` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`is_archived` integer DEFAULT false NOT NULL,
	CONSTRAINT `fk_deck_parent_id_deck_id_fk` FOREIGN KEY (`parent_id`) REFERENCES `deck`(`id`)
);
--> statement-breakpoint
CREATE TABLE `note` (
	`id` text PRIMARY KEY,
	`deck_id` text NOT NULL,
	`fields_json` text NOT NULL,
	`tags_json` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`is_archived` integer DEFAULT false NOT NULL,
	CONSTRAINT `fk_note_deck_id_deck_id_fk` FOREIGN KEY (`deck_id`) REFERENCES `deck`(`id`)
);
--> statement-breakpoint
CREATE TABLE `review_log` (
	`id` text PRIMARY KEY,
	`card_id` text NOT NULL,
	`reviewed_at` integer NOT NULL,
	`rating` text NOT NULL,
	`elapsed_milliseconds` integer NOT NULL,
	`previous_phase` text NOT NULL,
	`previous_due_at` integer NOT NULL,
	`previous_interval_days` integer NOT NULL,
	`previous_ease_factor` real NOT NULL,
	`previous_repetitions` integer NOT NULL,
	`previous_lapses` integer NOT NULL,
	CONSTRAINT `fk_review_log_card_id_card_id_fk` FOREIGN KEY (`card_id`) REFERENCES `card`(`id`)
);
--> statement-breakpoint
CREATE UNIQUE INDEX `card_note_ordinal` ON `card` (`note_id`,`ordinal`);--> statement-breakpoint
CREATE INDEX `card_due` ON `card` (`deck_id`,`is_suspended`,`due_at`);--> statement-breakpoint
CREATE INDEX `card_note_id` ON `card` (`note_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `deck_parent_name` ON `deck` (`parent_id`,`name`);--> statement-breakpoint
CREATE INDEX `note_deck_id` ON `note` (`deck_id`);--> statement-breakpoint
CREATE INDEX `review_log_card_reviewed_at` ON `review_log` (`card_id`,`reviewed_at`);