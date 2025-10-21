// Use relative URLs to go through React dev server proxy (avoids CORS)
// In development: proxy routes to http://192.168.1.2:8000
// In production: you'll need to configure your web server proxy

// Dimension data interface
export interface DimensionData {
  length: number;
  width: number;
  height: number;
}

// API service functions
export const apiService = {
  // Fetch dimension data from backend (called only once on app load)
  // Backend should return JSON: { "length": number, "width": number, "height": number }
  getDimensions: async (): Promise<DimensionData> => {
    try {
      const response = await fetch('/dimension', {
        method: 'GET',
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const rawData = await response.json();
      
      // Handle the API response format and ensure we have the right data structure
      // Convert all dimensions to integers to ensure proper data types
      const dimensionData: DimensionData = {
        length: parseInt(rawData?.length?.toString()) || 0,
        width: parseInt(rawData?.width?.toString()) || 0,
        height: parseInt(rawData?.height?.toString()) || 0
      };
      
      console.log('Parsed dimension data:', dimensionData);
      console.log('Height value type:', typeof dimensionData.height, 'Value:', dimensionData.height);
      
      return dimensionData;
    } catch (error) {
      console.error('Error fetching dimensions:', error);
      throw error;
    }
  },

  // Fetch capture data from backend and download as file
  // Backend should return a base64 encoded string
  // Note: This function is kept for backward compatibility but may not be used in UI
  getCaptureAndDownload: async (): Promise<void> => {
    try {
      console.log('Attempting to fetch capture data from /capture endpoint...');
      
      const response = await fetch('/capture', {
        method: 'GET',
      });
      
      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Capture endpoint not found. Please ensure your backend has the /capture endpoint implemented.');
        }
        throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
      }
      
      const responseText = await response.text();
      console.log('Response text length:', responseText.length);
      console.log('Response text preview:', responseText.substring(0, 200) + '...');
      
      // Validate response
      if (!responseText || responseText.trim().length === 0) {
        throw new Error('Empty response from server');
      }
      
      let base64String: string;
      
      // Try to parse as JSON first (in case backend returns {"data": "base64string"})
      try {
        const jsonResponse = JSON.parse(responseText);
        console.log('Parsed JSON response:', jsonResponse);
        
        // Handle different possible JSON structures
        if (typeof jsonResponse === 'string') {
          base64String = jsonResponse;
        } else if (jsonResponse.data) {
          base64String = jsonResponse.data;
        } else if (jsonResponse.base64) {
          base64String = jsonResponse.base64;
        } else if (jsonResponse.content) {
          base64String = jsonResponse.content;
        } else {
          // If JSON but no recognizable base64 field, use the whole response as string
          base64String = JSON.stringify(jsonResponse);
        }
      } catch (jsonError) {
        // Not JSON, treat as raw text (could be raw base64 or other format)
        console.log('Response is not JSON, treating as raw text');
        base64String = responseText.trim();
      }
      
      // Clean the base64 string (remove whitespace and newlines)
      const cleanBase64 = base64String.replace(/\s/g, '');
      
      // Check if it looks like base64
      const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
      const isBase64 = base64Regex.test(cleanBase64) && cleanBase64.length > 0;
      
      console.log('Is valid base64 format:', isBase64);
      console.log('Clean base64 length:', cleanBase64.length);
      
      let byteArray: Uint8Array;
      
      if (isBase64) {
        console.log('Attempting to decode as base64...');
        // Decode base64 string
        const byteCharacters = atob(cleanBase64);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        byteArray = new Uint8Array(byteNumbers);
      } else {
        console.log('Not base64, treating as raw text data...');
        // If not base64, convert the raw text to bytes
        const encoder = new TextEncoder();
        byteArray = encoder.encode(responseText);
      }
      
      console.log('Final byte array length:', byteArray.length);
      
      // Detect image format from binary data
      const detectImageFormat = (bytes: Uint8Array): { extension: string; mimeType: string } => {
        if (bytes.length < 4) {
          return { extension: 'bin', mimeType: 'application/octet-stream' };
        }
        
        // PNG: 89 50 4E 47 0D 0A 1A 0A
        if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4E && bytes[3] === 0x47) {
          return { extension: 'png', mimeType: 'image/png' };
        }
        
        // JPEG: FF D8 FF
        if (bytes[0] === 0xFF && bytes[1] === 0xD8 && bytes[2] === 0xFF) {
          return { extension: 'jpg', mimeType: 'image/jpeg' };
        }
        
        // GIF: 47 49 46 38 (GIF8)
        if (bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x38) {
          return { extension: 'gif', mimeType: 'image/gif' };
        }
        
        // WebP: 52 49 46 46 ... 57 45 42 50 (RIFF...WEBP)
        if (bytes.length >= 12 && 
            bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46 &&
            bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50) {
          return { extension: 'webp', mimeType: 'image/webp' };
        }
        
        // BMP: 42 4D
        if (bytes[0] === 0x42 && bytes[1] === 0x4D) {
          return { extension: 'bmp', mimeType: 'image/bmp' };
        }
        
        // TIFF: 49 49 2A 00 (little endian) or 4D 4D 00 2A (big endian)
        if ((bytes[0] === 0x49 && bytes[1] === 0x49 && bytes[2] === 0x2A && bytes[3] === 0x00) ||
            (bytes[0] === 0x4D && bytes[1] === 0x4D && bytes[2] === 0x00 && bytes[3] === 0x2A)) {
          return { extension: 'tiff', mimeType: 'image/tiff' };
        }
        
        // If base64 was decoded but no image format detected, assume it's binary data
        return isBase64 ? 
          { extension: 'bin', mimeType: 'application/octet-stream' } : 
          { extension: 'txt', mimeType: 'text/plain' };
      };
      
      const imageFormat = detectImageFormat(byteArray);
      console.log('Detected image format:', imageFormat);
      
      // Create blob with appropriate MIME type
      const blob = new Blob([new Uint8Array(byteArray)], { type: imageFormat.mimeType });
      const url = window.URL.createObjectURL(blob);
      
      // Generate filename with detected extension
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const fileExtension = imageFormat.extension;
      
      // Create temporary download link
      const link = document.createElement('a');
      link.href = url;
      link.download = `capture_${timestamp}.${fileExtension}`;
      document.body.appendChild(link);
      link.click();
      
      console.log('File download triggered successfully');
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('Error fetching capture data:', error);
      
      // Provide more specific error messages
      if (error instanceof DOMException && error.name === 'InvalidCharacterError') {
        throw new Error('Failed to decode base64 data from server. The response may not be valid base64.');
      }
      
      throw error;
    }
  },

  // View captured image in a new window/tab
  // Fetches the same capture data but displays it instead of downloading
  viewCapturedImage: async (): Promise<void> => {
    try {
      console.log('Fetching capture data for viewing...');
      
      const response = await fetch('/capture', {
        method: 'GET',
      });
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Capture endpoint not found. Please ensure your backend has the /capture endpoint implemented.');
        }
        throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
      }
      
      const responseText = await response.text();
      
      // Validate response
      if (!responseText || responseText.trim().length === 0) {
        throw new Error('Empty response from server');
      }
      
      let base64String: string;
      
      // Try to parse as JSON first
      try {
        const jsonResponse = JSON.parse(responseText);
        
        // Handle different possible JSON structures
        if (typeof jsonResponse === 'string') {
          base64String = jsonResponse;
        } else if (jsonResponse.data) {
          base64String = jsonResponse.data;
        } else if (jsonResponse.base64) {
          base64String = jsonResponse.base64;
        } else if (jsonResponse.content) {
          base64String = jsonResponse.content;
        } else {
          base64String = JSON.stringify(jsonResponse);
        }
      } catch (jsonError) {
        base64String = responseText.trim();
      }
      
      // Clean the base64 string
      const cleanBase64 = base64String.replace(/\s/g, '');
      
      // Check if it looks like base64
      const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
      const isBase64 = base64Regex.test(cleanBase64) && cleanBase64.length > 0;
      
      if (!isBase64) {
        throw new Error('Invalid image data received from server');
      }
      
      // Create data URL for image display
      const dataUrl = `data:image/png;base64,${cleanBase64}`;
      
      // Open image in new window
      const newWindow = window.open('', '_blank');
      if (newWindow) {
        newWindow.document.write(`
          <!DOCTYPE html>
          <html>
          <head>
            <title>Captured Image - ${new Date().toLocaleString()}</title>
            <style>
              body {
                margin: 0;
                padding: 20px;
                background-color: #f5f5f5;
                font-family: Arial, sans-serif;
                display: flex;
                flex-direction: column;
                align-items: center;
              }
              .header {
                background: white;
                padding: 15px;
                border-radius: 8px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                margin-bottom: 20px;
                text-align: center;
              }
              .image-container {
                background: white;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                max-width: 90vw;
                max-height: 80vh;
                overflow: auto;
              }
              img {
                max-width: 100%;
                height: auto;
                border-radius: 4px;
              }
              .download-btn {
                margin-top: 15px;
                padding: 10px 20px;
                background-color: #2196F3;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 14px;
              }
              .download-btn:hover {
                background-color: #1976D2;
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h2>Captured Image</h2>
              <p>Captured at: ${new Date().toLocaleString()}</p>
            </div>
            <div class="image-container">
              <img src="${dataUrl}" alt="Captured Image" />
              <div style="text-align: center;">
                <button class="download-btn" onclick="downloadImage()">Download Image</button>
              </div>
            </div>
            <script>
              function downloadImage() {
                const link = document.createElement('a');
                link.href = '${dataUrl}';
                link.download = 'capture_${new Date().toISOString().replace(/[:.]/g, '-')}.png';
                link.click();
              }
            </script>
          </body>
          </html>
        `);
        newWindow.document.close();
      } else {
        throw new Error('Failed to open image viewer window. Please check your browser popup settings.');
      }
      
    } catch (error) {
      console.error('Error viewing capture image:', error);
      throw error;
    }
  },

  // Get streaming URL for MJPEG video feed from backend
  // Backend returns multipart/x-mixed-replace stream with JPEG frames
  getStreamingUrl: (): string => {
    // Return the streaming endpoint URL
    // This will be used as src for an img element to display MJPEG stream
    return '/capture/streaming';
  }
};

export default apiService;
