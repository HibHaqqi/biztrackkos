import postgres from 'postgres';

let sql: postgres.Sql | null = null;

if (process.env.DATABASE_URL) {
  sql = postgres(process.env.DATABASE_URL);
} else {
  console.warn("DATABASE_URL environment variable is not set. Database queries will be disabled.");
}

export default sql;
