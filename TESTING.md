# SaxsProjects - Complete Integration Testing Guide

## Database & Backend Connectivity Verification

This guide will help you verify that all database connections and backend functionalities are working correctly.

### Prerequisites

1. **MongoDB Atlas Setup**
   - Connection string in `backend/.env` as `MONGODB_URI`
   - Your IP address is whitelisted on MongoDB Atlas
   - Database user has appropriate permissions

2. **Firebase Configuration**
   - Firebase config in `firebase-config.js` for frontend
   - Firebase admin config in `backend/firebase-admin-config.json` or environment variables

3. **Backend Running**
   ```bash
   cd backend
   npm start
   # Should see: ✅ Backend Configuration Status
   ```

### Test 1: Database Connection Test (No Authentication Required)

**Test the MongoDB connection without logging in:**

```bash
# In your browser or using curl:
curl http://localhost:5000/api/test/database

# Expected Response (200 OK):
{
  "success": true,
  "message": "Database connection successful",
  "database": {
    "status": "connected",
    "timestamp": "2026-05-23T...",
    "collections": {
      "clients": 0,
      "projects": 0,
      "invoices": 0
    }
  },
  "mongodb": {
    "version": "5.x.x",
    "connection": "active"
  }
}
```

### Test 2: Client Registration Test

**Create a test client:**

```javascript
// POST http://localhost:5000/api/clients
{
  "email": "test@example.com",
  "name": "Test Client",
  "businessName": "Test Business",
  "contactInfo": "123-456-7890"
}

// Expected Response (200 OK):
{
  "email": "test@example.com",
  "name": "Test Client",
  "businessName": "Test Business",
  "contactInfo": "123-456-7890",
  "createdAt": "2026-05-23T..."
}
```

### Test 3: Admin Dashboard Login

1. Navigate to your app
2. Click on "Portal" → "Access Dashboard"
3. Select "Autofill saxs.solutions25@gmail.com (Developer Admin View)"
4. Click "Access Dashboard Workspace"
5. You should see the Admin Dashboard with statistics

**Expected Elements on Admin Dashboard:**
- ✓ Connection status (MongoDB & API)
- ✓ Overview statistics (Clients, Projects, Revenue, Pending Invoices)
- ✓ Clients tab with ability to add new clients
- ✓ Projects tab showing all projects
- ✓ Invoices tab showing all invoices

### Test 4: Admin Health Check (Authenticated)

**After logging in as admin:**

```bash
# Get your auth token from localStorage
# localStorage.getItem('firebase:authUser:YOUR_FIREBASE_PROJECT:AIza...')

curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:5000/api/health/check

# Expected Response (200 OK):
{
  "status": "healthy",
  "mongodb": true,
  "timestamp": "2026-05-23T...",
  "collections": {
    "clients": 1,
    "projects": 0,
    "invoices": 0
  }
}
```

### Test 5: Project Management Test

**Create a test project:**

```javascript
// POST http://localhost:5000/api/projects
// Headers: Authorization: Bearer YOUR_TOKEN
{
  "clientEmail": "test@example.com",
  "title": "Test Project",
  "tier": "Growth Plan",
  "progress": 25,
  "status": "In Development",
  "cost": "R5,000 ZAR",
  "timeline": "21 Days",
  "milestones": [
    { "name": "Discovery Call", "status": "completed" },
    { "name": "Development", "status": "active" }
  ]
}

// Expected Response (200 OK):
{
  "_id": "...",
  "clientEmail": "test@example.com",
  "title": "Test Project",
  "progress": 25,
  ...
}
```

### Test 6: Billing Management Test

**Create an invoice:**

```javascript
// POST http://localhost:5000/api/billing
// Headers: Authorization: Bearer YOUR_TOKEN
{
  "clientEmail": "test@example.com",
  "invoiceId": "INV-2026-001",
  "title": "50% Deposit",
  "desc": "Project initiation fee",
  "amount": "R2,500 ZAR",
  "status": "PENDING"
}

// Expected Response (201 Created):
{
  "_id": "...",
  "invoiceId": "INV-2026-001",
  "clientEmail": "test@example.com",
  "amount": "R2,500 ZAR",
  "status": "PENDING",
  ...
}
```

### Test 7: Admin Statistics Test

**Get all admin statistics:**

```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:5000/api/admin/stats

# Expected Response (200 OK):
{
  "totalClients": 1,
  "totalProjects": 1,
  "totalRevenue": "R0 ZAR",
  "pendingInvoices": 1,
  "dbStatus": "connected",
  "apiStatus": "connected"
}
```

### Test 8: Client Portal Login

1. Navigate to your app
2. Click on "Portal" → "Access Dashboard"
3. Use credentials:
   - Email: `demo@example.com`
   - Password: `(set in Firebase; not stored here)`
