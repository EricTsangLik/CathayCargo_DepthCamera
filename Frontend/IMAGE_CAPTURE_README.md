# Image Capture Service Setup

This document explains how to set up and use the image capture functionality that saves captured images to the `Data_image` folder.

## Quick Setup

### Option 1: Automatic Setup (Recommended)
```bash
# Run the setup script
./start-image-service.sh
```

### Option 2: Manual Setup
```bash
# 1. Create backend directory
mkdir -p backend
cd backend

# 2. Copy backend files
cp ../backend-package.json package.json
cp ../image-capture-service.js server.js

# 3. Install dependencies
npm install

# 4. Start the service
node server.js
```

## How It Works

1. **Backend Service**: A Node.js Express server runs on port 3001
2. **Image Storage**: All captured images are saved to the `Data_image` folder
3. **Automatic Fallback**: If the backend service is unavailable, images will download to your browser's download folder

## Features

- ✅ **Automatic folder creation**: `Data_image` folder is created automatically
- ✅ **Timestamped filenames**: Images are saved with timestamp (e.g., `depth_capture_2024-10-11T14-30-25-123Z.png`)
- ✅ **Real-time feedback**: Button shows "Capturing..." state during capture
- ✅ **Capture counter**: Displays number of images captured
- ✅ **Last capture time**: Shows when the last image was captured
- ✅ **Error handling**: Graceful fallback to browser download if backend is unavailable

## API Endpoints

The backend service provides these endpoints:

- `POST /api/capture-base64` - Save base64 image data
- `GET /api/images` - List all captured images
- `GET /api/health` - Check service status

## Usage

1. **Start the backend service** (see setup instructions above)
2. **Start your React application** (`npm start`)
3. **Begin streaming** by clicking "Start Stream"
4. **Capture images** by clicking the "Capture" button
5. **Find your images** in the `backend/Data_image/` folder

## Troubleshooting

### Backend Service Issues
- Make sure Node.js is installed (`node --version`)
- Check if port 3001 is available
- Look for error messages in the backend service console

### Camera Access Issues
- Allow camera permissions in your browser
- Make sure no other applications are using the camera
- Try refreshing the page if camera access is denied

### File Saving Issues
- Check folder permissions
- Ensure sufficient disk space
- Verify the backend service is running (`http://localhost:3001/api/health`)

## File Structure
```
UI/
├── backend/
│   ├── Data_image/          # Captured images stored here
│   ├── package.json         # Backend dependencies
│   └── server.js           # Backend service
├── src/
│   └── components/
│       └── CameraStream.tsx # Frontend camera component
└── start-image-service.sh   # Setup script
```

## Integration with Depth Camera

To integrate with your actual depth camera:

1. Replace the `navigator.mediaDevices.getUserMedia()` call in `CameraStream.tsx`
2. Connect to your Python backend depth camera service
3. Update the image capture endpoint to handle depth data
4. Modify the image format if needed (e.g., for depth maps)

The current implementation uses the browser's camera as a placeholder, but the capture and save functionality will work the same way with your depth camera feed.
