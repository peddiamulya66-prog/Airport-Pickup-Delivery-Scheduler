# System Architecture - Airport Pickup & Delivery Scheduler

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                           CLIENT LAYER                           │
├─────────────────────────────────────────────────────────────────┤
│  Web Browser (HTML, CSS, JavaScript)                            │
│  ├── Pickup Request Form                                         │
│  ├── Dashboard with Statistics                                   │
│  ├── Request Detail View                                         │
│  └── Status Management UI                                        │
└──────────────────────┬──────────────────────────────────────────┘
                       │ HTTP/CORS
┌──────────────────────▼──────────────────────────────────────────┐
│                      API GATEWAY LAYER                           │
├─────────────────────────────────────────────────────────────────┤
│  CORS Middleware │ Request Validation │ Error Handling          │
└──────────────────────┬──────────────────────────────────────────┘
                       │ Express Routes
┌──────────────────────▼──────────────────────────────────────────┐
│                   APPLICATION LAYER                              │
├─────────────────────────────────────────────────────────────────┤
│  ┌────────────────┐  ┌─────────────────┐  ┌────────────────┐   │
│  │ Request Router │  │  Driver Router  │  │ Report Router  │   │
│  │ /api/requests  │  │ /api/drivers    │  │ /api/dashboard │   │
│  └────────────────┘  └─────────────────┘  └────────────────┘   │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │           Business Logic & Workflow Engine              │   │
│  ├─────────────────────────────────────────────────────────┤   │
│  │ • Request Validation                                    │   │
│  │ • Driver Assignment Logic                               │   │
│  │ • Airport Handover Workflow                             │   │
│  │ • Proof of Delivery Processing                          │   │
│  │ • Status Management & History Tracking                  │   │
│  │ • Report Generation                                     │   │
│  └─────────────────────────────────────────────────────────┘   │
└──────────────────────┬──────────────────────────────────────────┘
                       │ Query/Command
┌──────────────────────▼──────────────────────────────────────────┐
│                    DATA ACCESS LAYER                             │
├─────────────────────────────────────────────────────────────────┤
│  • In-Memory Store (Development)                                 │
│  • Query Builder & Validators                                    │
│  • Data Transformation & Mapping                                 │
│  • Pagination & Filtering                                        │
└──────────────────────┬──────────────────────────────────────────┘
                       │ SQL/NoSQL
┌──────────────────────▼──────────────────────────────────────────┐
│                    DATABASE LAYER                                │
├─────────────────────────────────────────────────────────────────┤
│  • MySQL / PostgreSQL / Firebase                                 │
│  • Tables: Requests, Drivers, Handovers, Deliveries, History    │
│  • Indexes: Status, Cargo Type, Airport Route                    │
│  • Transactions & ACID Compliance                                │
└─────────────────────────────────────────────────────────────────┘
```

## Component Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND (HTML/JS)                        │
├──────────────────┬──────────────────┬─────────────────────────────┤
│  Form Component  │ Dashboard Module │ Detail View Component       │
│ ├─ Validation   │ ├─ Table View    │ ├─ Request Display        │
│ ├─ Submit Logic │ ├─ Stats Cards   │ ├─ History Timeline       │
│ └─ Error Handle │ ├─ Filters       │ └─ Action Buttons         │
│                 ├─ Sorting         │                             │
│                 └─ Refresh         │                             │
└──────────┬───────┴────────┬────────┴────────────────┬────────────┘
           │                │                        │
           └────────────────┼────────────────────────┘
                            │ AJAX/REST API
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                    BACKEND (Node.js/Express)                     │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │   Requests   │  │   Drivers    │  │  Airport Handover    │  │
│  │   API Routes │  │   API Routes │  │   API Routes         │  │
│  │              │  │              │  │                      │  │
│  │ • Create     │  │ • Assign     │  │ • Record Handover    │  │
│  │ • Read       │  │ • Track      │  │ • Track Cargo        │  │
│  │ • Update     │  │ • Schedule   │  │ • Verify Weight      │  │
│  │ • Delete     │  │              │  │                      │  │
│  └──────────────┘  └──────────────┘  └──────────────────────┘  │
│                                                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │  Deliveries  │  │  Dashboard   │  │  Notifications       │  │
│  │  API Routes  │  │  API Routes  │  │  Service             │  │
│  │              │  │              │  │                      │  │
│  │ • Proof of   │  │ • Statistics │  │ • SMS/Email alerts   │  │
│  │   Delivery   │  │ • Reports    │  │ • Status updates     │  │
│  │ • Track      │  │ • Insights   │  │ • Follow-ups         │  │
│  │   Receipts   │  │              │  │                      │  │
│  └──────────────┘  └──────────────┘  └──────────────────────┘  │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Core Services & Business Logic                         │   │
│  ├─────────────────────────────────────────────────────────┤   │
│  │ • Validation Service  • Workflow Engine                 │   │
│  │ • Authorization       • Event Emitter                   │   │
│  │ • Error Handler       • Logger                          │   │
│  └─────────────────────────────────────────────────────────┘   │
└──────────┬───────────────────────────────────────────────────────┘
           │ Query/Command
           ▼
┌─────────────────────────────────────────────────────────────────┐
│                    DATABASE (MySQL/PostgreSQL)                   │
├──────────────┬──────────────┬──────────────┬──────────────┬─────┤
│  Customers   │  Requests    │  Drivers     │  Handovers   │ ... │
│  • ID        │  • ID        │  • ID        │  • ID        │     │
│  • Name      │  • Customer  │  • Name      │  • Request   │     │
│  • Email     │  • Origin    │  • Vehicle   │  • Time      │     │
│  • Phone     │  • Dest      │  • Status    │  • By        │     │
│              │  • Status    │  • Assigned  │  • Weight    │     │
└──────────────┴──────────────┴──────────────┴──────────────┴─────┘
```

