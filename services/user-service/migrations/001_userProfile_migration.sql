CREATE TABLE IF NOT EXISTS user_profiles (
    user_id UUID PRIMARY KEY,

    username VARCHAR(50) NOT NULL UNIQUE,

    bio TEXT,

    avatar_url TEXT,

    followers_count INTEGER NOT NULL DEFAULT 0,

    following_count INTEGER NOT NULL DEFAULT 0,

    posts_count INTEGER NOT NULL DEFAULT 0,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);