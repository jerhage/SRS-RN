import * as SQLite from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { migrate } from 'drizzle-orm/expo-sqlite/migrator';

import migrations from '../../../drizzle/migrations';

import { createSrsDataStore, type SrsDataStore } from './srs-data-store';

const SRS_DATABASE_NAME = 'srs.db';

/**
 * Opens the persistent SQLite database, applies committed Drizzle migrations,
 * and returns the repository capabilities used by the study feature.
 *
 * Call this once at application startup, before rendering feature screens.
 */
async function openSrsDataStore(): Promise<SrsDataStore> {
  const database = SQLite.openDatabaseSync(SRS_DATABASE_NAME);
  await database.execAsync('PRAGMA foreign_keys = ON; PRAGMA journal_mode = WAL;');
  await migrate(drizzle(database), migrations);
  return createSrsDataStore(database);
}

export { openSrsDataStore, SRS_DATABASE_NAME };
