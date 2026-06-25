const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory data store (replace with database later)
let pickupRequests = [];

// Test route
app.get('/', (req, res) => {
    res.json({
        message: 'Airport Pickup & Delivery Scheduler API',
        version: '1.0.0',
        status: 'running'
    });
});

// ==================== PICKUP REQUEST ENDPOINTS ====================

// Create new pickup request
app.post('/api/requests', (req, res) => {
    try {
        const {
            customerName,
            customerEmail,
            originAirport,
            destinationAirport,
            pickupCity,
            deliveryAddress,
            cargoType,
            packageCount,
            actualWeight,
            dimensions,
            notes
        } = req.body;

        // Validation
        if (!customerName || !customerEmail || !pickupCity || !deliveryAddress) {
            return res.status(400).json({
                error: 'Missing required fields'
            });
        }

        const newRequest = {
            id: uuidv4(),
            customerName,
            customerEmail,
            originAirport: originAirport || '',
            destinationAirport: destinationAirport || '',
            pickupCity,
            deliveryAddress,
            cargoType: cargoType || 'other',
            packageCount: parseInt(packageCount) || 1,
            actualWeight: parseFloat(actualWeight) || 0,
            dimensions: dimensions || '',
            notes: notes || '',
            status: 'pending',
            owner: customerName,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            history: [
                {
                    status: 'pending',
                    timestamp: new Date().toISOString(),
                    note: 'Request created'
                }
            ]
        };

        pickupRequests.push(newRequest);

        res.status(201).json({
            success: true,
            message: 'Request created successfully',
            data: newRequest
        });
    } catch (error) {
        console.error('Error creating request:', error);
        res.status(500).json({
            error: 'Internal server error',
            message: error.message
        });
    }
});

// Get all pickup requests
app.get('/api/requests', (req, res) => {
    try {
        const {
            status,
            cargoType,
            customerEmail,
            driverId,
            originAirport,
            destinationAirport,
            limit = 100,
            offset = 0
        } = req.query;

        let filtered = pickupRequests;

        // Apply filters
        if (status) {
            filtered = filtered.filter(r => r.status === status);
        }
        if (cargoType) {
            filtered = filtered.filter(r => r.cargoType === cargoType);
        }
        if (customerEmail) {
            filtered = filtered.filter(r => r.customerEmail === customerEmail);
        }
        if (driverId) {
            filtered = filtered.filter(r => (r.driver && r.driver.id === driverId) || r.driverId === driverId);
        }
        if (originAirport) {
            filtered = filtered.filter(r => r.originAirport === originAirport);
        }
        if (destinationAirport) {
            filtered = filtered.filter(r => r.destinationAirport === destinationAirport);
        }

        // Apply pagination
        const total = filtered.length;
        const results = filtered.slice(parseInt(offset), parseInt(offset) + parseInt(limit));

        res.json({
            success: true,
            data: results,
            total,
            limit: parseInt(limit),
            offset: parseInt(offset)
        });
    } catch (error) {
        console.error('Error fetching requests:', error);
        res.status(500).json({
            error: 'Internal server error',
            message: error.message
        });
    }
});

// Get single request
app.get('/api/requests/:id', (req, res) => {
    try {
        const request = pickupRequests.find(r => r.id === req.params.id);

        if (!request) {
            return res.status(404).json({
                error: 'Request not found'
            });
        }

        res.json({
            success: true,
            data: request
        });
    } catch (error) {
        console.error('Error fetching request:', error);
        res.status(500).json({
            error: 'Internal server error',
            message: error.message
        });
    }
});

