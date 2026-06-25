# Login System Guide - Airport Pickup & Delivery Scheduler

## Overview

A complete login system has been added with three user roles:
- **Customer** - Create and track shipments
- **Driver** - View assignments and complete pickups
- **Admin** - Manage all requests and view dashboard

---

## How to Access

### Starting the Application

1. **Open terminal in frontend folder:**
   ```bash
   cd c:\Users\Peddi\ amulya\OneDrive\Desktop\orbem\frontend
   npm install
   npm start
   ```

2. **Open browser:**
   ```
   http://localhost:3000
   ```

3. **You'll see the login page** ✅

---

## Demo Accounts

Use these credentials to test different roles:

### 👤 Customer Account
- **Email:** `customer@orbem.com`
- **Password:** `pass123`
- **Access:** Customer dashboard with shipment tracking

### 🚗 Driver Account
- **Email:** `driver@orbem.com`
- **Password:** `pass123`
- **Access:** Driver portal with assignments and available jobs

### ⚙️ Admin Account
- **Email:** `admin@orbem.com`
- **Password:** `pass123`
- **Access:** Main admin dashboard with all requests

---

## Login Page Features

### 1. Role Selection
Select your role before entering credentials:
```
🏠 Customer | 🚗 Driver | ⚙️ Admin
```

### 2. Demo Credentials Display
Shows example logins right on the page (for testing)

### 3. Remember Me
- Checkbox to stay logged in
- Data saved in browser localStorage

### 4. Sign Up Option
- New users can create account
- Auto-validates email and password strength

---

## User Roles & Features

### 👤 Customer Dashboard (`dashboard-customer.html`)

**Features:**
- View total shipments, in-transit, and delivered
- Create new shipment requests
- Track shipments with timeline
- View shipment history

**What They Can Do:**
1. Create new shipment with destination and cargo info
2. See all their shipments in a table
3. Click "Track" to see real-time tracking updates
4. View shipping timeline with status updates

---

### 🚗 Driver Dashboard (`dashboard-driver.html`)

**Features:**
- View today's assignments
- Accept available jobs with earnings
- Track completed pickups
- View earnings dashboard

**What They Can Do:**
1. Accept pickup jobs from available jobs list
2. See assigned pickups with customer details
3. Update pickup status (complete delivery)
4. View earnings from completed jobs
5. Track job history

---

### ⚙️ Admin Dashboard (`index.html`)

**Features:**
- View all pickup requests
- Dashboard with statistics
- Assign drivers to requests
- Record airport handovers
- Record proof of delivery
- Generate reports

**What They Can Do:**
Everything - full system management

---

## File Structure (New Files)

```
frontend/
├── login.html              ← Main login/signup page
├── login.js                ← Authentication logic
├── login-styles.css        ← Login page styling
│
├── dashboard-customer.html ← Customer dashboard
├── dashboard-customer.js   ← Customer logic
├── dashboard-customer.css  ← Customer styling
│
├── dashboard-driver.html   ← Driver dashboard
├── dashboard-driver.js     ← Driver logic
├── dashboard-driver.css    ← Driver styling
│
├── index.html              ← Admin dashboard (updated)
├── app.js                  ← Admin logic
└── styles.css              ← Admin styling (updated)
```

---

## Testing the Login System

### Test 1: Login as Customer
1. Go to `http://localhost:3000`
2. Select "Customer" role
3. Enter: `customer@orbem.com` / `pass123`
4. Click Login
5. ✓ See customer dashboard

### Test 2: Login as Driver
1. Go to `http://localhost:3000`
2. Select "Driver" role
3. Enter: `driver@orbem.com` / `pass123`
4. Click Login
5. ✓ See driver dashboard

### Test 3: Login as Admin
1. Go to `http://localhost:3000`
2. Select "Admin" role
3. Enter: `admin@orbem.com` / `pass123`
4. Click Login
5. ✓ See admin dashboard

### Test 4: Create Shipment (Customer)
1. Login as customer
2. Click "New Shipment" tab
3. Fill form with:
   - Destination: "Mumbai"
   - Cargo Type: "Documents"
   - Weight: "2.5"
   - Quantity: "1"
