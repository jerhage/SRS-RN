import { useCallback, useState } from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";
import { match } from "ts-pattern";

import type { IdGenerator } from "../identity/id-generator";
import type { Clock } from "../time/timestamp";
import { createAndSaveDeck } from "./create-new-deck";
import { deckNameSchema } from "./deck";
import type { DeckRepository } from "./deck-repository";

interface CreateDeckFormProps extends CreateDeckDependencies {
  readonly onCreated: () => Promise<void>;
}

interface CreateDeckDependencies {
  readonly decks: DeckRepository;
  readonly clock: Clock;
  readonly idGenerator: IdGenerator;
}

function CreateDeckForm({ decks, clock, idGenerator, onCreated }: CreateDeckFormProps) {
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const createDeck = useCallback(async () => {
    const parsedName = deckNameSchema.safeParse(name);

    return match(parsedName)
      .with({ success: false }, ({ error }) => {
        setNameError(error.issues[0]?.message ?? "Enter a deck name.");
      })
      .with({ success: true }, async ({ data: validName }) => {
        setIsCreating(true);
        setNameError(null);
        setErrorMessage(null);

        try {
          await createAndSaveDeck(validName, { decks, clock, idGenerator });
          await onCreated();
          setName("");
        } catch {
          setErrorMessage("Could not create deck.");
        } finally {
          setIsCreating(false);
        }
      })
      .exhaustive();
  }, [clock, decks, idGenerator, name, onCreated]);

  return (
    <View style={styles.container}>
      <TextInput
        accessibilityLabel="Deck name"
        editable={!isCreating}
        onChangeText={(updatedName) => {
          setName(updatedName);
          setNameError(null);
        }}
        onSubmitEditing={() => void createDeck()}
        placeholder="New deck name"
        style={styles.nameInput}
        value={name}
      />
      {nameError ? <Text>{nameError}</Text> : null}
      {errorMessage ? <Text>{errorMessage}</Text> : null}
      <Button disabled={isCreating} onPress={() => void createDeck()} title="Create deck" />
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

export { CreateDeckForm };
export type { CreateDeckDependencies, CreateDeckFormProps };
