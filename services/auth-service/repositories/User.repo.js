import pool from "../Databases/UserDB.config.js";

class UserRepository {

    async createUser({ email, username, passwordHash }) {

        const query = `
        INSERT INTO "user" (
            email,
            username,
            passwordHash
        )
        VALUES ($1, $2, $3)
        RETURNING
            email,
            username,
            created_at,
            is_verified,
            otp;
    `;

        const values = [
            email,
            username,
            passwordHash
        ];

        const { rows } = await pool.query(query, values);

        return rows[0];
    }

}

export default new UserRepository();