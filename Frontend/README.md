# LOGISTECH Smart Scanning System

A professional dimension and weight scanning system designed for Cathay Cargo Terminal operations. This React-based web application provides real-time scanning capabilities with depth camera integration for accurate cargo measurement.

## 🚀 Features

- **Real-time Dimension Scanning**: Integrates with depth cameras to capture accurate length, width, and height measurements
- **Weight Integration**: Displays weight data alongside dimensional measurements
- **Live Data Display**: Real-time updates of scanning results in an intuitive interface
- **Data Management**: Full CRUD operations for scan records with edit and delete functionality
- **Professional UI**: Clean, modern interface optimized for industrial environments
- **API Integration**: Seamless backend connectivity for data persistence and retrieval
- **Responsive Design**: Works across different screen sizes and devices

## 🏗️ Architecture

### Frontend Stack
- **React 18** with TypeScript for type-safe development
- **Modern CSS** with responsive design principles
- **Native Fetch API** for backend communication
- **Component-based architecture** for maintainability

### Backend Integration
- **REST API** communication via proxy configuration
- **Real-time data fetching** from dimension scanning hardware
- **Error handling** with graceful fallbacks

## 📋 Prerequisites

- **Node.js** (version 16 or higher)
- **npm** (comes with Node.js)
- **Backend API** running on port 8000 (for dimension data)

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd UI
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   - Ensure your backend API is running on `http://192.168.1.2:8000`
   - The frontend uses a proxy configuration to avoid CORS issues

4. **Start development server**
   ```bash
   npm start
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

## 🔧 Configuration

### API Configuration
The application is configured to communicate with a backend API at:
- **Base URL**: `http://192.168.1.2:8000`
- **Endpoint**: `/dimension` (returns JSON with length, width, height)

### Expected API Response Format
```json
{
  "length": 30.0,
  "width": 20.0,
  "height": 10.0
}
```

### Proxy Setup
The development server includes proxy configuration in `package.json`:
```json
{
  "proxy": "http://192.168.1.2:8000"
}
```

## 📱 Usage

### Main Interface Components

1. **Header Section**
   - LOGISTECH branding and logo
   - System title: "Dimension Weights Scanning System"
   - Real-time timestamp display

2. **Left Sidebar**
   - Current order ID display
   - Device ID information
   - Live dimension readings (Length, Width, Height)
   - Weight information

3. **Camera Stream Section**
   - Start/Stop streaming controls
   - Capture button for taking measurements
   - Real-time camera feed integration

4. **Data Table**
   - Complete scan history
   - Columns: Item#, Order_ID, Length, Width, Height, Weight, Capture Time, Status, Actions
   - Edit and Delete functionality for each record
   - Loading states and error handling

### Key Operations

- **Start Scanning**: Click "Start Stream" to begin camera feed
- **Capture Measurement**: Click "Capture" to record current dimensions
- **Edit Records**: Use "Edit" button to modify existing scan data
- **Delete Records**: Use "Delete" button to remove scan records

## 🎨 UI Features

- **Professional Dark Theme**: Optimized for industrial environments
- **Real-time Updates**: Live dimension display and timestamp
- **Status Indicators**: Visual feedback for scan completion and processing
- **Responsive Layout**: Adapts to different screen sizes
- **Error Handling**: Graceful fallbacks when API is unavailable

## 🔍 Data Flow

1. **Initialization**: App loads and fetches initial dimensions from backend
2. **Live Updates**: Dimensions are displayed in the left sidebar
3. **Capture Process**: 
   - User clicks "Capture"
   - Current dimensions are retrieved
   - New scan record is created with timestamp
   - Data is added to the table
4. **Data Management**: Users can edit or delete scan records as needed

## 🛡️ Error Handling

- **API Unavailable**: App continues to function with default dimensions
- **Network Errors**: Clear error messages with retry options
- **Data Validation**: Proper handling of null/undefined values
- **Loading States**: User feedback during data operations

## 📦 Build & Deployment

### Development
```bash
npm start
# Runs on http://localhost:3000
```

### Production Build
```bash
npm run build
# Creates optimized build in ./build directory
```

### Deployment Options
- **Static Hosting**: Deploy build folder to any static web server
- **Docker**: Container-ready for scalable deployments
- **Reverse Proxy**: Configure nginx/Apache for production API routing

## 🔧 Customization

### Styling
- Main styles in `src/App.css`
- Component-specific styles inline or in separate CSS files
- CSS variables for easy theme customization

### API Integration
- Modify `src/services/api.ts` for different backend endpoints
- Update proxy configuration in `package.json` for different API servers
- Adjust data interfaces in `src/types/index.ts`

## 📊 Performance

- **Bundle Size**: ~49.5 kB gzipped
- **Load Time**: Optimized for fast initial loading
- **Memory Usage**: Efficient React component lifecycle management
- **API Calls**: Minimal requests with smart caching

## 🐛 Troubleshooting

### Common Issues

1. **Logo/Favicon not displaying**
   - Check file paths in `public/` directory
   - Clear browser cache (Ctrl+F5)
   - Verify `logistech-logo.png` exists

2. **API Connection Issues**
   - Verify backend is running on port 8000
   - Check network connectivity to `192.168.1.2`
   - Review browser console for CORS errors