4. Click "Create Shipment"
5. ✓ See shipment in dashboard

### Test 5: Accept Job (Driver)
1. Login as customer first, create a shipment
2. Logout
3. Login as driver
4. Click "Available Jobs" tab
5. See the shipment created by customer
6. Click "Accept Job"
7. ✓ See it in "My Assignments"

---

## Security & Data Storage

### Current Implementation (Development)
- **Storage:** Browser localStorage
- **Authentication:** Demo users only
- **Encryption:** None (development only)

### For Production
1. **Move authentication to backend** using API
2. **Use JWT tokens** for session management
3. **Hash passwords** with bcrypt
4. **Enable HTTPS** for data encryption
5. **Add rate limiting** to prevent brute force

---

## Data Structure

### User Data Stored
```javascript
{
  email: "customer@orbem.com",
  name: "John Doe",
  role: "customer",
  loginTime: "2026-06-16T10:00:00Z",
  remember: true
}
```

### Shipment Data (Customer)
```javascript
{
  id: "SHIP-1718505600000",
  customerName: "John Doe",
  destination: "Mumbai",
  cargoType: "documents",
  weight: 2.5,
  status: "pending",
  createdAt: "16/06/2026 10:00:00",
  timeline: [...]
}
```

### Assignment Data (Driver)
```javascript
{
  pickupId: "request-id",
  driverId: "driver@orbem.com",
  customerName: "John Doe",
  destination: "BOM",
  status: "accepted",
  earning: 50
}
```

---

## Common Issues & Solutions

### Issue 1: Can't Login
**Check:**
- Role matches demo account (customer/driver/admin)
- Email and password are correct
- localStorage is enabled in browser

### Issue 2: Redirects to Login After Successful Login
**Cause:** User role doesn't match dashboard requirements

**Fix:**
- Use correct credentials for role
- Check console (F12) for errors

### Issue 3: Data Lost After Page Refresh
**Cause:** Closing browser or clearing localStorage

**Fix:**
- Data saved in localStorage (persistent in same browser)
- Check browser settings for localStorage

### Issue 4: Multiple Tabs Issues
**Solution:** Each tab has independent sessions
- Logout in one tab doesn't affect others (yet)
- Consider this for later

---

## Customization

### Change Demo Credentials
Edit `login.js`:
```javascript
const DEMO_USERS = {
    'your-email@orbem.com': {
        password: 'your-password',
        role: 'customer',
        name: 'Your Name'
    }
};
```

### Change Logo/Company Name
Edit login page files:
- `login.html` - Change text and emoji
- `index.html` - Update header

### Add New Role
1. Add to DEMO_USERS in login.js
2. Create new dashboard HTML file
3. Update redirectToDashboard() function
4. Create role-specific CSS and JS

---

## Next Steps

1. **Backend Integration:** Connect login to Node.js backend
2. **Database:** Store users in MySQL/PostgreSQL
3. **Security:** Add password hashing and JWT
4. **Email Verification:** Verify email on signup
5. **Password Reset:** Add forgot password feature
6. **Multi-Factor Auth:** Add 2FA for security

---

## File Sizes & Performance

| File | Size | Purpose |
|------|------|---------|
| login.html | ~5 KB | Login page markup |
| login.js | ~8 KB | Authentication logic |
| login-styles.css | ~6 KB | Login styling |
| dashboard-customer.html | ~4 KB | Customer page |
| dashboard-customer.js | ~5 KB | Customer logic |
| dashboard-driver.html | ~4 KB | Driver page |
| dashboard-driver.js | ~7 KB | Driver logic |

**Total Added:** ~39 KB

---

## Summary

✅ **What's New:**
- Complete login/signup system
- Three role-based dashboards
- Customer shipment tracking
- Driver job management
- Admin full control
- Demo data for testing

✅ **Ready for:**
- Testing all three user roles
- Creating and tracking shipments
- Assigning drivers to jobs
- Viewing reports and statistics

✅ **Next Phase:**
- Backend API integration
- Database connection
- Real authentication
- Email notifications
- Payment integration

---

**Start by going to `http://localhost:3000` and trying the demo accounts!** 🚀
