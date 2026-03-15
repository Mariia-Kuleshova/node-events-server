# Node Events Server

Express.js API server with MySQL database.

## Features

- REST API for events
- MySQL database integration
- Pagination
- Sorting by date or title
- Cursor-based pagination
- Database indexes for performance

## Installation

Install dependencies:

npm install

## Run server

npm run dev

Server runs on:

http://localhost:3000

## API Endpoints

### Get events

GET /events

Query parameters:

page – page number  
limit – number of items per page  
sort – date or title  
order – asc or desc  

Example:

/events?page=1&limit=2&sort=date&order=asc

### Cursor pagination

/events?cursor=2

Returns events with id greater than cursor.

### Get participants of event

GET /participants/:eventId

Example:

/participants/1

## Database

MySQL database: `eventsdb`

Tables:

events  
participants  

Indexes:

idx_events_date  
idx_events_title  

Database schema and seed data are in:

database.sql
