import { useCallback, useState } from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";
import { match } from "ts-pattern";

import type { Deck } from "./deck";
import { renameDeck, type RenameDeckCapabilities } from "./use-cases/rename-deck";

interface RenameDeckFormProps extends RenameDeckCapabilities {
  readonly deck: Deck;
  readonly onRenamed: () => Promise<void>;
}

function RenameDeckForm({ deck, deckFinder, deckSaver, clock, onRenamed }: RenameDeckFormProps) {
  const [name, setName] = useState(deck.name);
  const [nameError, setNameError] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isRenaming, setIsRenaming] = useState(false);

  const handleRenameDeck = useCallback(async () => {
    setIsRenaming(true);
    setNameError(null);
    setErrorMessage(null);

    try {
      const result = await renameDeck({ id: deck.id, name }, { deckFinder, deckSaver, clock });

      return match(result)
        .with({ type: "success" }, async ({ deck: renamedDeck }) => {
          setName(renamedDeck.name);
          await onRenamed();
        })
        .with({ type: "invalidName" }, ({ message }) => {
          setNameError(message);
        })
        .with({ type: "deckNotFound" }, () => {
          setErrorMessage("This deck no longer exists.");
        })
        .with({ type: "saveFailed" }, () => {
          setErrorMessage("Could not rename deck.");
        })
        .exhaustive();
    } catch {
      setErrorMessage("Could not rename deck.");
    } finally {
      setIsRenaming(false);
    }
  }, [clock, deck.id, deckFinder, deckSaver, name, onRenamed]);

  return (
    <View style={styles.container}>
      <TextInput
        accessibilityLabel={`Deck name for ${deck.name}`}
        editable={!isRenaming}
        onChangeText={(updatedName) => {
          setName(updatedName);
          setNameError(null);
        }}
        onSubmitEditing={() => void handleRenameDeck()}
        style={styles.nameInput}
        value={name}
      />
      {nameError ? <Text>{nameError}</Text> : null}
      {errorMessage ? <Text>{errorMessage}</Text> : null}
      <Button disabled={isRenaming} onPress={() => void handleRenameDeck()} title="Rename deck" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  nameInput: {
    borderColor: "#888",
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
});

export { RenameDeckForm };
export type { RenameDeckFormProps };
