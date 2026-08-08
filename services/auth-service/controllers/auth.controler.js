import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../Databases/UserDB.config.js';
import { generateOtp } from '../utils/generateOTP.js';
import { sendOTP } from '../services/email.service.js';

function createAuthToken(user) {
	return jwt.sign(
		{
			email: user.email,
			username: user.username,
		},
		process.env.JWT_SECRET || 'orbital-dev-secret',
		{ expiresIn: '7d' }
	);
}

function getAuthCookieOptions() {
	return {
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
		maxAge: 7 * 24 * 60 * 60 * 1000,
		path: '/',
	};
}

async function register(request, response) {
	try {
		const { email, username, password } = request.body;

		if (!email || !username || !password) {
			return response.status(400).json({
				message: 'Email, username, and password are required.',
			});
		}

		const existingUser = await pool.query('SELECT email FROM "user" WHERE email = $1', [email]);

		if (existingUser.rows.length > 0) {
			return response.status(409).json({
				message: 'User already exists.',
			});
		}

		const passwordHash = await bcrypt.hash(password, 10);
		const otp = generateOtp();

		const result = await pool.query(
			`INSERT INTO "user" (email, username, passwordHash, otp)
			 VALUES ($1, $2, $3, $4)
			 RETURNING email, username, created_at, is_verified`,
			[email, username, passwordHash, otp]
		);

		await sendOTP(email, otp);

		const token = createAuthToken(result.rows[0]);
		response.cookie('token', token, getAuthCookieOptions());

		return response.status(201).json({
			message: 'User registered. Verification email sent.',
			token,
			user: result.rows[0],
		});
	} catch (error) {
		return response.status(500).json({
			message: 'Failed to register user.',
			error: error.message,
		});
	}
}

async function verifyEmail(request, response) {
	try {
		const { email, otp } = request.body;

		if (!email || !otp) {
			return response.status(400).json({
				message: 'Email and OTP are required.',
			});
		}

		const userResult = await pool.query(
			'SELECT email, otp, is_verified FROM "user" WHERE email = $1',
			[email]
		);

		const user = userResult.rows[0];

		if (!user) {
			return response.status(404).json({
				message: 'User not found.',
			});
		}

		if (user.is_verified) {
			return response.status(200).json({
				message: 'Email already verified.',
			});
		}

		if (user.otp !== otp) {
			return response.status(400).json({
				message: 'Invalid OTP.',
			});
		}

		const result = await pool.query(
			`UPDATE "user"
			 SET is_verified = TRUE,
			     otp = NULL
			 WHERE email = $1
			 RETURNING email, username, created_at, is_verified`,
			[email]
		);

		return response.status(200).json({
			message: 'Email verified successfully.',
			user: result.rows[0],
		});
	} catch (error) {
		return response.status(500).json({
			message: 'Failed to verify email.',
			error: error.message,
		});
	}
}

async function login(request, response) {
	try {
		const { email, password } = request.body;

		if (!email || !password) {
			return response.status(400).json({
				message: 'Email and password are required.',
			});
		}

		const result = await pool.query(
			'SELECT email, username, passwordHash, is_verified FROM "user" WHERE email = $1',
			[email]
		);

		const user = result.rows[0];

		if (!user) {
			return response.status(404).json({
				message: 'User not found.',
			});
		}

		if (!user.is_verified) {
			return response.status(403).json({
				message: 'Please verify your email first.',
			});
		}

		const isPasswordValid = await bcrypt.compare(password, user.passwordhash || user.passwordHash);

		if (!isPasswordValid) {
			return response.status(401).json({
				message: 'Invalid credentials.',
			});
		}

		const token = createAuthToken(user);
		response.cookie('token', token, getAuthCookieOptions());

		return response.status(200).json({
			message: 'Login successful.',
			token,
			user: {
				email: user.email,
				username: user.username,
			},
		});
	} catch (error) {
		return response.status(500).json({
			message: 'Failed to login.',
			error: error.message,
		});
	}
}

async function resendVerificationCode(request, response) {
	try {
		const { email } = request.body;

		if (!email) {
			return response.status(400).json({
				message: 'Email is required.',
			});
		}

		const userResult = await pool.query(
			'SELECT email, is_verified FROM "user" WHERE email = $1',
			[email]
		);

		const user = userResult.rows[0];

		if (!user) {
			return response.status(404).json({
				message: 'User not found.',
			});
		}

		if (user.is_verified) {
			return response.status(200).json({
				message: 'Email already verified.',
			});
		}

		const otp = generateOtp();

		await pool.query(
			'UPDATE "user" SET otp = $1 WHERE email = $2',
			[otp, email]
		);

		await sendOTP(email, otp);

		return response.status(200).json({
			message: 'Verification code sent again.',
		});
	} catch (error) {
		return response.status(500).json({
			message: 'Failed to resend verification code.',
			error: error.message,
		});
	}
}

export {
	login,
	register,
	resendVerificationCode,
	verifyEmail,
};
