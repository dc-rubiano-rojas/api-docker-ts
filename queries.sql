 CREATE TABLE clientes (
	id serial primary key,
	email VARCHAR ( 255 ) UNIQUE NOT NULL,
	password VARCHAR ( 255 ) NOT NULL,
    nombre VARCHAR ( 255 ) DEFAULT NULL,
    session_token VARCHAR ( 255 ) DEFAULT NULL,
	created_at TIMESTAMP DEFAULT NULL,
	updated_at TIMESTAMP DEFAULT NULL
);

SELECT * FROM clientes;