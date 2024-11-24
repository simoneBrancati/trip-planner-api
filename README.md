# Trip planner API

This repository contains an Express application that offers an API for organizing and managing trips and travel plans.


## Environment Variable Setup
To run the application, you **must set** the `API_KEY` environment variable in the .env file. This key is required to authenticate requests to the third-party API.

### Steps to Configure the .env File
* Open the .env file in the root of the project.
* Add or update the following line to the .env file:

```
API_KEY=your_api_key_here
```

replacing `your_api_key_here` with the API key provided by the third-party service.

## Usage

### Starting the server

```bash
docker compose up
```

### API Usage

The application exposes an endpoint for retrieving sorted trips:

```
GET /trip-planner/trips
```

It accepts 3 query parameters:

* `origin`: Required - The IATA code for the trip's origin (e.g., ATL, LAX).
* `destination`: Required - The IATA code for the trip's destination
* `sort_by`: Optional - Sorting strategy for the trips. Accepted values are: cheapest, fastest.

### Example request

```
GET http://localhost:3000/trip-planner/trips?origin=ATL&destination=DXB&sort_by=cheapest
```

### Running Tests

**Using Docker (containerized approach)**  
To run the tests in a containerized environment, use the following command:

```bash
docker compose -f docker-compose.test.yml up --build
```

**Using npm (local environment)**  
Alternatively, you can run the tests directly in your local environment with npm. Use this command to run the tests:

```bash
npm run test
```
Make sure you have all the necessary dependencies installed before running the tests locally. You can install them with:

```bash
npm install
```
