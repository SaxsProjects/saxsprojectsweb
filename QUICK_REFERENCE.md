# SaxsProjects - Quick Reference Card

## 🚀 Start the Application

### Terminal 1: Backend
```bash
cd d:\Projects\SaxsProjects\backend
npm start
```

Expected output:
```
✅ Backend Configuration Status
🚀 SaxsProjects Integrated Backend running on port 5000
```

### Terminal 2: Frontend  
```bash
cd d:\Projects\SaxsProjects
npm run dev
```

Expected output:
```
VITE v5.x.x  ready in XXX ms

➜  Local:   http://localhost:5173/
```

---

## 🔑 Test Credentials

| Role | Email | Password |
|------|-------|----------|
| Client | demo@example.com | SaxsDemo2026! |
| Admin | saxs.solutions25@gmail.com | SaxsDemo2026! |

---

## 📍 Quick Navigation

### Frontend URLs
| Page | URL |
|------|-----|
| Home | http://localhost:5173 |
| Client Portal | http://localhost:5173 → click "Portal" |
| Admin Dashboard | http://localhost:5173 → click "Portal" then admin credentials |

### Backend Test URLs
| Endpoint | URL |
|----------|-----|
| Database Test | http://localhost:5000/api/test/database |
| Health Check | http://localhost:5000/api/health/check (admin only) |

---

## ✅ Initial Setup Checklist

- [ ] Backend starts without errors
- [ ] Frontend starts without errors
- [ ] Can access Admin Dashboard (saxs.solutions25@gmail.com)
- [ ] Can access Client Portal (demo@example.com)
- [ ] Database connection shows "connected"
- [ ] Can view sample client data
- [ ] Can view sample projects
- [ ] Can view sample invoices
- [ ] Live chat works (public)
- [ ] Admin can send messages to clients

---

## 🐛 Quick Troubleshooting

| Issue | Solution |
|-------|----------|
| Backend won't start | Check MongoDB URI, verify IP whitelisted in Atlas |
| Admin dashboard shows "unauthorized" | Clear localStorage, log in again |
| Chat not syncing | Check Firestore rules in Firebase console |
| Database shows 0 records | Create test data via API or dashboard |
| Port 5000 in use | Kill process or change PORT in .env |

---

## 📊 Key Features by User Type

### Client Features
- ✓ View their projects
- ✓ View their invoices  
- ✓ Live chat with developers
- ✓ Track project milestones
- ✓ See project progress

### Admin Features
- ✓ View all clients
- ✓ View all projects
- ✓ Manage invoices
- ✓ Monitor database status
- ✓ Add/delete clients
- ✓ Send messages to all clients
- ✓ View real-time statistics

---

## 🔌 API Quick Commands

### Test Database
```bash
curl http://localhost:5000/api/test/database
```

### Create Client
```bash
curl -X POST http://localhost:5000/api/clients \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","name":"Test"}'
```

### View All Projects (Admin)
```bash
# Get token from browser localStorage first
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:5000/api/projects
```

---

## 📚 Full Documentation

- **IMPLEMENTATION_SUMMARY.md** - What's been implemented
- **TESTING.md** - Complete testing guide  
- **BACKEND_GUIDE.md** - Backend architecture
- **QUICK_REFERENCE.md** - This file

---

## 🆘 Emergency Reset

If something breaks, reset with:

```bash
# Kill all processes
# Clear browser cache & localStorage
# Delete node_modules and reinstall

cd backend
rm -rf node_modules
npm install
npm start

# In new terminal
cd ..
npm install  
npm run dev
```

---

## 📞 Key Contacts

- **Support**: Saxs.solutions25@gmail.com
- **Admin Portal**: http://localhost:5173 → Portal
- **API Base**: http://localhost:5000/api
- **Admin Email**: saxs.solutions25@gmail.com

---

**Last Updated:** May 23, 2026  
**Version:** 1.0.0

✅ All systems operational!
