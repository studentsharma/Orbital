import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { readFile } from 'node:fs/promises';
import pool from './Databases/UserDB.config.js';
import authRoutes from './routes/user.route.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
const userTableMigrationPath = new URL('./migrations/001_create_user_table.sql', import.meta.url);

app.use(cors({
	origin: true,
	credentials: true,
}));
app.use(cookieParser());
app.use(express.json());
app.use('/api/auth', authRoutes);

app.get('/', (request, response) => {
	response.json({ message: 'Server is running' });
});

app.get('/api/health', async (request, response) => {
	try {
		const result = await pool.query('SELECT NOW() AS server_time');

		response.json({
			status: 'ok',
			database: 'connected',
			serverTime: result.rows[0].server_time,
		});
	} catch (error) {
		response.status(500).json({
			status: 'error',
			database: 'disconnected',
			message: error.message,
		});
	}
});

async function runMigrations() {
	const migrationSql = await readFile(userTableMigrationPath, 'utf8');
	await pool.query(migrationSql);
}

async function startServer() {
	try {
		await runMigrations();
		app.listen(port, '0.0.0.0', () => {
			console.log(`Server running on port ${port}`);
		});
	} catch (error) {
		console.error('Failed to run migrations:', error.message);
		process.exit(1);
	}
}

startServer();