## Data Flow Diagram

### Workflow: Create & Track Pickup Request

```
1. INITIATION
   ┌────────────────┐
   │ User fills     │
   │ pickup form    │
   └────────┬───────┘
            │
            ▼
2. SUBMISSION
   ┌────────────────┐
   │ Frontend sends │
   │ POST request   │
   └────────┬───────┘
            │
            ▼
3. VALIDATION
   ┌────────────────┐
   │ Backend checks │
   │ required fields│
   └────┬───────┬───┘
        │       │
        │ VALID │ INVALID
        │       │
        ▼       ▼
   ┌──────┐ ┌──────────┐
   │ OK   │ │ Return   │
   │ 201  │ │ Error400 │
   └────┬─┘ └──────────┘
        │
        ▼
4. STORAGE
   ┌──────────────┐
   │ Create record│
   │ in database  │
   │ Status:      │
   │ PENDING      │
   └────┬─────────┘
        │
        ▼
5. ASSIGNMENT
   ┌──────────────┐
   │ Assign driver│
   │ Status:      │
   │ IN_PROGRESS  │
   └────┬─────────┘
        │
        ▼
6. HANDOVER
   ┌──────────────┐
   │ Record       │
   │ airport      │
   │ handover     │
   └────┬─────────┘
        │
        ▼
7. DELIVERY
   ┌──────────────┐
   │ Record proof │
   │ of delivery  │
   │ Status:      │
   │ COMPLETED    │
   └──────────────┘
```

## Technology Stack Details

### Frontend Layer
- **HTML5** - Semantic markup
- **CSS3** - Responsive styling with flexbox/grid
- **JavaScript (ES6+)** - DOM manipulation, API calls
- **Fetch API** - HTTP requests to backend

### Backend Layer
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework & routing
- **UUID** - Unique identifiers
- **CORS** - Cross-origin resource sharing
- **Middleware** - Request validation, error handling

### Database Layer (Future)
- **MySQL** - Structured relational data
- **PostgreSQL** - Advanced SQL features
- **Firebase** - NoSQL + real-time options

### DevOps (Future)
- **Git** - Version control
- **Docker** - Containerization
- **Render/Railway** - Deployment platforms
- **GitHub Actions** - CI/CD automation

## API Contract

### Request Format
```
Method: POST/GET/PUT/DELETE
URL: http://localhost:5000/api/[resource]/[action]
Headers: Content-Type: application/json, CORS enabled
Body: JSON payload with validation
```

### Response Format
```json
{
  "success": true/false,
  "data": {},
  "message": "Optional message",
  "error": "Optional error details"
}
```

## Security Considerations (Future Implementation)

1. **Authentication** - JWT tokens
2. **Authorization** - Role-based access control
3. **Input Validation** - Sanitize all inputs
4. **Rate Limiting** - Prevent abuse
5. **HTTPS/TLS** - Encrypted connections
6. **SQL Injection Prevention** - Parameterized queries
7. **CORS Policy** - Whitelist allowed origins

## Scalability Features

1. **Pagination** - Limit/offset for large datasets
2. **Indexing** - Database indexes on common queries
3. **Caching** - Redis for frequently accessed data
4. **Load Balancing** - Distribute requests
5. **Microservices** - Split into smaller services
6. **Message Queues** - Async processing (RabbitMQ/Kafka)

## Performance Metrics

| Metric | Target | Status |
|--------|--------|--------|
| API Response Time | < 500ms | ✓ |
| Dashboard Load Time | < 2s | ✓ |
| Database Query | < 100ms | ✓ |
| Concurrent Users | 100+ | Planned |

## Deployment Architecture (Future)

```
┌─────────────┐
│   GitHub    │
└──────┬──────┘
       │ Push
       ▼
┌─────────────────┐
│ GitHub Actions  │ (CI/CD)
│ Build & Test    │
└──────┬──────────┘
       │ Deploy
       ▼
┌──────────────────────┐
│  Production Server   │
│  (Render/Railway)    │
├──────────────────────┤
│ Frontend (nginx)     │
│ Backend (Node.js)    │
│ Database (PostgreSQL)│
└──────────────────────┘
```

## Error Handling Strategy

```
User Request
    ↓
Frontend Validation
    ├─ Error → Show message
    └─ OK ↓
API Request
    ↓
Backend Validation
    ├─ Error → 400 Bad Request
    └─ OK ↓
Business Logic Processing
    ├─ Error → 500 Server Error
    └─ OK ↓
Database Operation
    ├─ Error → Rollback & Log
    └─ OK ↓
Success Response → 200/201
    ↓
Frontend Updates UI
```
