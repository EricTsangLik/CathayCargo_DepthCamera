# Smart Scanning System UI

A professional TypeScript React application for displaying goods dimension data from a depth camera scanning system.

## Features

- **Real-time Scanning Interface**: Interactive controls for starting/stopping scans
- **Dimension Display**: Professional visualization of length, width, height, and volume
- **System Status Monitoring**: Real-time status indicators for camera and backend connectivity
- **Scan History**: Track and display recent scanning results
- **Responsive Design**: Modern UI that works on desktop and mobile devices
- **TypeScript Support**: Full type safety and IntelliSense support

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Open [http://localhost:3000](http://localhost:3000) to view the application in your browser.

### Building for Production

```bash
npm run build
```

## Project Structure

```
src/
├── components/          # React components
│   ├── Header.tsx      # Main header with logo and status
│   ├── ScanningControls.tsx  # Scan control interface
│   ├── DimensionDisplay.tsx  # Current scan data display
│   └── RecentScans.tsx      # Scan history component
├── types/              # TypeScript type definitions
│   └── index.ts       # Main type interfaces
├── data/              # Mock data and utilities
│   └── mockData.ts    # Sample data for development
├── App.tsx            # Main application component
├── App.css            # Main application styles
└── index.tsx          # Application entry point
```

## Integration with Backend

The application is designed to integrate with your Python backend. Key integration points:

1. **WebSocket Connection**: Real-time data updates from depth camera
2. **REST API**: For configuration and historical data
3. **Data Format**: Structured JSON format for dimension data

Example data structure expected from backend:
```typescript
{
  id: string;
  name: string;
  dimensions: {
    length: number;
    width: number;
    height: number;
    unit: 'mm' | 'cm' | 'in';
  };
  volume: number;
  weight?: number;
  scanTimestamp: Date;
  confidence: number;
  status: 'scanning' | 'completed' | 'error';
}
```

## Customization

### Logo Integration
Replace the placeholder in `src/components/Header.tsx` with your actual logo:
```tsx
<div className="logo-placeholder">
  <img src="/path/to/your/logo.png" alt="Company Logo" />
</div>
```

### Styling
Modify `src/App.css` to match your brand colors and styling preferences.

### Data Sources
Update `src/data/mockData.ts` or integrate with your actual backend API.

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App (irreversible)

## Technologies Used

- **React 18** - UI framework
- **TypeScript** - Type-safe JavaScript
- **CSS3** - Modern styling with gradients and animations
- **Create React App** - Build tooling and development server

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
