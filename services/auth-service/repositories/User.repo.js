import pool from "../Databases/UserDB.config.js";

class UserRepository {

    async createUser({ email, username, passwordHash }) {

        const query = `
        INSERT INTO "user" (
            id,
            email,
            username,
            passwordHash
        )
        VALUES (gen_random_uuid(), $1, $2, $3)
        RETURNING
            id,
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