import React, { useState, useRef, useEffect } from 'react';
import { apiService } from '../services/api';

interface CameraStreamProps {
  isStreaming: boolean;
  onStartStream: () => void;
  onStopStream: () => void;
  onCapture: (imageData: string) => void;
}

const CameraStream: React.FC<CameraStreamProps> = ({
  isStreaming,
  onStartStream,
  onStopStream,
  onCapture
}) => {
  const streamImgRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [streamActive, setStreamActive] = useState(false);
  const [resolution, setResolution] = useState('840x640');
  const [frameRate, setFrameRate] = useState(30);
  const [captureCount, setCaptureCount] = useState(0);
  const [isCapturing, setIsCapturing] = useState(false);
  const [lastCaptureTime, setLastCaptureTime] = useState<Date | null>(null);
  const [streamError, setStreamError] = useState<string | null>(null);

  // Function to capture image from MJPEG stream
  const captureImage = async () => {
    if (!streamImgRef.current || !streamActive || isCapturing) {
      console.log('No stream available for capture or capture in progress');
      return;
    }

    setIsCapturing(true);

    try {
      const streamImg = streamImgRef.current;
      const canvas = canvasRef.current || document.createElement('canvas');
      const context = canvas.getContext('2d');

      if (!context) {
        console.error('Could not get canvas context');
        return;
      }

      // Set canvas dimensions to match stream image
      canvas.width = streamImg.naturalWidth || 840;
      canvas.height = streamImg.naturalHeight || 640;

      // Draw the current stream frame to canvas
      context.drawImage(streamImg, 0, 0, canvas.width, canvas.height);

      // Convert canvas to base64 image data
      const imageData = canvas.toDataURL('image/png');
      
      // Update state
      setCaptureCount(prev => prev + 1);
      setLastCaptureTime(new Date());
      
      console.log('Image captured from backend stream');
      
      // Call the parent onCapture callback with image data
      onCapture(imageData);
      
    } catch (error) {
      console.error('Error capturing image:', error);
    } finally {
      setIsCapturing(false);
    }
  };


  useEffect(() => {
    if (isStreaming && streamImgRef.current) {
      console.log('Starting Dimension Capture Stream...');
      setStreamError(null);
      
      // Set up the Dimension Capture Stream from backend
      const streamUrl = apiService.getStreamingUrl();
      const streamImg = streamImgRef.current;
      
      // Handle stream load success
      const handleStreamLoad = () => {
        console.log('Dimension Capture Stream loaded successfully');
        setStreamActive(true);
        setStreamError(null);
      };
      
      // Handle stream load error
      const handleStreamError = (error: Event) => {
        console.error('Dimension Capture Stream error:', error);
        setStreamActive(false);
        setStreamError('Failed to connect to Dimension Capture Stream. Please check if the backend is running.');
      };
      
      // Add event listeners
      streamImg.addEventListener('load', handleStreamLoad);
      streamImg.addEventListener('error', handleStreamError);
      
      // Start the stream
      streamImg.src = streamUrl;
      
      // Cleanup function
      return () => {
        streamImg.removeEventListener('load', handleStreamLoad);
        streamImg.removeEventListener('error', handleStreamError);
        streamImg.src = '';
      };
    } else {
      console.log('Stopping Dimension Capture Stream...');
      setStreamActive(false);
      setStreamError(null);
      
      // Clear the stream source
      if (streamImgRef.current) {
        streamImgRef.current.src = '';
      }
    }
  }, [isStreaming]);

  return (
    <div className="camera-stream-section">
      <div className="camera-stream-header">
        <h3 className="camera-stream-title">Depth Camera Stream</h3>
        <div className="camera-controls">
          <button 
            className="camera-btn"
            onClick={isStreaming ? onStopStream : onStartStream}
          >
            {isStreaming ? 'Stop Stream' : 'Start Stream'}
          </button>
          <button 
            className={`camera-btn secondary ${isCapturing ? 'capturing' : ''}`}
            onClick={captureImage}
            disabled={!isStreaming || !streamActive || isCapturing}
          >
            {isCapturing ? 'Capturing...' : `Capture (${captureCount})`}
          </button>
        </div>
      </div>
      
      <div className="camera-stream-container">
        {isStreaming ? (
          <>
            {streamError ? (
              <div className="camera-stream-error">
                <div style={{ color: '#f44336', textAlign: 'center', padding: '2rem' }}>
                  <div style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>⚠️ Stream Error</div>
                  <div style={{ marginBottom: '1rem' }}>{streamError}</div>
                  <button 
                    onClick={() => window.location.reload()} 
                    style={{ 
                      padding: '0.5rem 1rem', 
                      backgroundColor: '#2196F3', 
                      color: 'white', 
                      border: 'none', 
                      borderRadius: '4px', 
                      cursor: 'pointer' 
                    }}
                  >
                    Retry
                  </button>
                </div>
              </div>
            ) : (
              <img
                ref={streamImgRef}
                className="camera-stream-video"
                alt="Dimension Capture Stream"
                style={{
                  width: '100%',
                  height: 'auto',
                  maxHeight: '400px',
                  objectFit: 'contain',
                  backgroundColor: '#000'
                }}
              />
            )}
            <div className="camera-stream-info">
              <div>Resolution: {resolution}</div>
              <div>FPS: {frameRate}</div>
              <div>Mode: Dimension Capture Stream</div>
              <div>Status: {streamActive ? 'Connected' : 'Connecting...'}</div>
            </div>
          </>
        ) : (
          <div className="camera-stream-placeholder">
            <div>
              <div>Dimension Capture Stream</div>
              <div style={{ fontSize: '0.8rem', color: '#666', marginTop: '0.5rem' }}>
                Click "Start Stream" to begin Dimension Capture Stream
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="camera-stream-status">
        <div className={`stream-status-dot ${streamActive ? 'active' : 'inactive'}`}></div>
        <span className="stream-status-text">
          Stream Status: {streamActive ? 'Active' : 'Inactive'}
        </span>
        {streamActive && (
          <span className="stream-status-text" style={{ marginLeft: '1rem' }}>
            Depth Range: 0.3m - 10.0m
          </span>
        )}
        {captureCount > 0 && (
          <span className="stream-status-text" style={{ marginLeft: '1rem' }}>
            Images Captured: {captureCount}
          </span>
        )}
        {lastCaptureTime && (
          <span className="stream-status-text" style={{ marginLeft: '1rem' }}>
            Last Capture: {lastCaptureTime.toLocaleTimeString()}
          </span>
        )}
      </div>
      
      {/* Hidden canvas for image capture */}
      <canvas 
        ref={canvasRef} 
        style={{ display: 'none' }}
      />
    </div>
  );
};

export default CameraStream;
