CREATE TABLE hotels (
    hotel_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    country VARCHAR(100) NOT NULL,
    verif_status VARCHAR(20) DEFAULT 'pending' CHECK (verif_status IN ('pending', 'active', 'inactive', 'suspended')),
    creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    app_by_admin BOOLEAN DEFAULT FALSE,
    app_time TIMESTAMP,
    ratings DECIMAL(2, 1) CHECK (ratings BETWEEN 0 AND 5),
    images TEXT[],
    amenities TEXT[],
    low_price DECIMAL(10, 2),
    high_price DECIMAL(10, 2),
    description TEXT
);

CREATE INDEX idx_hotels_city ON hotels(city);
CREATE INDEX idx_hotels_country ON hotels(country);
CREATE INDEX idx_hotels_status ON hotels(verif_status);
CREATE INDEX idx_hotels_ratings ON hotels(ratings);
