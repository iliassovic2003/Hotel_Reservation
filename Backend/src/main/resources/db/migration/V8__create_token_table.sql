CREATE TABLE tokens (
    tid BIGSERIAL PRIMARY KEY,
    token VARCHAR(255) NOT NULL UNIQUE,
    user_id BIGINT NOT NULL REFERENCES users(uid) ON DELETE CASCADE,
    expiry_date TIMESTAMP NOT NULL,
    created_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_token_token ON tokens(token);
CREATE INDEX idx_token_user_id ON tokens(user_id);
CREATE INDEX idx_token_expiry ON tokens(expiry_date);
CREATE INDEX idx_token_user_expiry ON tokens(user_id, expiry_date);