import { resolve } from 'node:path';
import { type Config, defineConfig } from 'drizzle-kit';
import { keys } from './keys';

const baseConfig = {
  dialect: 'postgresql',
  casing: 'snake_case',
  dbCredentials: {
    url: keys().DATABASE_URL,
  },
} satisfies Config;

// To be used in applications, it needs absolute paths to schema and migrations.
export function createDatabaseConfig(): Config {
  return defineConfig({
    ...baseConfig,
    schema: resolve(__dirname, './schema.ts'),
    out: resolve(__dirname, './drizzle'),
  });
}

// To be used in this library, it needs relative paths from project.json to schema and migrations.
export default defineConfig({
  ...baseConfig,
  schema: './schema.ts',
  out: './drizzle',
  verbose: true,
  strict: true,
});
