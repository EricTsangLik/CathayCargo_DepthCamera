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


  // Fetch dimensions from backend on component mount
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

  const handleView = async (id: string) => {
    try {
      console.log(`Viewing captured image for scan ID: ${id}`);
      await apiService.viewCapturedImage();
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


  const handleCapture = async () => {
    try {
      // Use loaded dimensions or default values if API is not available
      const defaultDimensions = { length: 0, width: 0, height: 0 };
      const useDimensions = dimensions || defaultDimensions;
      
      // Create new scan entry (frontend operation)
      const newScanId = (tableData.length + 1).toString();
      const currentDate = new Date();
      const dateStr = String(currentDate.getMonth() + 1).padStart(2, '0') + String(currentDate.getDate()).padStart(2, '0');
      const orderNumber = String(tableData.length + 1).padStart(3, '0');
      
      const newScan: TableRow = {
        id: newScanId,
        orderNo: `Pallet_2025_${dateStr}_${orderNumber}`,
        length: useDimensions.length,
        width: useDimensions.width,
        height: useDimensions.height,
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
        status: 'Processing'
      };
      
      setTableData(prev => [newScan, ...prev]);
      
      console.log('New scan entry created:', newScan);
      
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