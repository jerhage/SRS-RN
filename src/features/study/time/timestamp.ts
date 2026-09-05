/** UTC milliseconds since the Unix epoch. */
type Timestamp = number;

/** Supplies time to pure application logic. */
interface Clock {
  now(): Timestamp;
}

export type { Clock, Timestamp };
