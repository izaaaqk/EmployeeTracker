DROP DATA IF EXISTS tracker_DB;

CREATE DATABASE tracker_DB;

USE tracker_DB;

CREATE TABLE department (
    id INT AUTO_INCREMENT,
    name VARCHAR(30) NOT NULL,
    PRIMARY KEY (id)
);

INSERT INTO department(name)
VALUES ('Management'),
       ('Engineering'),
       ('Accounting'),
       ('HR');

CREATE TABLE role (
  id INT AUTO_INCREMENT,
  title VARCHAR(30) NOT NULL,
  salary INT NOT NULL,
  department_id INT NOT NULL,
  PRIMARY KEY (id)
);

INSERT INTO role(title, salary, department_id)
VALUES ('Management', 321223, 1),
       ('Engineering', 213212, 2),
       ('Accounting', 200121, 3),
       ('HR', 99212, 4);

CREATE TABLE employee (
    id INT AUTO_INCREMENT,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT NOT NULL,
    manager_id INT NOT NULL,
    PRIMARY KEY (id)
);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Jhon', 'Snow', 1,1),
       ('Bat','Man',9,2),
       ('Jhon', 'Wick', 6,3),
       ('Robin' 'Hood', 3,4),
       ('Hot', 'Rod', 8,5),
       ('Link','Z' 12,6),
       ('Tom', 'Collins', 43,7),
       ('Arnold', 'Palmer', 11,8);
