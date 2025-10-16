import React from 'react';
import { GoodsData } from '../types';

interface LeftSidebarProps {
  currentOrder: string;
  currentDevice: string;
  currentScan?: GoodsData;
}

const LeftSidebar: React.FC<LeftSidebarProps> = ({ 
  currentOrder, 
  currentDevice, 
  currentScan 
}) => {
  const formatDimension = (value: number): string => {
    return value > 0 ? `${Math.round(value)} mm` : '--- mm';
  };

  const formatWeight = (weight?: number): string => {
    return weight && weight > 0 ? `${weight.toFixed(1)} kg` : '--- kg';
  };

  return (
    <div className="left-sidebar">
      <div className="order-info">
        <div className="order-title">Order_id</div>
        <div className="order-id">{currentOrder}</div>
      </div>
      
      <div className="device-info">
        <div className="device-title">Device_id</div>
        <div className="device-id">{currentDevice}</div>
      </div>
      
      <div className="dimensions-section">
        <div className="dimensions-title">Dimensions</div>
        
        <div className="dimension-item">
          <span className="dimension-label">Length</span>
          <span className="dimension-value">
            {currentScan ? formatDimension(currentScan.dimensions.length) : '1200 mm'}
          </span>
        </div>
        
        <div className="dimension-item">
          <span className="dimension-label">Width</span>
          <span className="dimension-value">
            {currentScan ? formatDimension(currentScan.dimensions.width) : '1460 mm'}
          </span>
        </div>
        
        <div className="dimension-item">
          <span className="dimension-label">Height</span>
          <span className="dimension-value">
            {currentScan ? formatDimension(currentScan.dimensions.height) : '923 mm'}
          </span>
        </div>
        
        <div className="dimension-item">
          <span className="dimension-label">Weight</span>
          <span className="dimension-value">
            {currentScan ? formatWeight(currentScan.weight) : '10.7 kg'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default LeftSidebar;