// Update request status
app.put('/api/requests/:id/status', (req, res) => {
    try {
        const { status, note } = req.body;

        const request = pickupRequests.find(r => r.id === req.params.id);

        if (!request) {
            return res.status(404).json({
                error: 'Request not found'
            });
        }

        // Validate status
        const validStatuses = ['pending', 'in-progress', 'completed', 'cancelled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                error: 'Invalid status. Must be one of: ' + validStatuses.join(', ')
            });
        }

        request.status = status;
        request.updatedAt = new Date().toISOString();

        // Add to history
        request.history.push({
            status,
            timestamp: new Date().toISOString(),
            note: note || `Status updated to ${status}`
        });

        res.json({
            success: true,
            message: 'Status updated successfully',
            data: request
        });
    } catch (error) {
        console.error('Error updating request:', error);
        res.status(500).json({
            error: 'Internal server error',
            message: error.message
        });
    }
});

// Update complete request
app.put('/api/requests/:id', (req, res) => {
    try {
        const request = pickupRequests.find(r => r.id === req.params.id);

        if (!request) {
            return res.status(404).json({
                error: 'Request not found'
            });
        }

        // Update fields
        Object.keys(req.body).forEach(key => {
            if (key !== 'id' && key !== 'createdAt' && key !== 'history') {
                request[key] = req.body[key];
            }
        });

        request.updatedAt = new Date().toISOString();

        res.json({
            success: true,
            message: 'Request updated successfully',
            data: request
        });
    } catch (error) {
        console.error('Error updating request:', error);
        res.status(500).json({
            error: 'Internal server error',
            message: error.message
        });
    }
});

// Delete request
app.delete('/api/requests/:id', (req, res) => {
    try {
        const index = pickupRequests.findIndex(r => r.id === req.params.id);

        if (index === -1) {
            return res.status(404).json({
                error: 'Request not found'
            });
        }

        const deleted = pickupRequests.splice(index, 1);

        res.json({
            success: true,
            message: 'Request deleted successfully',
            data: deleted[0]
        });
    } catch (error) {
        console.error('Error deleting request:', error);
        res.status(500).json({
            error: 'Internal server error',
            message: error.message
        });
    }
});

// ==================== DRIVER ASSIGNMENT ====================

// Assign driver to request
app.post('/api/requests/:id/assign-driver', (req, res) => {
    try {
        const { driverId, driverName, vehicleNumber } = req.body;

        const request = pickupRequests.find(r => r.id === req.params.id);

        if (!request) {
            return res.status(404).json({
                error: 'Request not found'
            });
        }

        request.driver = {
            id: driverId,
            name: driverName,
            vehicleNumber: vehicleNumber || '',
            assignedAt: new Date().toISOString()
        };
        request.driverId = driverId;
        request.driverName = driverName;
        request.status = 'in-progress';
        request.updatedAt = new Date().toISOString();

        if (!request.history) {
            request.history = [];
        }
        request.history.push({
            status: 'in-progress',
            timestamp: new Date().toISOString(),
            note: `Assigned to driver ${driverName}`
        });

        res.json({
            success: true,
            message: 'Driver assigned successfully',
            data: request
        });
    } catch (error) {
        console.error('Error assigning driver:', error);
        res.status(500).json({
            error: 'Internal server error',
            message: error.message
        });
    }
});

// ==================== AIRPORT HANDOVER ====================

// Record airport handover
app.post('/api/requests/:id/airport-handover', (req, res) => {
    try {
        const { handoverTime, handoverBy, cargoWeight, remarks } = req.body;

        const request = pickupRequests.find(r => r.id === req.params.id);

        if (!request) {
            return res.status(404).json({
                error: 'Request not found'
            });
        }

        request.airportHandover = {
            handoverTime,
            handoverBy,
            cargoWeight,
            remarks,
            timestamp: new Date().toISOString()
        };

        request.updatedAt = new Date().toISOString();

        res.json({
            success: true,
            message: 'Airport handover recorded',
            data: request
        });
    } catch (error) {
        console.error('Error recording airport handover:', error);
        res.status(500).json({
            error: 'Internal server error',
            message: error.message
        });
    }
});

// ==================== PROOF OF DELIVERY ====================

