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

**Version**: 1.0.0  
**Last Updated**: October 2025  
**Developed for**: Cathay Cargo Terminal Operations