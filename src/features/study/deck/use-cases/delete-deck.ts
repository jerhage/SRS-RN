import type { DeckId } from "../deck";
import type { DeckRemover } from "../deck-remover";

type DeleteDeckResult = { readonly type: "success" } | { readonly type: "deleteFailed" };

interface DeleteDeckCapabilities {
  readonly deckRemover: DeckRemover;
}

async function deleteDeck(
  id: DeckId,
  { deckRemover }: DeleteDeckCapabilities,
): Promise<DeleteDeckResult> {
  try {
    await deckRemover.delete(id);
    return { type: "success" };
  } catch {
    return { type: "deleteFailed" };
  }
}

export { deleteDeck };
export type { DeleteDeckCapabilities, DeleteDeckResult };
