ALTER TABLE customer ADD CONSTRAINT fk_customer_reservation 
    FOREIGN KEY (reser_id) REFERENCES reservation(reser_id) ON DELETE SET NULL;