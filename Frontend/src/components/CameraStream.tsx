import React, { useState, useRef, useEffect } from 'react';

interface CameraStreamProps {
  isStreaming: boolean;
  onStartStream: () => void;
  onStopStream: () => void;
  onCapture: () => void;
}

const CameraStream: React.FC<CameraStreamProps> = ({
  isStreaming,
  onStartStream,
  onStopStream,
  onCapture
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [streamActive, setStreamActive] = useState(false);
  const [resolution, setResolution] = useState('1920x1080');
  const [frameRate, setFrameRate] = useState(30);
  const [captureCount, setCaptureCount] = useState(0);
  const [isCapturing, setIsCapturing] = useState(false);
  const [lastCaptureTime, setLastCaptureTime] = useState<Date | null>(null);

  // Function to capture image from video stream
  const captureImage = async () => {
    if (!videoRef.current || !streamActive || isCapturing) {
      console.log('No video stream available for capture or capture in progress');
      return;
    }

    setIsCapturing(true);

    try {
      const video = videoRef.current;
      const canvas = canvasRef.current || document.createElement('canvas');
      const context = canvas.getContext('2d');

      if (!context) {
        console.error('Could not get canvas context');
        return;
      }

      // Set canvas dimensions to match video
      canvas.width = video.videoWidth || 1920;
      canvas.height = video.videoHeight || 1080;

      // Draw the current video frame to canvas
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Convert canvas to blob
      const blob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob(resolve, 'image/png');
      });

      if (blob) {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = `depth_capture_${timestamp}.png`;
        
        // Try to save to Data_image folder using File System Access API (if supported)
        if ('showDirectoryPicker' in window) {
          try {
            // This would require user permission to select the Data_image folder
            // For now, we'll use the standard download approach
            await saveImageAsDownload(blob, filename);
          } catch (err) {
            console.log('Directory picker not available, using download method');
            await saveImageAsDownload(blob, filename);
          }
        } else {
          // Fallback to download method
          await saveImageAsDownload(blob, filename);
        }
        
        // Update state
        setCaptureCount(prev => prev + 1);
        setLastCaptureTime(new Date());
        
        console.log(`Image captured and saved as: ${filename}`);
        
        // Call the parent onCapture callback
        onCapture();
      }
    } catch (error) {
      console.error('Error capturing image:', error);
    } finally {
      setIsCapturing(false);
    }
  };

  // Helper function to save image as download
  const saveImageAsDownload = async (blob: Blob, filename: string) => {
    // First try to save via backend service to Data_image folder
    try {
      const canvas = canvasRef.current || document.createElement('canvas');
      const imageDataUrl = canvas.toDataURL('image/png');
      
      const response = await fetch('http://localhost:3001/api/capture-base64', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageData: imageDataUrl,
          filename: filename
        })
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Image saved to Data_image folder:', result.data.filename);
        return; // Success, no need to fallback to download
      } else {
        console.log('Backend service unavailable, falling back to download');
      }
    } catch (error) {
      console.log('Backend service error, falling back to download:', error);
    }

    // Fallback to browser download if backend is unavailable
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename; // Remove Data_image prefix for download
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    if (isStreaming && videoRef.current) {
      // Simulate camera stream activation
      setStreamActive(true);
      
      // In a real implementation, you would initialize the depth camera here
      // For now, we'll simulate with a placeholder or webcam
      navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: 1920, 
          height: 1080,
          frameRate: 30
        } 
      })
      .then(stream => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch(err => {
        console.log('Camera access denied or not available:', err);
        setStreamActive(false);
      });
    } else {
      setStreamActive(false);
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
        videoRef.current.srcObject = null;
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
            <video
              ref={videoRef}
              className="camera-stream-video"
              autoPlay
              muted
              playsInline
            />
            <div className="camera-stream-info">
              <div>Resolution: {resolution}</div>
              <div>FPS: {frameRate}</div>
              <div>Mode: Depth + RGB</div>
            </div>
          </>
        ) : (
          <div className="camera-stream-placeholder">
            <div>

              <div>Depth Camera Stream</div>
              <div style={{ fontSize: '0.8rem', color: '#666', marginTop: '0.5rem' }}>
                Click "Start Stream" to begin depth camera feed
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
