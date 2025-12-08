# Digital Memory Card API Setup Guide

This guide will help you set up the API for storing and managing digital memory cards with MongoDB and ImgBB.

## Features

- **Create Memory Cards**: Store user wishes with optional photos
- **Photo Upload**: Images are uploaded to ImgBB cloud storage
- **Device Fingerprinting**: Track which cards were created by each device
- **Delete Cards**: Users can delete only the cards they created
- **Password Protection**: Prevent spam with password-protected card creation

## Prerequisites

1. **MongoDB**: Either local installation or MongoDB Atlas account
2. **ImgBB Account**: Free API key from [ImgBB](https://api.imgbb.com/)

## Setup Instructions

### 1. Install Dependencies

Dependencies are already installed:
- `mongoose`: MongoDB ODM
- `@fingerprintjs/fingerprintjs`: Device fingerprinting
- `js-cookie`: Cookie management
- `@types/js-cookie`: TypeScript types

### 2. Configure MongoDB

#### Option A: Local MongoDB
```bash
# Install MongoDB locally (if not already installed)
# Windows: Download from https://www.mongodb.com/try/download/community
# Mac: brew install mongodb-community
# Linux: sudo apt-get install mongodb

# Start MongoDB service
# Windows: Run as service or mongod.exe
# Mac/Linux: sudo systemctl start mongod
```

#### Option B: MongoDB Atlas (Cloud)
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account and cluster
3. Get your connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/`)

### 3. Get ImgBB API Key

1. Go to [ImgBB API](https://api.imgbb.com/)
2. Sign up for a free account
3. Get your API key from the dashboard

### 4. Configure Environment Variables

Edit the `.env.local` file in the project root:

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/wedding-memory-cards
# Or use MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/wedding-memory-cards

# ImgBB API Key
IMGBB_API_KEY=your_actual_imgbb_api_key_here

# ImgBB Folder Name (where images will be uploaded)
IMGBB_FOLDER=forever-begins

# Password for creating memory cards
MEMORY_CARD_PASSWORD=123
```

**Important**: Replace the placeholder values with your actual credentials!

### 5. Run the Application

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## API Endpoints

### POST /api/memory-cards
Create a new memory card.

**Request**: FormData
- `name`: string (required)
- `message`: string (required, max 200 chars)
- `password`: string (required)
- `deviceFingerprint`: string (required)
- `photo`: File (optional)

**Response**:
```json
{
  "success": true,
  "card": {
    "id": "...",
    "serialNumber": 1,
    "name": "John Doe",
    "message": "Congratulations!",
    "photo": "https://i.ibb.co/...",
    "timestamp": "2025-12-08T..."
  }
}
```

### GET /api/memory-cards
Fetch all memory cards.

**Query Parameters**:
- `limit`: number (optional) - Limit number of cards returned
- `deviceFingerprint`: string (optional) - Mark owned cards

**Response**:
```json
{
  "success": true,
  "cards": [...],
  "total": 10
}
```

### GET /api/memory-cards/[id]
Get a specific memory card.

**Query Parameters**:
- `deviceFingerprint`: string (optional) - Check ownership

**Response**:
```json
{
  "success": true,
  "card": {
    "id": "...",
    "name": "...",
    "message": "...",
    "isOwner": true
  }
}
```

### DELETE /api/memory-cards/[id]
Delete a memory card (only if you created it).

**Query Parameters**:
- `deviceFingerprint`: string (required)

**Response**:
```json
{
  "success": true,
  "message": "Memory card deleted successfully"
}
```

## Image Upload to ImgBB

### Folder Organization

Images are uploaded to ImgBB with a configurable folder name:
- Set via `IMGBB_FOLDER` environment variable
- Default: `forever-begins`
- Images are named: `{folder}/memory-card-{timestamp}`
- All images are automatically compressed to max 400KB before upload
- Maximum dimensions: 1200x1200px (maintains aspect ratio)

Example image naming:
- `forever-begins/memory-card-1702345678901.jpg`

You can organize images by event by changing the `IMGBB_FOLDER` value:
- Wedding: `forever-begins`
- Birthday: `birthday-celebration`
- Anniversary: `our-anniversary`

## How Device Tracking Works

The app uses **FingerprintJS** to create a unique identifier for each device/browser. This allows users to:

1. Delete only the cards they created
2. See which cards are theirs (with delete button)
3. No login required - everything is device-based

### Fallback Strategy

If fingerprinting fails, the app stores a random ID in localStorage as a fallback.

## Security Considerations

1. **Password Protection**: Change `MEMORY_CARD_PASSWORD` in `.env.local` to something secure
2. **Rate Limiting**: Consider adding rate limiting in production
3. **Input Validation**: All inputs are validated on the server
4. **Image Size**: ImgBB has upload limits (check their documentation)

## Database Schema

The MongoDB schema includes:

```typescript
{
  serialNumber: Number,      // Auto-incrementing display number
  name: String,              // Guest name
  message: String,           // Wish message (max 200 chars)
  photo: String,             // ImgBB URL (optional)
  deviceFingerprint: String, // Unique device ID
  timestamp: Date,           // When card was created
  createdAt: Date,           // MongoDB timestamp
  updatedAt: Date            // MongoDB timestamp
}
```

## Troubleshooting

### MongoDB Connection Issues
- Verify MongoDB is running: `mongod --version`
- Check connection string in `.env.local`
- For Atlas: Whitelist your IP address in Atlas dashboard

### ImgBB Upload Fails
- Verify API key is correct
- Check image size (max size varies by plan)
- Ensure image format is supported (JPG, PNG, GIF, etc.)

### Cards Not Appearing
- Check browser console for errors
- Verify API endpoints are working: Open DevTools > Network tab
- Check MongoDB has cards: Use MongoDB Compass or CLI

### Delete Button Not Showing
- Ensure you created the card from the same device/browser
- Check browser console for fingerprint generation
- Clear localStorage and try again

## Production Deployment

When deploying to production:

1. **Environment Variables**: Set all env vars in your hosting platform
2. **MongoDB**: Use MongoDB Atlas for production
3. **ImgBB**: Verify your API plan supports production traffic
4. **HTTPS**: Ensure your site uses HTTPS (required for fingerprinting)

---

## VERCEL DEPLOYMENT - FIX FOR 500 ERRORS

### The Issue
Your `/api/memory-cards` endpoint is returning 500 errors because **environment variables are missing in Vercel**.

### Required Environment Variables

You need to add these to your Vercel project:

#### Method 1: Via Vercel Dashboard (Recommended)

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project: `forever-begins`
3. Go to **Settings** → **Environment Variables**
4. Add each of the following variables:

```
Name: MONGODB_URI
Value: mongodb+srv://muktadulislamfolify_db_user:39yohcpHoRTxJywJ@cluster0.divfyxz.mongodb.net/wedding-memory-cards
Environments: ✓ Production ✓ Preview ✓ Development
```

```
Name: IMGBB_API_KEY
Value: b04753c5435ae81e88e2af8727cb9124
Environments: ✓ Production ✓ Preview ✓ Development
```

```
Name: IMGBB_FOLDER
Value: forever-begins
Environments: ✓ Production ✓ Preview ✓ Development
```

```
Name: MEMORY_CARD_PASSWORD
Value: 123
Environments: ✓ Production ✓ Preview ✓ Development
```

#### Method 2: Via Vercel CLI

```bash
vercel env add MONGODB_URI
# Paste the MongoDB connection string when prompted
# Select: Production, Preview, Development

vercel env add IMGBB_API_KEY
# Paste your ImgBB API key when prompted
# Select: Production, Preview, Development

vercel env add IMGBB_FOLDER
# Type: forever-begins
# Select: Production, Preview, Development

vercel env add MEMORY_CARD_PASSWORD
# Type: 123
# Select: Production, Preview, Development
```

### After Adding Environment Variables

**IMPORTANT:** You MUST redeploy for changes to take effect:

**Option 1 - Trigger redeploy via Git:**
```bash
git commit --allow-empty -m "Trigger redeploy with env vars"
git push
```

**Option 2 - Redeploy from Vercel Dashboard:**
1. Go to **Deployments** tab
2. Click the **three dots (...)** on your latest deployment
3. Click **Redeploy**

### MongoDB Atlas Network Access

If you still get 500 errors after adding env vars, check MongoDB network access:

1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Select your cluster
3. Click **Network Access** in the left sidebar
4. Click **Add IP Address**
5. Click **Allow Access from Anywhere** (0.0.0.0/0)
   - Or add Vercel's IP ranges if you prefer more security
6. Click **Confirm**

### Security Warnings

⚠️ **CRITICAL:** Your credentials are now exposed in this file. You should:

1. **Rotate MongoDB credentials:**
   - Go to MongoDB Atlas → Database Access
   - Create a new user with a new password
   - Update `MONGODB_URI` in Vercel with new credentials
   - Delete the old user

2. **Rotate ImgBB API key:**
   - Go to [ImgBB API Settings](https://api.imgbb.com/)
   - Generate a new API key
   - Update `IMGBB_API_KEY` in Vercel

3. **Change password:**
   - Update `MEMORY_CARD_PASSWORD` to something more secure

4. **Verify `.gitignore`:**
   - Ensure `.env.local` is listed in `.gitignore`
   - Never commit environment files to Git

### Troubleshooting Vercel Deployment

If you still see 500 errors:

1. **Check Function Logs:**
   - Vercel Dashboard → Deployments → Click deployment → View Function Logs
   - Look for specific error messages

2. **Test API endpoint:**
   - Open: `https://your-domain.vercel.app/api/memory-cards?limit=1`
   - Check the response in browser DevTools

3. **Verify environment variables:**
   - Vercel Dashboard → Settings → Environment Variables
   - Ensure all 4 variables are present and correct

4. **Check build logs:**
   - Vercel Dashboard → Deployments → Click deployment → View Build Logs
   - Look for build errors or warnings

---

## Support

If you encounter issues:
1. Check the browser console for errors
2. Verify all environment variables are set correctly
3. Test API endpoints individually using Postman or curl
