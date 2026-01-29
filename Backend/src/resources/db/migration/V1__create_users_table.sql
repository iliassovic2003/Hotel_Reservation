CREATE TABLE users (
    uid SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    email_verification BOOLEAN DEFAULT FALSE,
    phone VARCHAR(20),
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('customer', 'owner', 'admin')),
    creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    logs TEXT
);

CREATE INDEX idx_users_email ON users(email);