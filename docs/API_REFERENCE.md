# API Reference - Airport Pickup & Delivery Scheduler

## Base URL
```
http://localhost:5000/api
```

## Authentication
Currently no authentication required (development version)

## Response Format
All responses are JSON with the following structure:

### Success Response
```json
{
  "success": true,
  "data": {},
  "message": "Optional success message"
}
```

### Error Response
```json
{
  "error": "Error type",
  "message": "Detailed error message"
}
```

## Endpoints

### 1. Create Pickup Request
**POST** `/api/requests`

Create a new pickup/delivery request.

**Request Body:**
```json
{
  "customerName": "John Doe",
  "originAirport": "DEL",
  "destinationAirport": "BOM",
  "pickupCity": "Delhi",
  "deliveryAddress": "123 Street, Mumbai",
  "cargoType": "documents",
  "packageCount": 5,
  "actualWeight": 10.5,
  "dimensions": "10x10x10",
  "notes": "Handle with care"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "message": "Request created successfully",
  "data": {
    "id": "uuid",
    "customerName": "John Doe",
    "status": "pending",
    "createdAt": "2026-06-15T10:00:00.000Z",
    "history": [...]
  }
}
```

---

### 2. Get All Requests
**GET** `/api/requests`

Retrieve all pickup/delivery requests with optional filters.

**Query Parameters:**
- `status` - Filter by status (pending, in-progress, completed, cancelled)
- `cargoType` - Filter by cargo type
- `limit` - Number of records (default: 100)
- `offset` - Pagination offset (default: 0)

**Example:**
```
GET /api/requests?status=pending&limit=10&offset=0
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [...],
  "total": 25,
  "limit": 10,
  "offset": 0
}
```

---

### 3. Get Single Request
**GET** `/api/requests/:id`

Retrieve details of a specific request.

**Parameters:**
- `id` - Request ID (UUID)

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "customerName": "John Doe",
    ...
  }
}
```

**Error Response:** `404 Not Found`
```json
{
  "error": "Request not found"
}
```

---

### 4. Update Request Status
**PUT** `/api/requests/:id/status`

Update the status of a request and add to history.

**Request Body:**
```json
{
  "status": "in-progress",
  "note": "Optional note about status change"
}
```

**Valid Status Values:**
- `pending` - Initial state
- `in-progress` - Driver assigned
- `completed` - Delivered
- `cancelled` - Request cancelled

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Status updated successfully",
  "data": {...}
}
```

---

### 5. Update Complete Request
**PUT** `/api/requests/:id`

Update any fields of a request.

**Request Body:**
```json
{
  "customerName": "Jane Doe",
  "deliveryAddress": "New Address"
}
```

**Response:** `200 OK`

---

### 6. Delete Request
**DELETE** `/api/requests/:id`

Delete a request.

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Request deleted successfully",
  "data": {...}
}
```

---

### 7. Assign Driver
**POST** `/api/requests/:id/assign-driver`

Assign a driver to a pickup request.

**Request Body:**
```json
{
  "driverId": "DRV001",
  "driverName": "Raj Kumar",
  "vehicleNumber": "DL01AB1234"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Driver assigned successfully",
  "data": {
    "id": "uuid",
    "driver": {
      "id": "DRV001",
      "name": "Raj Kumar",
      "vehicleNumber": "DL01AB1234",
      "assignedAt": "2026-06-15T10:00:00.000Z"
    },
    "status": "in-progress",
    ...
  }
}
```

---

### 8. Record Airport Handover
**POST** `/api/requests/:id/airport-handover`

Record cargo handover at airport.

**Request Body:**
```json
{
  "handoverTime": "2026-06-15T14:30:00Z",
  "handoverBy": "Airport Staff Name",
  "cargoWeight": "10.5kg",
  "remarks": "Cargo received in good condition"
}
```

**Response:** `200 OK`

---

### 9. Record Proof of Delivery
**POST** `/api/requests/:id/proof-of-delivery`

Record delivery proof with recipient details.

**Request Body:**
```json
{
  "deliveryTime": "2026-06-15T16:45:00Z",
  "receivedBy": "Recipient Name",
  "photo": "base64_encoded_image_or_url",
  "remarks": "Delivered successfully"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Proof of delivery recorded",
  "data": {
    "id": "uuid",
    "status": "completed",
    "proofOfDelivery": {...},
    ...
  }
}
```

---

### 10. Get Dashboard Statistics
**GET** `/api/dashboard/stats`

Get summary statistics for the dashboard.

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "totalRequests": 50,
    "pending": 10,
    "inProgress": 15,
    "completed": 20,
    "cancelled": 5,
    "cargoByType": {
      "documents": 20,
      "samples": 15,
      "parts": 10,
      "perishables": 5
    },
    "cargoByAirport": {
      "DEL-BOM": 25,
      "DEL-CCU": 15,
      "BOM-DEL": 10
    }
  }
}
```

---

## Error Codes

| Code | Meaning |
|------|---------|
| 200 | OK |
| 201 | Created |
| 400 | Bad Request - Invalid input |
| 404 | Not Found - Resource doesn't exist |
| 500 | Internal Server Error |

## Example Workflows

### Workflow 1: Complete Pickup to Delivery
```bash
# 1. Create request
curl -X POST http://localhost:5000/api/requests \
  -H "Content-Type: application/json" \
  -d '{"customerName":"John","originAirport":"DEL","destinationAirport":"BOM",...}'

# 2. Assign driver
curl -X POST http://localhost:5000/api/requests/UUID/assign-driver \
  -H "Content-Type: application/json" \
  -d '{"driverId":"DRV001","driverName":"Raj",...}'

# 3. Record airport handover
curl -X POST http://localhost:5000/api/requests/UUID/airport-handover \
  -H "Content-Type: application/json" \
  -d '{"handoverTime":"2026-06-15T14:30:00Z",...}'

# 4. Record proof of delivery
curl -X POST http://localhost:5000/api/requests/UUID/proof-of-delivery \
  -H "Content-Type: application/json" \
  -d '{"deliveryTime":"2026-06-15T16:45:00Z",...}'
```

---

## Rate Limiting
Currently no rate limiting. To be implemented in production.

## Pagination
For list endpoints, use `limit` and `offset` parameters:
- Default limit: 100
- Max limit: 1000
- Default offset: 0

## Sorting
Currently not implemented. To be added in future versions.