4. Click "Access Dashboard Workspace"
5. You should see the Client Dashboard with:
   - ✓ Your projects
   - ✓ Your invoices
   - ✓ Live chat with developers
   - ✓ Project milestones

### Test 9: Live Chat Integration

1. **Public Chat** (no login required):
   - Open the app homepage
   - Click the floating chat bubble
   - Send a message
   - You should receive an AI-generated response

2. **Private Chat** (logged in as client):
   - Log into Client Portal
   - Send a message in the chat section
   - Message should be saved in Firestore
   - Dev team should see the message

3. **Dev Response**:
   - Log into Admin Dashboard as saxs.solutions25@gmail.com
   - Go to Clients tab and select a client
   - Send a response message
   - Client should see it in real-time

### Troubleshooting Common Issues

#### Issue: "MongoDB Connection Error"
**Solution:**
1. Check `MONGODB_URI` in `backend/.env`
2. Verify your IP is whitelisted in MongoDB Atlas
3. Confirm database credentials are correct
4. Test connection: `curl http://localhost:5000/api/test/database`

#### Issue: "Unauthorized: No token provided"
**Solution:**
1. Make sure you're logged in via Firebase
2. Include proper Authorization header: `Bearer YOUR_TOKEN`
3. Check Firebase authentication is working

#### Issue: "Admin only endpoint" error
**Solution:**
1. Ensure you're using the admin email: `saxs.solutions25@gmail.com`
2. Check `ADMIN_EMAIL` in `backend/.env` matches
3. Verify Firebase authentication is identifying you as admin

#### Issue: Firestore chat messages not syncing
**Solution:**
1. Check Firebase Firestore rules allow read/write
2. Verify `db` export in `firebase-config.js` is correct
3. Check browser console for Firestore errors
4. Ensure Firestore is enabled in Firebase console

#### Issue: Email not sending
**Solution:**
1. SMTP configuration is optional - check `backend/.env`
2. If SMTP_HOST is not set, emails are logged to console
3. For production, set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS

### Backend Endpoints Summary

| Method | Endpoint | Auth Required | Purpose |
|--------|----------|---------------|---------|
| GET | `/api/test/database` | ❌ | Test database connection |
| GET | `/api/health/check` | ✅ Admin | Check backend health |
| POST | `/api/clients` | ❌ | Register new client |
| GET | `/api/projects` | ✅ Admin | Get all projects |
| GET | `/api/projects/my-project` | ✅ | Get client's project |
| POST | `/api/projects` | ✅ Admin | Create/update project |
| GET | `/api/billing/my-invoices` | ✅ | Get client's invoices |
| GET | `/api/billing/client/:email` | ✅ Admin | Get client invoices |
| POST | `/api/billing` | ✅ Admin | Create invoice |
| GET | `/api/admin/stats` | ✅ Admin | Get statistics |
| GET | `/api/admin/clients` | ✅ Admin | Get all clients |
| GET | `/api/admin/invoices` | ✅ Admin | Get all invoices |
| POST | `/api/schedule` | ❌ | Schedule consultation |
| POST | `/api/chat/respond` | ❌ | Get AI response |

### Full Integration Checklist

- [ ] Backend server starts without errors
- [ ] Database connection successful
- [ ] Can register new clients
- [ ] Can create projects
- [ ] Can create invoices
- [ ] Admin login works
- [ ] Admin dashboard displays statistics
- [ ] Admin can manage clients and projects
- [ ] Client portal displays their data
- [ ] Live chat receives/sends messages
- [ ] Email sending works (or console logs)
- [ ] Google Meet link generation works

---

## Running Full Integration Tests

If you have `curl` installed, run this script to test all endpoints:

```bash
#!/bin/bash

BASE_URL="http://localhost:5000/api"
ADMIN_EMAIL="saxs.solutions25@gmail.com"
TEST_EMAIL="integration-test@example.com"

echo "🧪 Testing Database Connection..."
curl -s $BASE_URL/test/database | jq .

echo "📝 Registering Test Client..."
curl -X POST $BASE_URL/clients \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$TEST_EMAIL\",\"name\":\"Integration Test\"}" | jq .

echo "✅ All tests completed!"
```

---

## Production Deployment Checklist

Before deploying to production:

- [ ] All `.env` variables are set correctly
- [ ] Database backups are configured
- [ ] Firebase production keys are in place
- [ ] SMTP credentials are configured
- [ ] Google Calendar API is fully set up
- [ ] All database collections have indexes
- [ ] Error logging is configured
- [ ] Rate limiting is implemented (optional)
- [ ] CORS is properly configured for production domain
- [ ] SSL/TLS certificates are set up

---

For more help, check the backend logs:

```bash
cd backend
npm start
# Watch for connection errors in the console output
```
