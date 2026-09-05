import { z } from "zod/v4";

const deckIdSchema = z.string().min(1);
const deckNameSchema = z.string().trim().min(1, "A deck must have a name.");
const deckSchema = z
  .object({
    id: deckIdSchema,
    name: deckNameSchema,
    parentId: deckIdSchema.optional(),
    createdAt: z.number().int().nonnegative(),
    updatedAt: z.number().int().nonnegative(),
    isArchived: z.boolean(),
  })
  .refine((deck) => deck.parentId !== deck.id, {
    message: "A deck cannot be its own parent.",
    path: ["parentId"],
  });

function parseDeck(value: unknown): Deck {
  return deckSchema.parse(value);
}

type DeckId = z.output<typeof deckIdSchema>;
type Deck = z.output<typeof deckSchema>;

export { deckIdSchema, deckNameSchema, deckSchema, parseDeck };
export type { Deck, DeckId };
