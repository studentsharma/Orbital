import pool from '../Databases/UserProfileDB.js';


const createUserProfile = async (request, response) => {
	try {
		const userId = request.userId;
		const { username, bio, avatarUrl } = request.body;

		if (!userId) {
			return response.status(401).json({
				message: 'Authentication is required.',
			});
		}

		if (!username) {
			return response.status(400).json({
				message: 'username is required.',
			});
		}

		const result = await pool.query(
			`INSERT INTO user_profiles (
				user_id,
				username,
				bio,
				avatar_url
			)
			VALUES ($1, $2, $3, $4)
			RETURNING
				user_id,
				username,
				bio,
				avatar_url,
				followers_count,
				following_count,
				posts_count,
				created_at,
				updated_at`,
			[userId, username, bio || null, avatarUrl || null]
		);

		return response.status(201).json({
			message: 'User profile created successfully.',
			user: result.rows[0],
		});
	} catch (error) {
		if (error.code === '23505') {
			return response.status(409).json({
				message: 'User profile already exists or username is already taken.',
			});
		}

		return response.status(500).json({
			message: 'Failed to create user profile.',
			error: error.message,
		});
	}
};


const getUser = async (request, response) => {
	try {
		const userId = request.userId;

		if (!userId) {
			return response.status(400).json({
				message: 'userId is required.',
			});
		}

		const result = await pool.query(
			`SELECT
				user_id,
				username,
				bio,
				avatar_url,
				followers_count,
				following_count,
				posts_count,
				created_at,
				updated_at
			 FROM user_profiles
			 WHERE user_id = $1`,
			[userId]
		);

		const user = result.rows[0];

		if (!user) {
			return response.status(404).json({
				message: 'User profile not found.',
			});
		}

		return response.status(200).json({
			message: 'User profile fetched successfully.',
			user,
		});
	} catch (error) {
		return response.status(500).json({
			message: 'Failed to fetch user profile.',
			error: error.message,
		});
	}
};


const getFollower = async (request, response) => {
	try {
		const userId = request.userId;

		if (!userId) {
			return response.status(400).json({
				message: 'userId is required.',
			});
		}

		const result = await pool.query(
			`SELECT
				up.user_id,
				up.username,
				up.bio,
				up.avatar_url,
				f.created_at AS followed_at
			 FROM follows f
			 INNER JOIN user_profiles up
			 	ON up.user_id = f.follower_id
			 WHERE f.following_id = $1
			 ORDER BY f.created_at DESC`,
			[userId]
		);

		return response.status(200).json({
			message: 'Followers fetched successfully.',
			userId,
			count: result.rows.length,
			followers: result.rows,
		});
	} catch (error) {
		return response.status(500).json({
			message: 'Failed to fetch followers.',
			error: error.message,
		});
	}
};


const getFollowing = async (request, response) => {
	try {
		const userId = request.userId;

		if (!userId) {
			return response.status(400).json({
				message: 'userId is required.',
			});
		}

		const result = await pool.query(
			`SELECT
				up.user_id,
				up.username,
				up.bio,
				up.avatar_url,
				f.created_at AS followed_at
			 FROM follows f
			 INNER JOIN user_profiles up
			 	ON up.user_id = f.following_id
			 WHERE f.follower_id = $1
			 ORDER BY f.created_at DESC`,
			[userId]
		);

		return response.status(200).json({
			message: 'Following fetched successfully.',
			userId,
			count: result.rows.length,
			following: result.rows,
		});
	} catch (error) {
		return response.status(500).json({
			message: 'Failed to fetch following.',
			error: error.message,
		});
	}
};


const followUser = async (request, response) => {
	const client = await pool.connect();

	try {
		const followerId = request.userId;
		const { followingId } = request.body;

		if (!followerId) {
			return response.status(401).json({
				message: 'Authentication is required.',
			});
		}

		if (!followingId) {
			return response.status(400).json({
				message: 'followingId is required.',
			});
		}

		if (followerId === followingId) {
			return response.status(400).json({
				message: 'You cannot follow yourself.',
			});
		}

		await client.query('BEGIN');

		const targetUser = await client.query(
			'SELECT user_id FROM user_profiles WHERE user_id = $1',
			[followingId]
		);

		if (targetUser.rows.length === 0) {
			await client.query('ROLLBACK');
			return response.status(404).json({
				message: 'User to follow not found.',
			});
		}

		await client.query(
			'INSERT INTO follows (follower_id, following_id) VALUES ($1, $2)',
			[followerId, followingId]
		);

		await client.query(
			'UPDATE user_profiles SET following_count = following_count + 1 WHERE user_id = $1',
			[followerId]
		);

		await client.query(
			'UPDATE user_profiles SET followers_count = followers_count + 1 WHERE user_id = $1',
			[followingId]
		);

		const updatedFollowing = await client.query(
			'SELECT following_count FROM user_profiles WHERE user_id = $1',
			[followerId]
		);

		const updatedFollowers = await client.query(
			'SELECT followers_count FROM user_profiles WHERE user_id = $1',
			[followingId]
		);

		await client.query('COMMIT');

		return response.status(201).json({
			message: 'User followed successfully.',
			followingId,
			followingCount: updatedFollowing.rows[0]?.following_count || 0,
			followersCount: updatedFollowers.rows[0]?.followers_count || 0,
		});
	} catch (error) {
		await client.query('ROLLBACK');

		if (error.code === '23505') {
			return response.status(409).json({
				message: 'Already following this user.',
			});
		}

		return response.status(500).json({
			message: 'Failed to follow user.',
			error: error.message,
		});
	} finally {
		client.release();
	}
};


const unfollowUser = async (request, response) => {
	const client = await pool.connect();

	try {
		const followerId = request.userId;
		const { followingId } = request.body;

		if (!followerId) {
			return response.status(401).json({
				message: 'Authentication is required.',
			});
		}

		if (!followingId) {
			return response.status(400).json({
				message: 'followingId is required.',
			});
		}

		if (followerId === followingId) {
			return response.status(400).json({
				message: 'You cannot unfollow yourself.',
			});
		}

		await client.query('BEGIN');

		const followResult = await client.query(
			'DELETE FROM follows WHERE follower_id = $1 AND following_id = $2',
			[followerId, followingId]
		);

		if (followResult.rowCount === 0) {
			await client.query('ROLLBACK');
			return response.status(404).json({
				message: 'Follow relationship not found.',
			});
		}

		await client.query(
			'UPDATE user_profiles SET following_count = GREATEST(following_count - 1, 0) WHERE user_id = $1',
			[followerId]
		);

		await client.query(
			'UPDATE user_profiles SET followers_count = GREATEST(followers_count - 1, 0) WHERE user_id = $1',
			[followingId]
		);

		const updatedFollowing = await client.query(
			'SELECT following_count FROM user_profiles WHERE user_id = $1',
			[followerId]
		);

		const updatedFollowers = await client.query(
			'SELECT followers_count FROM user_profiles WHERE user_id = $1',
			[followingId]
		);

		await client.query('COMMIT');

		return response.status(200).json({
			message: 'User unfollowed successfully.',
			followingId,
			followingCount: updatedFollowing.rows[0]?.following_count || 0,
			followersCount: updatedFollowers.rows[0]?.followers_count || 0,
		});
	} catch (error) {
		await client.query('ROLLBACK');

		return response.status(500).json({
			message: 'Failed to unfollow user.',
			error: error.message,
		});
	} finally {
		client.release();
	}
};

export { createUserProfile, followUser, getFollower, getFollowing, getUser, unfollowUser };
