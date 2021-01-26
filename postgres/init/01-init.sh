#!/bin/bash

set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
	BEGIN;
	CREATE TABLE IF NOT EXISTS committee (
		id SERIAL PRIMARY KEY,
		name TEXT NOT NULL,
		is_primary BOOL NOT NULL
	);
	CREATE TABLE IF NOT EXISTS senator (
		id SERIAL PRIMARY KEY,
		name TEXT NOT NULL
	);
	CREATE TABLE IF NOT EXISTS subject (
		id SERIAL PRIMARY KEY,
		name TEXT NOT NULL
	);
	CREATE TABLE IF NOT EXISTS attachment (
		id SERIAL PRIMARY KEY,
		title TEXT NOT NULL,
		url TEXT NOT NULL
	);
	CREATE TABLE IF NOT EXISTS bill (
		id SERIAL PRIMARY KEY,
		congress INT NOT NULL,
		number INT NOT NULL,
		date_filed TIMESTAMPTZ NOT NULL,
		long_title TEXT NOT NULL,
		short_title TEXT NOT NULL,
		status TEXT NOT NULL,
		url TEXT NOT NULL,
		vote_type TEXT,
		president_action TEXT,
		president_received TIMESTAMPTZ,
		president_signed TIMESTAMPTZ,
		republic_act TEXT
	);
	CREATE TABLE IF NOT EXISTS advises (
		committee_id INT NOT NULL REFERENCES committee(id),
		bill_id INT NOT NULL REFERENCES bill(id),
		is_primary BOOL NOT NULL,
		PRIMARY KEY (committee_id, bill_id)
	);
	CREATE TABLE IF NOT EXISTS authors (
		senator_id INT NOT NULL REFERENCES senator(id),
		bill_id INT NOT NULL REFERENCES bill(id),
		PRIMARY KEY (senator_id, bill_id)
	);
	CREATE TABLE IF NOT EXISTS sponsors (
		senator_id INT NOT NULL REFERENCES senator(id),
		bill_id INT NOT NULL REFERENCES bill(id),
		is_co_sponsor BOOL NOT NULL,
		PRIMARY KEY (senator_id, bill_id)
	);
	CREATE TABLE IF NOT EXISTS votes (
		senator_id INT NOT NULL REFERENCES senator(id),
		bill_id INT NOT NULL REFERENCES bill(id),
		is_approval BOOL NOT NULL,
		PRIMARY KEY (senator_id, bill_id)
	);
	CREATE TABLE IF NOT EXISTS accompanies (
		attachment_id INT REFERENCES attachment(id),
		bill_id INT REFERENCES bill(id),
		PRIMARY KEY (attachment_id, bill_id)
	);
	CREATE TABLE IF NOT EXISTS tags (
		subject_id INT REFERENCES subject(id),
		bill_id INT REFERENCES bill(id),
		PRIMARY KEY (subject_id, bill_id)
	);
	COMMIT;
EOSQL
