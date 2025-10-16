import React, { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header';
import LeftSidebar from './components/LeftSidebar';
import DataTable from './components/DataTable';
import CameraStream from './components/CameraStream';
import EditModal from './components/EditModal';
import { mockTableData, TableRow } from './data/mockData';

function App() {
  const [tableData, setTableData] = useState<TableRow[]>(mockTableData);
  const [isStreaming, setIsStreaming] = useState(false);
  const [currentOrderId, setCurrentOrderId] = useState<string>('');
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<TableRow | null>(null);

  // Get the latest order from table data
  useEffect(() => {
    if (tableData.length > 0) {
      // Get the most recent order (first in the list)
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
    console.log('Delete item:', id);
    setTableData(prev => prev.filter(item => item.id !== id));
  };

  const handleStartStream = () => {
    setIsStreaming(true);
    console.log('Starting depth camera stream...');
  };

  const handleStopStream = () => {
    setIsStreaming(false);
    console.log('Stopping depth camera stream...');
  };

  const handleCapture = () => {
    console.log('Capturing depth image...');
    // In real implementation, this would capture and process the depth image
    
    // Simulate adding a new scan result
    const newScanId = (tableData.length + 1).toString();
    const currentDate = new Date();
    const dateStr = String(currentDate.getMonth() + 1).padStart(2, '0') + String(currentDate.getDate()).padStart(2, '0');
    const orderNumber = String(tableData.length + 1).padStart(3, '0');
    
    const newScan: TableRow = {
      id: newScanId,
      orderNo: `Pallet_2025_${dateStr}_${orderNumber}`,
      length: Math.floor(Math.random() * 1000) + 500, // Random between 500-1500
      width: Math.floor(Math.random() * 800) + 400,   // Random between 400-1200
      height: Math.floor(Math.random() * 600) + 200,  // Random between 200-800
      weight: Math.round((Math.random() * 20 + 5) * 10) / 10, // Random between 5-25 kg
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
  };

  // Get current scan data for left sidebar (latest entry)
  const currentScan = tableData.length > 0 ? {
    id: tableData[0].id,
    name: `Scan ${tableData[0].id}`,
    dimensions: {
      length: tableData[0].length,
      width: tableData[0].width,
      height: tableData[0].height,
      unit: 'mm' as const
    },
    volume: (tableData[0].length * tableData[0].width * tableData[0].height) / 1000000, // cubic cm
    weight: tableData[0].weight,
    scanTimestamp: new Date(),
    confidence: 95,
    status: tableData[0].status === 'Complete' ? 'completed' as const : 'scanning' as const
  } : undefined;

  return (
    <div className="app">
      <Header />
      
      <div className="main-content">
        <LeftSidebar 
          currentOrder={currentOrderId || "No Active Order"}
          currentDevice="Testing_01"
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