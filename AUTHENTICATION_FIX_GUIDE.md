# HospiTex Login & Signup - Issue Resolution Guide

## Issues Found and Fixed

### 🔴 **Critical Issues Identified:**

#### 1. **Missing Axios Credentials Configuration**
**Problem:** The frontend was not configured to send/receive cookies from the backend.
- The server uses httpOnly cookies for authentication (JWT tokens)
- Frontend axios calls were not including `withCredentials: true`
- This prevented cookies from being sent with requests, causing authentication to fail

**Fix Applied:**
- Created centralized axios configuration file: `HospiTex-Ui/src/config/axios.js`
- Configured axios instance with `withCredentials: true`
- Updated Login.jsx to use the new axios client

#### 2. **Server Script Error in package.json**
**Problem:** Server couldn't start properly
- Script had incorrect command: `"nodemon run server.js"`
- Should be: `"nodemon server.js"`

**Fix Applied:**
- Corrected the npm script in `HospiTex-Server/package.json`
- Added a `start` script for production use

#### 3. **CORS Configuration Incomplete**
**Problem:** Server CORS was missing explicit configuration for methods and headers
- Only origin and credentials were configured
- Missing explicit allowed methods and headers

**Fix Applied:**
- Enhanced CORS configuration in `server.js`:
  ```javascript
  app.use(cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }))
  ```

#### 4. **Missing Environment Variables File**
**Problem:** Server requires a `.env` file with configuration
- MongoDB connection string
- JWT secret key
- Email (SMTP) configuration

**Action Required:** Create a `.env` file in `HospiTex-Server/` directory with:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGO_URI=mongodb://localhost:27017/hospitex

# JWT Configuration
JWT_SECRET=your_secure_jwt_secret_key_here

# Email Configuration (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PWD=your_gmail_app_password
SENDER_EMAIL=your_email@gmail.com
```

**For Gmail SMTP Setup:**
1. Enable 2-factor authentication on your Google account
2. Go to Google Account Settings → Security → App Passwords
3. Generate an "App Password" for "Mail"
4. Use that 16-character password in `SMTP_PWD`

---

## Files Modified

### Frontend (HospiTex-Ui):
1. **src/config/axios.js** (NEW)
   - Centralized axios configuration
   - Automatically includes credentials in all API calls

2. **src/Auth/Login.jsx**
   - Updated to use new axios client
   - Cleaner API calls without redundant configuration

### Backend (HospiTex-Server):
1. **server.js**
   - Enhanced CORS configuration
   - Added support for multiple Vite ports (5173, 5174)

2. **package.json**
   - Fixed nodemon script
   - Added production start script

---

## How to Test

### 1. Start MongoDB
Make sure MongoDB is running on your system:
```bash
# Windows (if installed as service)
net start MongoDB

# Or if using MongoDB Community Edition
mongod
```

### 2. Start the Backend Server
```bash
cd F:\HospiTex\HospiTex-Server
npm run server
```

Expected output:
```
🚀 Server running at http://localhost:5000
MongoDB Connected: localhost
```

### 3. Start the Frontend
```bash
cd F:\HospiTex\HospiTex-Ui
npm run dev
```

Expected output:
```
VITE v7.x.x  ready in XXX ms
➜  Local:   http://localhost:5173/
```

### 4. Test Login/Signup
1. Open browser to `http://localhost:5173`
2. Click on Login or navigate to `/login`
3. Try creating a new account (Sign Up):
   - Enter name, email, password
   - Select user type (Patient/Doctor/Diagnostic)
   - Submit
4. Try logging in with the created account
5. Check browser console for any errors
6. Check server console for request logs

---

## Common Issues & Solutions

### Issue: "CORS policy error"
**Solution:** 
- Ensure both frontend and backend are running
- Verify frontend is running on port 5173 or 5174
- Check CORS configuration in server.js includes your port

### Issue: "Network Error" in axios
**Solution:**
- Check if backend server is running on port 5000
- Verify MongoDB is connected
- Check browser console for detailed error

### Issue: "JWT_SECRET is undefined"
**Solution:**
- Create `.env` file in HospiTex-Server directory
- Add all required environment variables
- Restart the server

### Issue: "MongoDB connection error"
**Solution:**
- Ensure MongoDB is installed and running
- Check MONGO_URI in .env file
- Test connection: `mongosh` in terminal

### Issue: "Email not sending"
**Solution:**
- Login/Signup will still work even if email fails
- Check SMTP credentials in .env
- For Gmail, ensure you're using App Password (not regular password)
- Email errors are logged but won't block authentication

---

## Architecture Overview

### Authentication Flow:
1. **User submits login/signup form** (Frontend)
2. **Request sent to backend** with credentials via axios
3. **Server validates** credentials and creates JWT token
4. **Server sets httpOnly cookie** with JWT token
5. **Cookie automatically sent** with subsequent requests
6. **Protected routes** verify JWT from cookie via middleware

### Cookie-based Authentication Benefits:
- ✅ More secure than localStorage (protected from XSS)
- ✅ HttpOnly flag prevents JavaScript access
- ✅ Automatic inclusion in requests
- ✅ SameSite protection against CSRF

---

## Next Steps

### Immediate:
1. ✅ Create `.env` file with your actual credentials
2. ✅ Start MongoDB service
3. ✅ Test login/signup functionality
4. ✅ Verify user can access dashboard after login

### Recommended:
- [ ] Add loading states for better UX
- [ ] Implement logout functionality properly
- [ ] Add password strength requirements
- [ ] Implement "Remember Me" functionality
- [ ] Add rate limiting to prevent brute force attacks
- [ ] Set up email templates for better welcome emails

---

## Security Recommendations

1. **JWT_SECRET**: Use a strong, random string (at least 32 characters)
2. **Passwords**: Already hashed with bcrypt (good!)
3. **HTTPS**: In production, use HTTPS and set `secure: true` in cookies
4. **Environment Variables**: Never commit `.env` to git
5. **MongoDB**: Use authentication in production
6. **Rate Limiting**: Consider adding express-rate-limit
7. **Input Validation**: Add additional validation on server side

---

## Support

If you encounter any issues:
1. Check browser console for client-side errors
2. Check server terminal for backend errors
3. Verify all dependencies are installed (`npm install`)
4. Ensure ports 5000 and 5173 are not blocked by firewall
5. Try clearing browser cookies and cache

---

**Last Updated:** 2025
**Status:** ✅ Issues Resolved - Ready for Testing

