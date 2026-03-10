# Node Events API

Simple Express.js server for working with events.

## Description

This project implements a basic REST API using **Express.js**.
The server returns a list of events and supports pagination, sorting and query validation.

## Features

* Express.js server
* GET `/events` endpoint
* Pagination using query parameters
* Sorting by **date** or **title**
* Request logging middleware
* Query parameters validation

## Installation

Install dependencies:

npm install

## Run server

Development mode:

npm run dev

Server will start on:

http://localhost:3000/events

## API Endpoint

### Get events

GET /events

Returns a list of events in JSON format.

## Query Parameters

Pagination:

/events?page=1&limit=5

Sorting by title:

/events?sort=title

Sorting by date (descending):

/events?sort=date&order=desc

## Example Response

{
"page": 1,
"limit": 5,
"total": 3,
"data": [
{
"id": 1,
"title": "Node.js Workshop",
"date": "2025-04-12",
"organizer": "IT Academy"
}
]
}

## Technologies

* Node.js
* Express.js
* JavaScript (ES Modules)

