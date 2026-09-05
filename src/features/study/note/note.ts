import { z } from "zod/v4";

import { deckIdSchema } from "../deck/deck";

const noteIdSchema = z.string().min(1);
const noteSchema = z.object({
  id: noteIdSchema,
  deckId: deckIdSchema,
  fields: z
    .record(z.string().trim().min(1, "Note field names cannot be blank."), z.string())
    .refine((fields) => Object.keys(fields).length > 0, "A note must contain at least one field."),
  tags: z.set(z.string().trim().min(1, "Tags cannot be blank.")),
  createdAt: z.number().int().nonnegative(),
  updatedAt: z.number().int().nonnegative(),
  isArchived: z.boolean(),
});

function parseNote(value: unknown): Note {
  return noteSchema.parse(value);
}

type NoteId = z.output<typeof noteIdSchema>;
type Note = z.output<typeof noteSchema>;

export { noteIdSchema, noteSchema, parseNote };
export type { Note, NoteId };
