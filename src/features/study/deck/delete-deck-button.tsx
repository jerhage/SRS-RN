import { useCallback, useState } from "react";
import { Button, Text, View } from "react-native";
import { match } from "ts-pattern";

import type { DeckId } from "./deck";
import { deleteDeck, type DeleteDeckCapabilities } from "./use-cases/delete-deck";

interface DeleteDeckButtonProps extends DeleteDeckCapabilities {
  readonly deckId: DeckId;
  readonly onDeleted: () => Promise<void>;
}

function DeleteDeckButton({ deckId, deckRemover, onDeleted }: DeleteDeckButtonProps) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteDeck = useCallback(async () => {
    setIsDeleting(true);
    setErrorMessage(null);

    try {
      const result = await deleteDeck(deckId, { deckRemover });

      return match(result)
        .with({ type: "success" }, onDeleted)
        .with({ type: "deleteFailed" }, () => {
          setErrorMessage("Could not delete deck.");
        })
        .exhaustive();
    } catch {
      setErrorMessage("Could not delete deck.");
    } finally {
      setIsDeleting(false);
    }
  }, [deckId, deckRemover, onDeleted]);

  return (
    <View>
      {errorMessage ? <Text>{errorMessage}</Text> : null}
      <Button disabled={isDeleting} onPress={() => void handleDeleteDeck()} title="Delete deck" />
    </View>
  );
}

export { DeleteDeckButton };
export type { DeleteDeckButtonProps };
