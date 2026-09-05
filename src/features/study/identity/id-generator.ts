/** Supplies stable identifiers to pure application logic. */
interface IdGenerator {
  generate(): string;
}

export type { IdGenerator };
