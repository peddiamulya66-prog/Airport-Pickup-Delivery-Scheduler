# Setup Guide - Airport Pickup & Delivery Scheduler

## Prerequisites
- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Git** - [Download](https://git-scm.com/)
- **Postman** (for API testing) - [Download](https://www.postman.com/)
- **Code Editor** - VS Code recommended - [Download](https://code.visualstudio.com/)

## Project Structure
```
orbem/
├── frontend/                 # React/HTML frontend
│   ├── index.html           # Main HTML file
│   ├── app.js               # Frontend logic
│   ├── styles.css           # Styling
│   └── package.json
├── backend/                 # Node.js/Express backend
│   ├── server.js            # API server
│   ├── .env.example         # Environment variables template
│   └── package.json
├── docs/                    # Documentation
│   ├── API_REFERENCE.md     # API endpoints
│   ├── DATABASE_SCHEMA.md   # Database design
│   └── ARCHITECTURE.md      # System architecture
├── tests/                   # Test cases
│   └── TEST_PLAN.md        # Test plan
└── README.md               # Project README
```

## Quick Start

### 1. Clone/Download the Project
```bash
cd c:/Users/Peddi\ amulya/OneDrive/Desktop/orbem
```

### 2. Setup Backend

#### Step 1: Navigate to backend folder
```bash
cd backend
```

#### Step 2: Install dependencies
```bash
npm install
```

This installs:
- `express` - Web framework
- `cors` - Cross-origin requests
- `uuid` - Unique ID generation
- `dotenv` - Environment variables

#### Step 3: Create .env file
```bash
copy .env.example .env
```

Or manually create `.env`:
```
PORT=5000
NODE_ENV=development
```

#### Step 4: Start backend server
```bash
npm start
```

Expected output:
```
✈️ Airport Pickup & Delivery Scheduler API running on port 5000
http://localhost:5000
```

**Backend is now running at:** `http://localhost:5000`

✓ Test it: Open `http://localhost:5000` in browser - should show API info

---

### 3. Setup Frontend

#### Step 1: In a new terminal, navigate to frontend folder
```bash
cd frontend
```

#### Step 2: Install dependencies
```bash
npm install
```

#### Step 3: Start frontend server
```bash
npm start
```

Expected output:
```
Starting up http-server, serving ./
Hit CTRL-C to stop the server
http://127.0.0.1:3000
```

**Frontend is now running at:** `http://localhost:3000`

✓ Open browser: `http://localhost:3000` - should see the UI

---

## Testing the Application

### Test 1: Create a Request
1. Open `http://localhost:3000`
2. Fill the form:
   - Customer Name: "John Doe"
   - Origin Airport: "DEL"
   - Destination Airport: "BOM"
   - Pickup City: "Delhi"
   - Delivery Address: "123 Street, Mumbai"
   - Cargo Type: "documents"
   - Package Count: 5
   - Weight: 10
3. Click "Submit Request"
4. You should see success message

### Test 2: View Dashboard
1. Click "Dashboard" tab
2. You should see the created request in the table
3. Statistics should show "Total Requests: 1"

### Test 3: View Details
1. Click "View" button on the request
2. Switch to "Details" tab
3. See complete request information
4. Click "Mark In Progress" to update status

### Test 4: Test Backend API with Postman

#### Import API Collection
1. Open Postman
2. Create a new request
3. **Method:** POST
4. **URL:** `http://localhost:5000/api/requests`
5. **Headers:** 
   - Key: `Content-Type`
   - Value: `application/json`
6. **Body (raw JSON):**
```json
{
  "customerName": "Jane Doe",
  "originAirport": "BOM",
  "destinationAirport": "DEL",
  "pickupCity": "Mumbai",
  "deliveryAddress": "456 Avenue, Delhi",
  "cargoType": "samples",
  "packageCount": 3,
  "actualWeight": 5.5,
  "dimensions": "20x20x20"
}
```
7. Click "Send"
8. You should get 201 Created with request data

#### Get All Requests
1. **Method:** GET
2. **URL:** `http://localhost:5000/api/requests`
3. Click "Send"

#### Get Stats
1. **Method:** GET
2. **URL:** `http://localhost:5000/api/dashboard/stats`
3. Click "Send"

---

## Development Workflow

### Making Changes

#### Frontend Changes
1. Edit files in `/frontend/`
2. Browser auto-refreshes (live-server)
3. Check for errors in browser console (F12)

#### Backend Changes
1. Edit files in `/backend/`
2. Restart server (Ctrl+C, then `npm start`)
3. Test endpoints in Postman

#### Database
- Currently uses in-memory storage
- Data resets when server restarts
- To persist data, connect to MySQL/PostgreSQL

### Version Control (Git)

#### First time setup
```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

#### Push changes to GitHub
```bash
git add .
git commit -m "Add feature: [description]"
git push origin main
```

---

## Troubleshooting

### Issue: Backend won't start
**Solution:**
- Check if port 5000 is already in use: `netstat -ano | findstr :5000`
- Change PORT in `.env` file
- Restart the server

### Issue: Frontend can't connect to backend
**Solution:**
- Ensure backend is running on `http://localhost:5000`
- Check API_BASE_URL in `frontend/app.js`
- Check browser console for CORS errors
- Verify backend has CORS enabled

### Issue: npm install fails
**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -r node_modules package-lock.json

# Install again
npm install
```

### Issue: Port 3000 already in use
**Solution:**
```bash
# Kill process on port 3000
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or use different port in frontend/package.json
```

---

## Environment Variables

### Backend (.env)
```
PORT=5000                    # Server port
NODE_ENV=development         # Environment (development/production)
DB_HOST=localhost           # Database host (future)
DB_USER=root                # Database user (future)
DB_PASSWORD=password        # Database password (future)
DB_NAME=orbem_db            # Database name (future)
```

---

## Next Steps

1. **Database Connection** - Connect to MySQL/PostgreSQL
2. **Authentication** - Add user login/auth
3. **Deployment** - Deploy to Render, Railway, or Heroku
4. **Testing** - Write automated tests
5. **Documentation** - Write detailed API docs

---

## Resources

- [Node.js Documentation](https://nodejs.org/docs/)
- [Express.js Guide](https://expressjs.com/)
- [REST API Best Practices](https://restfulapi.net/)
- [Frontend JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript/)

---

## Support

For issues or questions:
1. Check troubleshooting section above
2. Review documentation in `/docs` folder
3. Test endpoints in Postman
4. Check browser console (F12) for errors
