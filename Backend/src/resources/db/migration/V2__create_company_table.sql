CREATE TABLE company (
    company_id SERIAL PRIMARY KEY,
    company_name VARCHAR(255) NOT NULL,
    company_mail VARCHAR(255),
    company_address TEXT,
    company_phone VARCHAR(20),
    legal_number VARCHAR(100),
    website VARCHAR(255),
    creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
