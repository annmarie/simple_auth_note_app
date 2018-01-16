-- db setup
DROP DATABASE simple_web_auth_app;

CREATE DATABASE simple_web_auth_app;

USE simple_web_auth_app;

 CREATE TABLE user (
   id INT(10) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
   email VARCHAR(255) UNIQUE NOT NULL,
   password_digest VARCHAR(255),
   admin TINYINT(1),
   updated_at TIMESTAMP,
   created_at TIMESTAMP DEFAULT NOW()
 ) ENGINE=MyISAM;

CREATE INDEX email_ix ON user (email);

CREATE TRIGGER user_create_at BEFORE INSERT ON `user`
FOR EACH ROW SET NEW.updated_at = NOW();
