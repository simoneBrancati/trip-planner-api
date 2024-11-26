# Trip Planner API
An HTTP RESTful API to manage trips

## Version: 1.0.0

### /trip-planner/trips

#### GET
##### Summary:

Retrieve sorted trips

##### Description:

Retrieves a list of trips optionally sorted based on the specified criteria.

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| origin | query | The IATA code for the trip's origin (e.g., ATL, LAX). | Yes | string |
| destination | query | The IATA code for the trip's destination. | Yes | string |
| sort_by | query | Sorting strategy for the trips. | No | string |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | A list of trips sorted as requested. |

### /my-trip

#### POST
##### Summary:

Save a trip

##### Description:

Saves a new trip to the database.

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Trip saved successfully. |
| 400 | Invalid request payload. |

#### DELETE
##### Summary:

Delete a trip

##### Description:

Deletes a saved trip from the database.

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| id | query | The ID of the trip to delete. | Yes | string |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Trip deleted successfully. |
| 400 | Missing or invalid id parameter. |
| 404 | Trip not found. |

### /my-trips

#### GET
##### Summary:

List saved trips

##### Description:

Retrieves all saved trips from the database.

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | A list of all trips saved by the user. |

### Models


#### Trip

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| id | string | Unique identifier of the trip. | Yes |
| origin | string | IATA code of the trip's origin (e.g., ATL, LAX). | Yes |
| destination | string | IATA code of the trip's destination. | Yes |
| cost | number | Cost of the trip. | Yes |
| duration | number | Duration of the trip in minutes. | Yes |
| type | string | Type of the trip. (possible values are train, car, flight) | Yes |
| display_name | string | Human-readable description of the trip. | Yes |