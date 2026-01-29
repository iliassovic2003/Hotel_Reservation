CREATE TABLE owner (
    id SERIAL PRIMARY KEY,
    uid INTEGER NOT NULL REFERENCES users(uid) ON DELETE CASCADE,
    verif_status VARCHAR(20) DEFAULT 'pending' CHECK (verif_status IN ('pending', 'verified', 'rejected')),
    verif_by INTEGER REFERENCES users(uid) ON DELETE SET NULL,
    verif_date TIMESTAMP,
    company_id INTEGER REFERENCES company(company_id) ON DELETE SET NULL,
    hotel_id INTEGER REFERENCES hotels(hotel_id) ON DELETE SET NULL,
    UNIQUE(uid)
);