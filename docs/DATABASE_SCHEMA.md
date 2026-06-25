# Database Schema - Airport Pickup & Delivery Scheduler

## Entity Relationship Diagram

```
┌─────────────────┐         ┌─────────────────┐
│   Customers     │◄───────►│   Requests      │
├─────────────────┤         ├─────────────────┤
│ ID (PK)         │         │ ID (PK)         │
│ Name            │         │ CustomerID (FK) │
│ Email           │         │ OriginAirport   │
│ Phone           │         │ DestAirport     │
│ Address         │         │ CargoType       │
└─────────────────┘         │ Status          │
                            │ CreatedAt       │
                            └────────┬────────┘
                                     │
                    ┌────────────────┼────────────────┐
                    │                │                │
        ┌───────────▼────┐  ┌────────▼─────┐  ┌─────▼──────┐
        │  Drivers       │  │ Handovers    │  │ Deliveries │
        ├────────────────┤  ├──────────────┤  ├────────────┤
        │ ID (PK)        │  │ ID (PK)      │  │ ID (PK)    │
        │ Name           │  │ RequestID(FK)│  │ RequestID(FK)
        │ Vehicle        │  │ HandoverTime │  │ DeliveryTime
        │ AssignedAt     │  │ HandoverBy   │  │ ReceivedBy │
        └────────────────┘  │ CargoWeight  │  │ Photo      │
                            │ Remarks      │  │ Remarks    │
                            └──────────────┘  └────────────┘
```

## Tables

### 1. Customers
Store customer/shipper information.

