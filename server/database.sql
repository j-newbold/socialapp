create database authtest1;

create table users(
	userid SERIAL PRIMARY KEY,
	username text,
	userpwd text,
	display_name text
);

create table posts(
	post_id SERIAL PRIMARY KEY,
	author_id INT REFERENCES users(userid),
	post_title text,
	post_body text,
	post_date DATE
);

CREATE TABLE follows(
	follow_id SERIAL PRIMARY KEY,
	user_follower INT,
	user_followed INT,
	CONSTRAINT fk_follower FOREIGN KEY (user_follower) REFERENCES users(userid) ON DELETE CASCADE,
	CONSTRAINT fk_to_follow FOREIGN KEY (user_followed) REFERENCES users(userid) ON DELETE CASCADE
);