CREATE TABLE customer (
    id SERIAL PRIMARY KEY,
    uid INTEGER NOT NULL REFERENCES users(uid) ON DELETE CASCADE,
    satisfaction INTEGER DEFAULT 0 CHECK (satisfaction BETWEEN 0 AND 100),
    points INTEGER DEFAULT 0,
    hotel_id INTEGER REFERENCES hotels(hotel_id) ON DELETE SET NULL,
    reser_id INTEGER,
    UNIQUE(uid)
);