3. **Build Failures**
   - Run `npm install` to ensure dependencies
   - Check Node.js version compatibility
   - Review TypeScript errors in console

## 📝 Development Notes

- **TypeScript**: Strict type checking enabled
- **ESLint**: Code quality and consistency rules
- **Component Structure**: Modular, reusable components
- **State Management**: React hooks for local state
- **API Layer**: Centralized in `services/api.ts`

## 🤝 Contributing

1. Follow existing code style and conventions
2. Add TypeScript types for new features
3. Test API integration thoroughly
4. Update documentation for new features

## 📄 License

This project is proprietary software developed for LOGISTECH operations.

## 🏢 About LOGISTECH

LOGISTECH specializes in advanced logistics and cargo handling solutions, providing cutting-edge technology for modern cargo terminals and distribution centers.

---

## 📜 Version History

### Version 1.3.0 (October 21, 2025)
**Frontend Image Storage & Viewing Enhancement**

#### New Features
- ✨ **Frontend Image Storage**: Captured images are now stored directly in the frontend using base64 encoding
- 🖼️ **Enhanced Image Viewer**: Beautiful new image viewing window with complete scan metadata
- 📥 **Image Download**: Built-in download functionality for captured images
- 🎯 **Session-based Storage**: Images persist during the current session in browser memory

#### Technical Changes
- Added `imageData?: string` field to `TableRow` interface for storing base64 images
- Modified `CameraStream` component to capture and pass image data via `onCapture` callback
- Completely rewrote `handleView()` to display stored images without backend API calls
- Image capture now converts canvas to PNG format using `canvas.toDataURL('image/png')`

#### Benefits
- No backend dependency required for viewing captured images
- Instant image viewing with zero API latency
- Professional presentation with scan details (Order No, Dimensions, Weight, Capture Time)
- Properly formatted filenames for downloads: `OrderNo_CaptureTime.png`

---

### Version 1.2.0 (October 21, 2025)
**On-Demand Dimension Fetching**

#### New Features
- 🔄 **Smart Dimension Updates**: Dimensions are now fetched fresh from backend when Capture button is pressed
- ⚡ **Improved Efficiency**: Eliminated continuous polling in favor of on-demand data fetching

#### Technical Changes
- Removed 5-second polling interval from dimension fetch logic
- Modified `handleCapture()` to fetch fresh dimensions via `apiService.getDimensions()` on each capture
- Added error handling with fallback to cached or default dimension values
- Dimension state updates immediately upon successful API response

#### Benefits
- More efficient resource usage - API calls only when needed
- Ensures latest dimension values at the exact moment of capture
- Better accuracy for time-sensitive measurements
- Graceful fallback if API temporarily unavailable

---

### Version 1.1.0 (October 21, 2025)
**Auto-Polling Dimension Updates** (Deprecated in v1.2.0)

#### Features Implemented (Later Removed)
- Automatic 5-second polling interval for dimension updates
- Continuous dimension refresh from backend API
- Real-time dimension display in left sidebar

#### Reason for Deprecation
- Replaced with more efficient on-demand fetching in v1.2.0
- Reduced unnecessary API calls and server load
- Better user control over when data is updated

---

### Version 1.0.0 (October 2025)
**Initial Release**

#### Core Features
- 📏 **Real-time Dimension Scanning**: Integration with depth cameras for accurate measurements
- ⚖️ **Weight Integration**: Display weight data alongside dimensions
- 📊 **Data Management**: Full CRUD operations for scan records
- 🎥 **Camera Stream**: MJPEG stream from backend depth camera
- 💾 **API Integration**: Backend connectivity for dimension data
- 🎨 **Professional UI**: Modern, responsive interface for industrial use

#### Technical Stack
- React 18 with TypeScript
- Component-based architecture
- REST API communication via proxy
- Native Fetch API for backend requests

#### API Endpoints
- `GET /dimension` - Fetch dimension data (length, width, height)
- `GET /capture/streaming` - MJPEG video stream
- `GET /capture` - Capture image endpoint (legacy)

#### Components
- `App.tsx` - Main application container
- `Header.tsx` - Branding and timestamp display
- `LeftSidebar.tsx` - Live dimension and order information
- `CameraStream.tsx` - Camera feed and capture controls
- `DataTable.tsx` - Scan history with edit/delete functionality
- `EditModal.tsx` - Record editing interface

---

## 🔮 Roadmap & Future Enhancements

### Planned Features
- 💾 **Persistent Storage**: IndexedDB or localStorage for image persistence across sessions
- 📤 **Bulk Export**: Export multiple scans with images as ZIP archive
- 🔍 **Image Search**: Search and filter scans by visual content
- 📊 **Analytics Dashboard**: Statistics and trends for scanning operations
- 🔐 **User Authentication**: Role-based access control
- 🌐 **Multi-language Support**: Internationalization for global deployment

### Technical Improvements
- Performance optimization for large image datasets
- Progressive Web App (PWA) capabilities
- Offline mode support
- Real-time WebSocket integration for dimension updates
- Advanced image processing and enhancement features

---

**Current Version**: 1.3.0  
**Last Updated**: October 21, 2025  
**Developed for**: Cathay Cargo Terminal Operations