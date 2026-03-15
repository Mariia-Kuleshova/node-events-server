CREATE DATABASE eventsdb;
USE eventsdb;

CREATE TABLE events (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255),
  date DATE,
  organizer VARCHAR(255)
);

CREATE TABLE participants (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255),
  email VARCHAR(255),
  eventId INT,
  FOREIGN KEY (eventId) REFERENCES events(id)
);

INSERT INTO events (title, date, organizer)
VALUES
("Node.js Workshop", "2025-04-12", "IT Academy"),
("JavaScript Conference", "2025-05-20", "Tech Community"),
("Frontend Meetup", "2025-06-01", "Web Devs");

INSERT INTO participants (name, email, eventId)
VALUES
("Anna", "anna@test.com", 1),
("Bob", "bob@test.com", 1),
("Kate", "kate@test.com", 2);

CREATE INDEX idx_events_date ON events(date);
CREATE INDEX idx_events_title ON events(title);