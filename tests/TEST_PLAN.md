# Test Plan - Airport Pickup & Delivery Scheduler

## Test Objectives
1. Verify all API endpoints function correctly
2. Validate frontend form submission and data display
3. Ensure database operations work as expected
4. Test edge cases and error handling
5. Validate end-to-end workflow

## Test Categories

### 1. Frontend Tests
| Test ID | Description | Expected Result | Status |
|---------|-------------|-----------------|--------|
| FE-01 | Form renders correctly | All fields visible and functional | ✓ |
| FE-02 | Form validation - required fields | Error message shown | ✓ |
| FE-03 | Form submission with valid data | Success message displayed | ✓ |
| FE-04 | Dashboard displays all requests | Table populated with data | ✓ |
| FE-05 | Status badges show correct color | Pending=yellow, Completed=green | ✓ |
| FE-06 | Detail view opens request | Complete information displayed | ✓ |
| FE-07 | Tab navigation works | Switches between Form/Dashboard/Details | ✓ |
| FE-08 | Empty dashboard state | "No requests" message shown | ✓ |

### 2. Backend API Tests

#### Create Request (POST /api/requests)
| Test ID | Description | Expected Result | Status |
|---------|-------------|-----------------|--------|
| BE-01 | Create valid request | Returns 201 with request data | ✓ |
| BE-02 | Missing required fields | Returns 400 error | ✓ |
| BE-03 | Invalid data types | Returns 400 error | ✓ |
| BE-04 | Very long text input | Accepted and stored | ✓ |
| BE-05 | Special characters in name | Accepted and stored | ✓ |

#### Get Requests (GET /api/requests)
| Test ID | Description | Expected Result | Status |
|---------|-------------|-----------------|--------|
| BE-06 | Get all requests | Returns array of requests | ✓ |
| BE-07 | Filter by status | Returns only matching status | ✓ |
| BE-08 | Filter by cargo type | Returns only matching cargo type | ✓ |
| BE-09 | Pagination with limit | Returns correct number of records | ✓ |
| BE-10 | Empty database | Returns empty array | ✓ |

#### Get Single Request (GET /api/requests/:id)
| Test ID | Description | Expected Result | Status |
|---------|-------------|-----------------|--------|
| BE-11 | Valid request ID | Returns request data | ✓ |
| BE-12 | Invalid request ID | Returns 404 error | ✓ |

#### Update Status (PUT /api/requests/:id/status)
| Test ID | Description | Expected Result | Status |
|---------|-------------|-----------------|--------|
| BE-13 | Update to pending | Status changed successfully | ✓ |
| BE-14 | Update to in-progress | Status changed successfully | ✓ |
| BE-15 | Update to completed | Status changed successfully | ✓ |
| BE-16 | Invalid status | Returns 400 error | ✓ |
| BE-17 | Non-existent request | Returns 404 error | ✓ |

#### Driver Assignment (POST /api/requests/:id/assign-driver)
| Test ID | Description | Expected Result | Status |
|---------|-------------|-----------------|--------|
| BE-18 | Assign valid driver | Driver recorded, status updated | ✓ |
| BE-19 | Missing driver fields | Returns 400 error | ✓ |

#### Airport Handover (POST /api/requests/:id/airport-handover)
| Test ID | Description | Expected Result | Status |
|---------|-------------|-----------------|--------|
| BE-20 | Record valid handover | Handover data saved | ✓ |
| BE-21 | Missing handover fields | Returns 400 error | ✓ |

#### Proof of Delivery (POST /api/requests/:id/proof-of-delivery)
| Test ID | Description | Expected Result | Status |
|---------|-------------|-----------------|--------|
| BE-22 | Record valid POD | POD data saved, status = completed | ✓ |
| BE-23 | Missing POD fields | Returns 400 error | ✓ |

#### Dashboard Stats (GET /api/dashboard/stats)
| Test ID | Description | Expected Result | Status |
|---------|-------------|-----------------|--------|
| BE-24 | Get stats with data | Returns counts by status | ✓ |
| BE-25 | Get stats empty DB | Returns all zeros | ✓ |

### 3. Integration Tests
| Test ID | Description | Expected Result | Status |
|---------|-------------|-----------------|--------|
| INT-01 | Full workflow: Create → Assign Driver | Data persists across calls | ✓ |
| INT-02 | Full workflow: Handover → POD | Status updates correctly | ✓ |
| INT-03 | Multiple requests lifecycle | Each tracked independently | ✓ |
| INT-04 | Frontend to Backend sync | Data saved and retrieved correctly | ✓ |

### 4. Error Handling Tests
| Test ID | Description | Expected Result | Status |
|---------|-------------|-----------------|--------|
| ERR-01 | Network error | Graceful error message | ✓ |
| ERR-02 | Invalid JSON payload | Returns 400 error | ✓ |
| ERR-03 | Server timeout | Appropriate error returned | ✓ |
| ERR-04 | Database connection failure | Error logged and reported | ✓ |

### 5. Performance Tests
| Test ID | Description | Expected Result | Status |
|---------|-------------|-----------------|--------|
| PERF-01 | 100 requests in DB | List endpoint responds < 1s | ✓ |
| PERF-02 | Form submission latency | Response < 500ms | ✓ |
| PERF-03 | Dashboard render time | UI renders < 2s | ✓ |

## Known Issues
- None yet

## Fixed Issues
- Form client-side validation improved

## Test Execution Notes
- All tests run in development environment
- Database is in-memory for quick testing
- Frontend tested in Chrome and Firefox
- Backend tested with Postman and curl

## Sign-off
- **Date:** [Current Date]
- **Tested By:** [Student Name]
- **Status:** ✓ Ready for Review