```sql
CREATE TABLE Customers (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20),
    address TEXT,
    type ENUM('importer', 'exporter', 'agent', 'partner'),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### 2. Pickup_Requests
Core table for pickup/delivery requests.

```sql
CREATE TABLE Pickup_Requests (
    id VARCHAR(36) PRIMARY KEY,
    customerId VARCHAR(36) NOT NULL,
    customerName VARCHAR(255) NOT NULL,
    originAirport VARCHAR(10) NOT NULL,
    destinationAirport VARCHAR(10) NOT NULL,
    pickupCity VARCHAR(100),
    deliveryAddress TEXT NOT NULL,
    cargoType VARCHAR(50),
    packageCount INT,
    actualWeight DECIMAL(10, 2),
    chargeableWeight DECIMAL(10, 2),
    dimensions VARCHAR(50),
    notes TEXT,
    status ENUM('pending', 'in_progress', 'completed', 'cancelled') DEFAULT 'pending',
    owner VARCHAR(100),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customerId) REFERENCES Customers(id),
    INDEX idx_status (status),
    INDEX idx_cargoType (cargoType),
    INDEX idx_airport (originAirport, destinationAirport)
);
```

### 3. Drivers
Driver information for assignment.

```sql
CREATE TABLE Drivers (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    licenseNumber VARCHAR(50),
    vehicleNumber VARCHAR(20),
    vehicleType VARCHAR(50),
    status ENUM('active', 'inactive', 'on_leave') DEFAULT 'active',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### 4. Driver_Assignments
Track driver assignment to requests.

```sql
CREATE TABLE Driver_Assignments (
    id VARCHAR(36) PRIMARY KEY,
    requestId VARCHAR(36) NOT NULL,
    driverId VARCHAR(36) NOT NULL,
    assignedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completedAt TIMESTAMP,
    FOREIGN KEY (requestId) REFERENCES Pickup_Requests(id),
    FOREIGN KEY (driverId) REFERENCES Drivers(id),
    UNIQUE KEY unique_request_driver (requestId, driverId)
);
```

### 5. Airport_Handovers
Record cargo handover at airport.

```sql
CREATE TABLE Airport_Handovers (
    id VARCHAR(36) PRIMARY KEY,
    requestId VARCHAR(36) NOT NULL,
    handoverTime TIMESTAMP NOT NULL,
    handoverBy VARCHAR(255),
    cargoWeight DECIMAL(10, 2),
    remarks TEXT,
    photo VARCHAR(255),
    recordedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (requestId) REFERENCES Pickup_Requests(id),
    INDEX idx_request (requestId)
);
```

### 6. Deliveries
Record proof of delivery.

```sql
CREATE TABLE Deliveries (
    id VARCHAR(36) PRIMARY KEY,
    requestId VARCHAR(36) NOT NULL,
    deliveryTime TIMESTAMP NOT NULL,
    receivedBy VARCHAR(255),
    signature VARCHAR(255),
    photo VARCHAR(255),
    remarks TEXT,
    recordedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (requestId) REFERENCES Pickup_Requests(id),
    INDEX idx_request (requestId)
);
```

### 7. Request_History
Track status changes and updates.

```sql
CREATE TABLE Request_History (
    id VARCHAR(36) PRIMARY KEY,
    requestId VARCHAR(36) NOT NULL,
    previousStatus VARCHAR(50),
    newStatus VARCHAR(50),
    changeReason TEXT,
    changedBy VARCHAR(100),
    changedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (requestId) REFERENCES Pickup_Requests(id),
    INDEX idx_request (requestId),
    INDEX idx_date (changedAt)
);
```

### 8. Invoices
Billing information.

```sql
CREATE TABLE Invoices (
    id VARCHAR(36) PRIMARY KEY,
    requestId VARCHAR(36) NOT NULL,
    customerId VARCHAR(36) NOT NULL,
    amount DECIMAL(12, 2),
    chargeableWeight DECIMAL(10, 2),
    ratePerKg DECIMAL(10, 2),
    taxes DECIMAL(12, 2),
    totalAmount DECIMAL(12, 2),
    status ENUM('draft', 'issued', 'paid', 'overdue'),
    issueDate DATE,
    dueDate DATE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (requestId) REFERENCES Pickup_Requests(id),
    FOREIGN KEY (customerId) REFERENCES Customers(id)
);
```

### 9. Airline_Rates
Store airline rates for different routes.

```sql
CREATE TABLE Airline_Rates (
    id VARCHAR(36) PRIMARY KEY,
    airline VARCHAR(100),
    originAirport VARCHAR(10),
    destinationAirport VARCHAR(10),
    ratePerKg DECIMAL(10, 2),
    minWeight DECIMAL(10, 2),
    validFrom DATE,
    validTo DATE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_route (originAirport, destinationAirport)
);
```

### 10. Complaints
Track complaints and claims.

```sql
CREATE TABLE Complaints (
    id VARCHAR(36) PRIMARY KEY,
    requestId VARCHAR(36) NOT NULL,
    customerId VARCHAR(36) NOT NULL,
    complaintType VARCHAR(100),
    description TEXT,
    status ENUM('open', 'investigating', 'resolved', 'closed'),
    severity ENUM('low', 'medium', 'high', 'critical'),
    claimAmount DECIMAL(12, 2),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolvedAt TIMESTAMP,
    FOREIGN KEY (requestId) REFERENCES Pickup_Requests(id),
    FOREIGN KEY (customerId) REFERENCES Customers(id)
);
```

## Indexes

```sql
-- Performance indexes
CREATE INDEX idx_requests_status ON Pickup_Requests(status);
CREATE INDEX idx_requests_cargo ON Pickup_Requests(cargoType);
CREATE INDEX idx_requests_airport ON Pickup_Requests(originAirport, destinationAirport);
CREATE INDEX idx_requests_date ON Pickup_Requests(createdAt);
CREATE INDEX idx_customers_type ON Customers(type);
CREATE INDEX idx_drivers_status ON Drivers(status);
CREATE INDEX idx_airlines_route ON Airline_Rates(originAirport, destinationAirport);
```

## Data Dictionary

| Field | Type | Description |
|-------|------|-------------|
| id | VARCHAR(36) | UUID primary key |
| status | ENUM | Current state of request |
| createdAt | TIMESTAMP | Record creation time |
| updatedAt | TIMESTAMP | Last modification time |
| cargoType | VARCHAR(50) | Type of cargo (documents, samples, parts, perishables) |
| chargeableWeight | DECIMAL | Weight used for billing |
| actualWeight | DECIMAL | Actual weight of cargo |

## Future Enhancements

1. Add warehouse inventory tracking table
2. Add customs compliance documentation table
3. Add partner/agent management table
4. Add route suggestion analytics table
5. Add payment tracking table with payment methods
