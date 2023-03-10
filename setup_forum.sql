CREATE DATABASE the_forum;
USE the_forum;

CREATE TABLE User (
    PK_user INT AUTO_INCREMENT NOT NULL,
    username VARCHAR(15) NOT NULL,
    hashedpass BINARY(60) NOT NULL,
    register_date DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    PRIMARY KEY (PK_user)
);

CREATE TABLE Post (
    PK_post INT AUTO_INCREMENT NOT NULL,
    FK_user INT NOT NULL, 
    title VARCHAR(100) NOT NULL,
    text TEXT NOT NULL,
    post_date DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY (FK_user) REFERENCES User(PK_user),
    PRIMARY KEY (PK_post)
);

CREATE TABLE Comment (
    PK_comment INT AUTO_INCREMENT NOT NULL,
    FK_post INT NOT NULL,
    FK_user INT NOT NULL,
    text TEXT NOT NULL,
    post_date DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY (FK_post) REFERENCES Post(PK_post),
    FOREIGN KEY (FK_user) REFERENCES User(PK_user),
    PRIMARY KEY (PK_comment)
);
