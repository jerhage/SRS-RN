import { useCallback, useState } from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";
import { match } from "ts-pattern";

import {
  createDeck,
  type CreateDeckCapabilities,
} from "./use-cases/create-deck";

interface CreateDeckFormProps extends CreateDeckCapabilities {
  readonly onCreated: () => Promise<void>;
}

function CreateDeckForm({ deckSaver, clock, idGenerator, onCreated }: CreateDeckFormProps) {
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateDeck = useCallback(async () => {
    setIsCreating(true);
    setNameError(null);
    setErrorMessage(null);

    try {
      const result = await createDeck({ name }, { deckSaver, clock, idGenerator });

      return match(result)
        .with({ type: "success" }, async () => {
          await onCreated();
          setName("");
        })
        .with({ type: "invalidName" }, ({ message }) => {
          setNameError(message);
        })
        .with({ type: "saveFailed" }, () => {
          setErrorMessage("Could not create deck.");
        })
        .exhaustive();
    } catch {
      setErrorMessage("Could not create deck.");
    } finally {
      setIsCreating(false);
    }
  }, [clock, deckSaver, idGenerator, name, onCreated]);

  return (
    <View style={styles.container}>
      <TextInput
        accessibilityLabel="Deck name"
        editable={!isCreating}
        onChangeText={(updatedName) => {
          setName(updatedName);
          setNameError(null);
        }}
        onSubmitEditing={() => void handleCreateDeck()}
        placeholder="New deck name"
        style={styles.nameInput}
        value={name}
      />
      {nameError ? <Text>{nameError}</Text> : null}
      {errorMessage ? <Text>{errorMessage}</Text> : null}
      <Button disabled={isCreating} onPress={() => void handleCreateDeck()} title="Create deck" />
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
export type { CreateDeckCapabilities, CreateDeckFormProps };
