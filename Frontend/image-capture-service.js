const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = 3001;

// Enable CORS for frontend
app.use(cors());
app.use(express.json());

// Create Data_image directory if it doesn't exist
const dataImageDir = path.join(__dirname, 'Data_image');
if (!fs.existsSync(dataImageDir)) {
  fs.mkdirSync(dataImageDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, dataImageDir);
  },
  filename: (req, file, cb) => {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `depth_capture_${timestamp}.png`;
    cb(null, filename);
  }
});

const upload = multer({ storage });

// Endpoint to save captured images
app.post('/api/capture', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    const imageInfo = {
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size,
      path: req.file.path,
      timestamp: new Date().toISOString()
    };

    console.log(`Image saved: ${req.file.filename}`);
    
    res.json({
      success: true,
      message: 'Image saved successfully',
      data: imageInfo
    });
  } catch (error) {
    console.error('Error saving image:', error);
    res.status(500).json({ error: 'Failed to save image' });
  }
});

// Endpoint to save base64 image data
app.post('/api/capture-base64', (req, res) => {
  try {
    const { imageData, filename } = req.body;
    
    if (!imageData) {
      return res.status(400).json({ error: 'No image data provided' });
    }

    // Remove data URL prefix if present
    const base64Data = imageData.replace(/^data:image\/png;base64,/, '');
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const finalFilename = filename || `depth_capture_${timestamp}.png`;
    const filePath = path.join(dataImageDir, finalFilename);
    
    // Write base64 data to file
    fs.writeFileSync(filePath, base64Data, 'base64');
    
    const imageInfo = {
      filename: finalFilename,
      path: filePath,
      timestamp: new Date().toISOString(),
      size: fs.statSync(filePath).size
    };

    console.log(`Image saved: ${finalFilename}`);
    
    res.json({
      success: true,
      message: 'Image saved successfully to Data_image folder',
      data: imageInfo
    });
  } catch (error) {
    console.error('Error saving base64 image:', error);
    res.status(500).json({ error: 'Failed to save image' });
  }
});

// Endpoint to list captured images
app.get('/api/images', (req, res) => {
  try {
    const files = fs.readdirSync(dataImageDir)
      .filter(file => file.endsWith('.png'))
      .map(file => {
        const filePath = path.join(dataImageDir, file);
        const stats = fs.statSync(filePath);
        return {
          filename: file,
          size: stats.size,
          created: stats.birthtime,
          modified: stats.mtime
        };
      })
      .sort((a, b) => b.created - a.created); // Sort by newest first

    res.json({
      success: true,
      count: files.length,
      images: files
    });
  } catch (error) {
    console.error('Error listing images:', error);
    res.status(500).json({ error: 'Failed to list images' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Image capture service is running',
    dataImageDir: dataImageDir
  });
});

app.listen(PORT, () => {
  console.log(`Image capture service running on port ${PORT}`);
  console.log(`Images will be saved to: ${dataImageDir}`);
});

module.exports = app;