// Record proof of delivery
app.post('/api/requests/:id/proof-of-delivery', (req, res) => {
    try {
        const { deliveryTime, receivedBy, photo, remarks } = req.body;

        const request = pickupRequests.find(r => r.id === req.params.id);

        if (!request) {
            return res.status(404).json({
                error: 'Request not found'
            });
        }

        request.proofOfDelivery = {
            deliveryTime,
            receivedBy,
            photo,
            remarks,
            timestamp: new Date().toISOString()
        };

        request.status = 'completed';
        request.updatedAt = new Date().toISOString();

        res.json({
            success: true,
            message: 'Proof of delivery recorded',
            data: request
        });
    } catch (error) {
        console.error('Error recording proof of delivery:', error);
        res.status(500).json({
            error: 'Internal server error',
            message: error.message
        });
    }
});

// ==================== DASHBOARD & REPORTS ====================

// Get dashboard statistics
app.get('/api/dashboard/stats', (req, res) => {
    try {
        const stats = {
            totalRequests: pickupRequests.length,
            pending: pickupRequests.filter(r => r.status === 'pending').length,
            inProgress: pickupRequests.filter(r => r.status === 'in-progress').length,
            completed: pickupRequests.filter(r => r.status === 'completed').length,
            cancelled: pickupRequests.filter(r => r.status === 'cancelled').length,
            cargoByType: {},
            cargoByAirport: {}
        };

        // Count by cargo type
        pickupRequests.forEach(r => {
            stats.cargoByType[r.cargoType] = (stats.cargoByType[r.cargoType] || 0) + 1;
            const airport = `${r.originAirport}-${r.destinationAirport}`;
            stats.cargoByAirport[airport] = (stats.cargoByAirport[airport] || 0) + 1;
        });

        res.json({
            success: true,
            data: stats
        });
    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({
            error: 'Internal server error',
            message: error.message
        });
    }
});

// ==================== OTP ENDPOINTS ====================

// Generate OTP for delivery completion
app.post('/api/otp/generate', (req, res) => {
    try {
        const { requestId } = req.body;

        if (!requestId) {
            return res.status(400).json({
                error: 'Request ID is required'
            });
        }

        const request = pickupRequests.find(r => r.id === requestId);
        if (!request) {
            return res.status(404).json({
                error: 'Request not found'
            });
        }

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        request.otp = otp;
        request.otpRequested = true;
        request.otpRequestedAt = new Date().toISOString();

        res.json({
            success: true,
            message: 'OTP generated successfully',
            otp: otp,
            expiresIn: 600 // 10 minutes
        });
    } catch (error) {
        console.error('Error generating OTP:', error);
        res.status(500).json({
            error: 'Internal server error',
            message: error.message
        });
    }
});

// Verify OTP and mark delivery as completed
app.post('/api/otp/verify', (req, res) => {
    try {
        const { requestId, otp } = req.body;

        if (!requestId || !otp) {
            return res.status(400).json({
                error: 'Request ID and OTP are required'
            });
        }

        const request = pickupRequests.find(r => r.id === requestId);
        if (!request) {
            return res.status(404).json({
                error: 'Request not found'
            });
        }

        if (!request.otp) {
            return res.status(400).json({
                error: 'No OTP requested for this delivery'
            });
        }

        if (otp !== request.otp) {
            return res.status(401).json({
                error: 'Invalid OTP'
            });
        }

        // OTP verified - mark as completed
        request.status = 'completed';
        request.otpVerified = true;
        request.deliveredAt = new Date().toISOString();
        request.updatedAt = new Date().toISOString();
        
        if (!request.history) {
            request.history = [];
        }
        
        request.history.push({
            status: 'completed',
            timestamp: new Date().toISOString(),
            note: 'Delivery completed with OTP verification'
        });

        res.json({
            success: true,
            message: 'OTP verified successfully. Delivery marked as completed.',
            data: request
        });
    } catch (error) {
        console.error('Error verifying OTP:', error);
        res.status(500).json({
            error: 'Internal server error',
            message: error.message
        });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({
        error: 'Internal server error',
        message: err.message
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`✈️ Airport Pickup & Delivery Scheduler API running on port ${PORT}`);
    console.log(`http://localhost:${PORT}`);
});

module.exports = app;
