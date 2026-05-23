# SaxsProjects Backend Architecture & Database Connections

## Overview

The SaxsProjects backend is built with **Node.js/Express** and integrates with multiple services:

- **MongoDB**: Primary database for clients, projects, and invoices
- **Firebase**: Authentication and real-time chat
- **Google Calendar API**: Meeting scheduling with Google Meet
- **Nodemailer/SMTP**: Email notifications
- **Google Gemini AI**: Intelligent chat responses

---

## Database Models

### 1. Client Model
```javascript
{
  email: String (required, unique),
  name: String (required),
  businessName: String,
  contactInfo: String,
  createdAt: Date (default: now)
}
```

**Purpose**: Stores client information and contact details

**API Endpoints**:
- `POST /api/clients` - Create/update client
- `GET /api/admin/clients` - Get all clients (admin only)
- `DELETE /api/admin/clients/:email` - Delete client (admin only)

---

### 2. Project Model
```javascript
{
  clientEmail: String (required, indexed),
  title: String (required),
  tier: String (required),
  progress: Number (default: 0),
  status: String,
  cost: String,
  timeline: String,
  milestones: [{
    name: String,
    status: enum ['pending', 'active', 'completed']
  }],
  createdAt: Date (default: now)
}
```

**Purpose**: Tracks client projects and development milestones

**API Endpoints**:
- `GET /api/projects/my-project` - Get client's project
- `GET /api/projects` - Get all projects (admin only)
- `POST /api/projects` - Create/update project (admin only)
- `DELETE /api/admin/projects/:id` - Delete project (admin only)

---

### 3. Billing Model
```javascript
{
  clientEmail: String (required, indexed),
  invoiceId: String (required, unique),
  title: String (required),
  desc: String,
  amount: String (required),
  status: enum ['PENDING', 'PAID', 'PENDING RELEASE'] (default: 'PENDING'),
  createdAt: Date (default: now)
}
```

**Purpose**: Manages invoicing and payment tracking

**API Endpoints**:
- `GET /api/billing/my-invoices` - Get client's invoices
- `GET /api/billing/client/:email` - Get invoices for specific client (admin only)
- `POST /api/billing` - Create invoice (admin only)
- `PUT /api/billing/:id/status` - Update invoice status (admin only)
- `DELETE /api/billing/:id` - Delete invoice (admin only)

---

### 4. Admin Model (NEW)
```javascript
{
  email: String (required, unique),
  name: String (required),
  role: enum ['super_admin', 'manager', 'developer'] (default: 'developer'),
  permissions: {
    canManageClients: Boolean (default: true),
    canManageProjects: Boolean (default: true),
    canManageBilling: Boolean (default: true),
    canViewAnalytics: Boolean (default: true),
    canManageAdmins: Boolean (default: false)
  },
  lastLogin: Date,
  isActive: Boolean (default: true),
  createdAt: Date (default: now)
}
```

**Purpose**: Fine-grained admin role management

**Planned Endpoints**:
- `POST /api/admin/users` - Create admin (super_admin only)
- `GET /api/admin/users` - List admins (super_admin only)
- `PUT /api/admin/users/:email` - Update admin (super_admin only)

---

## Authentication & Authorization

### Token-Based Authentication

All protected endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer <firebase-id-token>
```

### Middleware: `authMiddleware`

Verifies the token and decodes user information:

```javascript
const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  
  try {
    // Verifies token with Firebase
    req.user = decodedToken;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
};
```

### Middleware: `adminOnly`

Restricts access to the admin user defined in `ADMIN_EMAIL`:

```javascript
const adminOnly = (req, res, next) => {
  const adminEmail = process.env.ADMIN_EMAIL;
  
  if (req.user.email.toLowerCase() === adminEmail.toLowerCase()) {
    next();
  } else {
    return res.status(403).json({ error: 'Forbidden: Admin access required' });
  }
};
```

---

## Firebase Integration

### Firestore Database Structure

The app uses Firestore for real-time messaging:

```
chats/
  ├── {sessionId}/
  │   └── messages/
  │       ├── docId: {
  │       │   sender: 'user' | 'support' | 'dev',
  │       │   text: String,
  │       │   timestamp: Timestamp,
  │       │   isProcessed: Boolean
  │       │ }
```

### Real-Time Chat Processing

The backend listens to Firestore changes:

```javascript
db.collection('chats').onSnapshot(snapshot => {
  snapshot.docChanges().forEach(async change => {
    // Auto-respond to client messages with AI
    if (change.doc.data().sender === 'client') {
      const reply = await runAIEngine(message.text);
      // Add reply to Firestore
    }
  });
});
```

---

## Connection Flow

### 1. New Client Registration

```
Frontend (Contact Form)
  ↓
  POST /api/clients
  ↓
