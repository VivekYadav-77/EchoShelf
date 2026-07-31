CREATE TABLE library_items (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    apple_catalog_id BIGINT NOT NULL,
    title VARCHAR(500) NOT NULL,
    artist_name VARCHAR(255) NOT NULL,
    genre VARCHAR(100),
    release_date DATE,
    track_count INTEGER,
    artwork_url VARCHAR(1000),
    collection_price DECIMAL(10,2),
    user_rating INTEGER CHECK (user_rating >= 1 AND user_rating <= 5),
    user_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_user FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT uq_user_apple_catalog UNIQUE(user_id, apple_catalog_id)
);

CREATE INDEX idx_library_user_id ON library_items(user_id);
CREATE INDEX idx_library_user_genre ON library_items(user_id, genre);
CREATE INDEX idx_library_user_release_date ON library_items(user_id, release_date);
