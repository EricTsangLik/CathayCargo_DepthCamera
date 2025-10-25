import React, { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header';
import LeftSidebar from './components/LeftSidebar';
import DataTable from './components/DataTable';
import CameraStream from './components/CameraStream';
import EditModal from './components/EditModal';
import { TableRow } from './types';
import { apiService, DimensionData } from './services/api';

function App() {
  const [tableData, setTableData] = useState<TableRow[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [currentOrderId, setCurrentOrderId] = useState<string>('');
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<TableRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [dimensions, setDimensions] = useState<DimensionData | null>(null);


  // Fetch dimensions from backend on component mount (initial load)
  useEffect(() => {
    const fetchDimensions = async () => {
      try {
        setLoading(true);
        const dimensionData = await apiService.getDimensions();
        setDimensions(dimensionData);
      } catch (err) {
        console.error('Error fetching dimensions (will work without API):', err);
        setDimensions(null);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDimensions();
  }, []);
  

  // Update current order when table data changes
  useEffect(() => {
    if (tableData.length > 0) {
      setCurrentOrderId(tableData[0].orderNo);
    }
  }, [tableData]);

  const handleEdit = (id: string) => {
    const itemToEdit = tableData.find(item => item.id === id);
    if (itemToEdit) {
      setEditingItem(itemToEdit);
      setEditModalOpen(true);
    }
  };

  const handleSaveEdit = (updatedItem: TableRow) => {
    // Frontend-only operation
    setTableData(prev => 
      prev.map(item => 
        item.id === updatedItem.id ? updatedItem : item
      )
    );
    setEditModalOpen(false);
    setEditingItem(null);
  };

  const handleCancelEdit = () => {
    setEditModalOpen(false);
    setEditingItem(null);
  };

  const handleDelete = (id: string) => {
    // Frontend-only operation
    setTableData(prev => prev.filter(item => item.id !== id));
  };

  const handleView = (id: string) => {
    try {
      console.log(`Viewing captured image for scan ID: ${id}`);
      
      // Find the scan entry
      const scanEntry = tableData.find(item => item.id === id);
      
      if (!scanEntry) {
        alert('Scan entry not found');
        return;
      }
      
      if (!scanEntry.imageData) {
        alert('No image available for this scan. The image may not have been captured.');
        return;
      }
      
      // Open image in new window
      const newWindow = window.open('', '_blank');
      if (newWindow) {
        newWindow.document.write(`
          <!DOCTYPE html>
          <html>
          <head>
            <title>Captured Image - ${scanEntry.orderNo}</title>
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
                width: 100%;
                max-width: 800px;
              }
              .info-grid {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 10px;
                margin-top: 15px;
                text-align: left;
              }
              .info-item {
                padding: 8px;
                background: #f8f9fa;
                border-radius: 4px;
              }
              .info-label {
                font-weight: bold;
                color: #666;
                font-size: 0.9rem;
              }
              .info-value {
                color: #333;
                margin-top: 4px;
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
                display: block;
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
              <p><strong>Order No:</strong> ${scanEntry.orderNo}</p>
              <p><strong>Capture Time:</strong> ${scanEntry.captureTime}</p>
              <div class="info-grid">
                <div class="info-item">
                  <div class="info-label">Length</div>
                  <div class="info-value">${scanEntry.length} mm</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Width</div>
                  <div class="info-value">${scanEntry.width} mm</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Height</div>
                  <div class="info-value">${scanEntry.height} mm</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Weight</div>
                  <div class="info-value">${scanEntry.weight} kg</div>
                </div>
              </div>
            </div>
            <div class="image-container">
              <img src="${scanEntry.imageData}" alt="Captured Image - ${scanEntry.orderNo}" />
              <div style="text-align: center;">
                <button class="download-btn" onclick="downloadImage()">Download Image</button>
              </div>
            </div>
            <script>
              function downloadImage() {
                const link = document.createElement('a');
                link.href = '${scanEntry.imageData}';
                link.download = '${scanEntry.orderNo}_${scanEntry.captureTime.replace(/[: ]/g, '-')}.png';
                link.click();
              }
            </script>
          </body>
          </html>
        `);
        newWindow.document.close();
      } else {
        alert('Failed to open image viewer window. Please check your browser popup settings.');
      }
      
    } catch (error) {
      console.error('Error viewing captured image:', error);
      alert(`Failed to view image: ${(error as Error).message}`);
    }
  };

  const handleStartStream = () => {
    setIsStreaming(true);
    console.log('Starting depth camera stream...');
  };

  const handleStopStream = () => {
    setIsStreaming(false);
    console.log('Stopping depth camera stream...');
  };


  const handleCapture = async (imageData: string) => {
    try {
      // Fetch fresh dimension data from backend when capture button is pressed
      console.log('Fetching fresh dimension data...');
      let freshDimensions: DimensionData;
      
      try {
        freshDimensions = await apiService.getDimensions();
        setDimensions(freshDimensions); // Update the state with fresh data
        console.log('Fresh dimensions fetched:', freshDimensions);
      } catch (err) {
        console.error('Error fetching fresh dimensions, using cached or default values:', err);
        // Fallback to existing dimensions or defaults if fetch fails
        const defaultDimensions = { length: 0, width: 0, height: 0 };
        freshDimensions = dimensions || defaultDimensions;
      }
      
      // Create new scan entry (frontend operation)
      const newScanId = (tableData.length + 1).toString();
      const currentDate = new Date();
      const dateStr = String(currentDate.getMonth() + 1).padStart(2, '0') + String(currentDate.getDate()).padStart(2, '0');
      const orderNumber = String(tableData.length + 1).padStart(3, '0');
      
      const newScan: TableRow = {
        id: newScanId,
        orderNo: `Pallet_2025_${dateStr}_${orderNumber}`,
        length: freshDimensions.length,
        width: freshDimensions.width,
        height: freshDimensions.height,
        weight: 0, // Set weight to 0
        captureTime: new Date().toLocaleString('en-CA', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false
        }).replace(/,/g, ''),
        status: 'Processing',
        imageData: imageData // Store the captured image data
      };
      
      setTableData(prev => [newScan, ...prev]);
      
      console.log('New scan entry created with image data:', newScan);
      
      // Update status to complete after 2 seconds
      setTimeout(() => {
        setTableData(prev => 
          prev.map(item => 
            item.id === newScanId 
              ? { ...item, status: 'Complete' }
              : item
          )
        );
      }, 2000);
      
    } catch (error) {
      console.error('Error during capture process:', error);
    }
  };

  // Get current scan data for left sidebar (use dimensions from API, latest table entry, or defaults)
  const defaultDimensions = { length: 0, width: 0, height: 0 };
  const displayDimensions = dimensions || (tableData.length > 0 ? {
    length: tableData[0].length,
    width: tableData[0].width,
    height: tableData[0].height
  } : defaultDimensions);
  
  
  const currentScan = {
    id: tableData.length > 0 ? tableData[0].id : 'default',
    name: dimensions ? 'Live Dimensions' : tableData.length > 0 ? `Scan ${tableData[0].id}` : 'Default Dimensions',
    dimensions: {
      length: displayDimensions.length,
      width: displayDimensions.width,
      height: displayDimensions.height,
      unit: 'mm' as const
    },
    volume: (displayDimensions.length * displayDimensions.width * displayDimensions.height) / 1000000,
    weight: tableData.length > 0 ? tableData[0].weight : 0,
    scanTimestamp: new Date(),
    confidence: 95,
    status: tableData.length > 0 && tableData[0].status === 'Complete' ? 'completed' as const : 'scanning' as const
  };


  return (
    <div className="app">
      <Header />
      
      <div className="main-content">
        <LeftSidebar 
          currentOrder={currentOrderId || "No Active Order"}
          currentDevice="SSS-Testing-01"
          currentScan={currentScan}
        />
        
        <div className="right-content">
          
          <CameraStream 
            isStreaming={isStreaming}
            onStartStream={handleStartStream}
            onStopStream={handleStopStream}
            onCapture={handleCapture}
          />
          
          <DataTable 
            data={tableData}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onView={handleView}
            loading={loading}
            error={null}
          />
        </div>
      </div>
      
      <EditModal
        isOpen={editModalOpen}
        item={editingItem}
        onSave={handleSaveEdit}
        onCancel={handleCancelEdit}
      />
    </div>
  );
}

export default App;