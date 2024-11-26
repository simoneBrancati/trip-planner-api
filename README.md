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

## API Usage

#### **1. Retrieve Sorted Trips**

**Endpoint:**  
`GET /trip-planner/trips`

**Description:**  
Retrieves a list of trips sorted based on the specified criteria.

**Query Parameters:**  
- `origin` (string, **required**)  
  The IATA code for the trip's origin (e.g., `ATL`, `LAX`).
- `destination` (string, **required**)  
  The IATA code for the trip's destination.
- `sort_by` (string, *optional*)  
  Sorting strategy for the trips. Accepted values:
  - `cheapest`
  - `fastest`

- Example request:
```
GET http://localhost:3000/trip-planner/trips?origin=LAX&destination=ATL&sort_by=cheapest
```

**Response:**  
- `200 OK`: Returns the list of trips sorted as requested.
```json
{
  "trips": [
    {
      "origin": "LAX",
      "destination": "ATL",
      "cost": 4764,
      "duration": 14,
      "type": "flight",
      "id": "653da20d-cbaa-4762-8def-3ed627390d0c",
      "display_name": "from LAX to ATL by flight",
    }
  ]
}
```

---

### **2. Save a Trip**

**Endpoint:**  
`POST /trip-planner/my-trip`

**Description:**  
Saves a new trip to the database.

**Request Body:**
- Example request:
```
POST http://localhost:3000/trip-planner/my-trip
```
```json
{
  "trip": {
      "origin": "LAX",
      "destination": "ATL",
      "cost": 4764,
      "duration": 14,
      "type": "flight",
      "id": "653da20d-cbaa-4762-8def-3ed627390d0c",
      "display_name": "from LAX to ATL by flight",
    }
}
```

**Response:**  
- `200 OK`: Returns the saved trip.
```json
{
  "trip": {
    "origin": "LAX",
    "destination": "ATL",
    "cost": 4764,
    "duration": 14,
    "type": "flight",
    "id": "653da20d-cbaa-4762-8def-3ed627390d0c",
    "display_name": "from LAX to ATL by flight",
  }
}
```

**Error Handling:**  
- `400 Bad Request`: If the `trip` object is missing or invalid.

---

### **3. List Saved Trips**

**Endpoint:**  
`GET /trip-planner/my-trips`

**Description:**  
Lists all saved trips from the database.

- Example request:
```
GET http://localhost:3000/trip-planner/my-trips
```

**Response:**  
- `200 OK`: Returns the list of saved trips.
```json
{
  "trips": [
    {
      "origin": "LAX",
      "destination": "ATL",
      "cost": 4764,
      "duration": 14,
      "type": "flight",
      "id": "653da20d-cbaa-4762-8def-3ed627390d0c",
      "display_name": "from LAX to ATL by flight",
    },
    {
      "origin": "LAX",
      "destination": "ATL",
      "cost": 2403,
      "duration": 15,
      "type": "car",
      "id": "87abc816-51bb-4041-a561-10d7bfe0038a",
      "display_name": "from LAX to ATL by car",
    },
  ]
}
```

---

### **4. Delete a Trip**

**Endpoint:**  
`DELETE /trip-planner/my-trip`

**Description:**  
Deletes a saved trip from the database.

**Query Parameters:**  
- `id` (string, **required**)  
  The ID of the trip to delete.

- Example request:
```
DELETE http://localhost:3000/trip-planner/my-trip?id=87abc816-51bb-4041-a561-10d7bfe0038a
```

**Response:**  
- `200 OK`: If the trip was deleted successfully.  
Example:
```json
{
  "message": "Trip with id '87abc816-51bb-4041-a561-10d7bfe0038a' deleted successfully"
}
```
- `404 Not Found`: If the trip with the specified ID does not exist in the database.  
Example:
```json
{
  "error": "Trip with id '87abc816-51bb-4041-a561-10d7bfe0038a' not found"
}
  ```

**Error Handling:**  
- `400 Bad Request`: If the `id` query parameter is missing.

## Running tests

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

## Development

### Setup and installation for local development

1. Clone the repository:
```bash
git clone https://github.com/simoneBrancati/trip-planner-api
```
2. Install dependencies:
```bash
npm install
```
3. Start the server in development mode:
```bash
npm run dev
```