import postgres from 'postgres';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function runMigration() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error('❌ DATABASE_URL environment variable is required');
    process.exit(1);
  }

  const sql = postgres(databaseUrl);

  try {
    const migrationPath = join(__dirname, '..', 'migrations', 'create_order_refunds_table.sql');
    const migrationSQL = readFileSync(migrationPath, 'utf8');

    console.log('📋 Running migration: create_order_refunds_table.sql');

    // Execute the migration
    await sql.unsafe(migrationSQL);

    console.log('✅ Migration completed successfully');
    console.log('✅ Table "order_refunds" created with indexes');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

runMigration();
