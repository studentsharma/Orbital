import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { readFile } from 'node:fs/promises';
import pool from './Databases/UserProfileDB.js';
import userRoutes from './routes/user.route.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5002;
const userProfileMigrationPath = new URL('./migrations/001_userProfile_migration.sql', import.meta.url);
const followersMigrationPath = new URL('./migrations/002_followersTable_create.sql', import.meta.url);

app.use(cors({
	origin: true,
	credentials: true,
}));
app.use(cookieParser());
app.use(express.json());
app.use('/api/user', userRoutes);


app.get('/', (request, response) => {
	response.json({ message: 'User service is running' });
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

const runMigrations = async () => {
    // const migrationSql = await readFile(followersMigrationPath, 'utf8');
    // await pool.query(migrationSql);
	const migrationFiles = [userProfileMigrationPath, followersMigrationPath];

	for (const migrationFile of migrationFiles) {
		const migrationSql = await readFile(migrationFile, 'utf8');
		await pool.query(migrationSql);
	}
};

const startServer = async () => {
	app.listen(port, '0.0.0.0', () => {
		console.log(`User service running on port ${port}`);
	});

	runMigrations().catch((error) => {
		console.error('Failed to run migrations:', error);
	});
};

startServer();
