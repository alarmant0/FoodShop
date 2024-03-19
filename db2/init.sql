CREATE SEQUENCE order_id_seq;

CREATE TABLE orders (
    order_id INTEGER PRIMARY KEY DEFAULT nextval('order_id_seq'),
    order_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    order_content JSONB NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL
);
