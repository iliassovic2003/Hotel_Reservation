CREATE TABLE rooms (
    room_id SERIAL PRIMARY KEY,
    hotel_id INTEGER NOT NULL REFERENCES hotels(hotel_id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    total_rooms INTEGER DEFAULT 1,
    available INTEGER DEFAULT 1,
    CONSTRAINT available_check CHECK (available >= 0 AND available <= total_rooms)
);

CREATE INDEX idx_rooms_hotel ON rooms(hotel_id);
CREATE INDEX idx_rooms_type ON rooms(type);
CREATE INDEX idx_rooms_available ON rooms(available);