MongoDB (Client saved)
  ↓
Auto-creates Project record
  ↓
Auto-creates Billing records (50/50 split)
  ↓
Firestore Chat room created
  ↓
Response sent to frontend
```

### 2. Client Portal Access

```
Frontend Login
  ↓
Firebase Authentication
  ↓
GET /api/projects/my-project
  ↓
MongoDB queries client project
  ↓
Returns project + milestones
  ↓
GET /api/billing/my-invoices
  ↓
MongoDB queries client invoices
  ↓
Firestore listener binds to chat messages
  ↓
Dashboard displays all data
```

### 3. Admin Dashboard Access

```
Frontend Admin Login
  ↓
Firebase Authentication (admin email check)
  ↓
GET /api/admin/stats
  ↓
MongoDB aggregates all clients/projects
  ↓
Returns statistics
  ↓
GET /api/admin/clients
  ↓
GET /api/admin/projects
  ↓
GET /api/admin/invoices
  ↓
Dashboard displays all data
```

### 4. Admin Updates Project

```
Admin Form Submit
  ↓
POST /api/projects
  ↓
authMiddleware verifies token
  ↓
adminOnly verifies email is ADMIN_EMAIL
  ↓
MongoDB updates project
  ↓
Returns updated project
  ↓
Frontend updates display
  ↓
Firestore notifies client if they're viewing
```

---

## Error Handling

### Standard Error Response Format

```javascript
{
  error: "Description of what went wrong",
  status: 400 | 401 | 403 | 404 | 500,
  timestamp: "2026-05-23T..."
}
```

### Common HTTP Status Codes

| Code | Meaning | Common Causes |
|------|---------|--------------|
| 200 | OK | Request successful |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Missing required fields |
| 401 | Unauthorized | No token provided |
| 403 | Forbidden | Not admin (for admin endpoints) |
| 404 | Not Found | Resource doesn't exist |
| 500 | Server Error | Unexpected error |
| 503 | Service Unavailable | Database connection failed |

---

## Configuration

### Environment Variables (.env)

```env
# Server Configuration
PORT=5000

# Database
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/?appName=db

# Admin
ADMIN_EMAIL=saxs.solutions25@gmail.com

# AI/Services
GEMINI_API_KEY=your_key_here
GOOGLE_SERVICE_ACCOUNT_EMAIL=your_email@...
GOOGLE_PRIVATE_KEY=your_key_here

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# Firebase
FIREBASE_API_KEY=your_key_here
FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id
```

---

## Starting the Backend

```bash
cd backend

# Development mode with auto-reload
npm install  # First time only
npm start    # Starts server on http://localhost:5000

# You should see:
# ✅ Backend Configuration Status:
#    - MongoDB: ✓ Connected
#    - Admin Email: ✓ saxs.solutions25@gmail.com
#    - Gemini API: ✓ Configured
#    ...
# 🚀 SaxsProjects Integrated Backend running on port 5000
```

---

## Testing Endpoints

### Test Database Connection (No Auth)

```bash
curl http://localhost:5000/api/test/database
```

### Test Admin Health (With Auth)

```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:5000/api/health/check
```

### Test Client Creation

```bash
curl -X POST http://localhost:5000/api/clients \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","name":"Test"}'
```

---

## Database Indexing

For performance, these indexes should exist:

```javascript
// Client.js
email: { unique: true, index: true }

// Project.js
clientEmail: { index: true }

// Billing.js
clientEmail: { index: true }
invoiceId: { unique: true }
```

MongoDB Atlas creates these automatically, but verify in:
- MongoDB Atlas Dashboard → Collections → Indexes

---

## Troubleshooting

### "MongoDB Connection Error"
- Verify `MONGODB_URI` in `.env`
- Check IP whitelist in MongoDB Atlas
- Test: `curl http://localhost:5000/api/test/database`

### "Unauthorized" on endpoints requiring auth
- Include `Authorization: Bearer TOKEN` header
- Verify Firebase token is valid
- Check browser LocalStorage for auth token

### "Admin only" error
- Use `ADMIN_EMAIL` configured in `.env`
- Default: `saxs.solutions25@gmail.com`
- Verify user is logged in as this email

### Firestore not syncing
- Check Firestore security rules allow read/write
- Verify chat room ID is correct
- Check browser console for Firestore errors

---

## Production Deployment

Before going live:

1. **Set secure environment variables** in your hosting platform
2. **Enable Firestore backups** in Firebase console
3. **Set up MongoDB backups** in MongoDB Atlas
4. **Test all endpoints** with production data
5. **Configure CORS** for production domain
6. **Set up monitoring** for error logs
7. **Enable rate limiting** to prevent abuse
8. **Use environment-specific Firebase projects**

---

For support or questions, contact: **Saxs.solutions25@gmail.com**
