import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

const connectionString =
    process.env.USER_DATABASE_URL || process.env.DATABASE_URL;

if (!connectionString) {
    throw new Error(
        "Missing PostgreSQL connection string. Set USER_DATABASE_URL or DATABASE_URL in .env."
    );
}

const pool = new Pool({
    connectionString,
    ssl: {
        rejectUnauthorized: false,
    },
});

export default pool;