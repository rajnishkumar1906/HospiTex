# 🚀 How to Start HospiTex Backend Server

## Error: `ERR_CONNECTION_REFUSED`

This error means the backend server is not running on `http://localhost:5000`.

---

## ✅ Quick Start

### Step 1: Ensure MongoDB is Running

**Windows:**
```powershell
# Check if MongoDB service is running
Get-Service MongoDB

# If not running, start it:
net start MongoDB

# Or if MongoDB is not installed as a service:
mongod
```

**Alternative:** Use MongoDB Atlas (cloud) - update `MONGO_URI` in `.env` file

---

### Step 2: Verify .env File Exists

The `.env` file should be in: `HospiTex-Server/.env`

**Minimum required variables:**
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/hospitex
JWT_SECRET=your_random_secret_key_minimum_32_characters
```

**Note:** Email configuration (SMTP) is optional - server will work without it.

---

### Step 3: Start the Backend Server

```powershell
cd F:\HospiTex\HospiTex-Server
npm run server
```

**Expected output:**
```
🚀 Server running at http://localhost:5000
MongoDB Connected: localhost
```

---

## 🔧 Troubleshooting

### Issue: "JWT_SECRET is undefined"
**Solution:** Create/update `.env` file with `JWT_SECRET` variable

### Issue: "MongoDB connection error"
**Solution:** 
- Start MongoDB service: `net start MongoDB`
- Or check `MONGO_URI` in `.env` file
- Or use MongoDB Atlas connection string

### Issue: "Port 5000 is already in use"
**Solution:**
- Change `PORT` in `.env` file to another port (e.g., `5001`)
- Update frontend `axios.js` to use the new port

### Issue: Server starts but immediately crashes
**Solution:**
- Check console for error messages
- Verify all required environment variables are set
- Ensure MongoDB is accessible

---

## 📋 Complete Setup Checklist

- [ ] MongoDB is running (local or Atlas)
- [ ] `.env` file exists in `HospiTex-Server/` directory
- [ ] `MONGO_URI` is set correctly
- [ ] `JWT_SECRET` is set (32+ characters)
- [ ] Dependencies installed: `npm install` (in HospiTex-Server)
- [ ] Server started: `npm run server`
- [ ] Server shows: "🚀 Server running at http://localhost:5000"

---

## 🎯 Verify Server is Running

Open browser or use curl:
```powershell
# In PowerShell:
Invoke-WebRequest -Uri "http://localhost:5000" -UseBasicParsing

# Should return: "HospiTex API Running ✅"
```

Or visit: `http://localhost:5000` in your browser

---

## 💡 Pro Tips

1. **Keep server running** - Don't close the terminal where server is running
2. **Use separate terminals** - One for backend, one for frontend
3. **Check logs** - Server console shows all requests and errors
4. **MongoDB Atlas** - Easier than local MongoDB, free tier available

---

## 🆘 Still Having Issues?

1. Check server console for error messages
2. Verify MongoDB connection string
3. Ensure port 5000 is not blocked by firewall
4. Try restarting MongoDB service
5. Check if Node.js version is compatible (v16+)

---

**Status:** Server should now be running! ✅

