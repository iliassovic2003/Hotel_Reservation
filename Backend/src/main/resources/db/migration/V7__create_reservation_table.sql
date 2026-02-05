CREATE TABLE reservation (
    reser_id SERIAL PRIMARY KEY,
    reser_num VARCHAR(50) UNIQUE NOT NULL,
    in_date DATE NOT NULL,
    out_date DATE NOT NULL,
    hotel_id INTEGER NOT NULL REFERENCES hotels(hotel_id) ON DELETE RESTRICT,
    room_id INTEGER NOT NULL REFERENCES rooms(room_id) ON DELETE RESTRICT,
    price DECIMAL(10, 2) NOT NULL,
    id INTEGER NOT NULL REFERENCES customer(id) ON DELETE RESTRICT,
    creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    booking_status VARCHAR(20) DEFAULT 'confirmed' CHECK (booking_status IN ('pending', 'confirmed', 'checked_in', 'checked_out', 'cancelled')),
    CONSTRAINT valid_dates CHECK (out_date > in_date)
);

CREATE INDEX idx_reservation_hotel ON reservation(hotel_id);
CREATE INDEX idx_reservation_room ON reservation(room_id);
CREATE INDEX idx_reservation_user ON reservation(id);
CREATE INDEX idx_reservation_dates ON reservation(in_date, out_date);
CREATE INDEX idx_reservation_num ON reservation(reser_num);
CREATE INDEX idx_reservation_status ON reservation(booking_status);