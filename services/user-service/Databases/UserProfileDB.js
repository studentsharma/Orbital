import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

const connectionString =
    process.env.USER_PROFILE_SERVICE_URL;

if (!connectionString) {
    throw new Error(
        "Missing PostgreSQL connection string. Set USER_PROFILE_SERVICE_URL or DATABASE_URL in .env."
    );
}

const pool = new Pool({
    connectionString,
    ssl: {
        rejectUnauthorized: false,
    },
});
const dbUrl = new URL(connectionString);

console.log("DB HOST:", dbUrl.hostname);
console.log("DB PORT:", dbUrl.port);
console.log("DB DATABASE:", dbUrl.pathname);
export default pool;