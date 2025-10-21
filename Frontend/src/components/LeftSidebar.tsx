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
    return weight != null ? `${weight.toFixed(1)} kg` : '0.0 kg';
  };

  return (
    <div className="left-sidebar">
      <div className="order-info">
        <div className="order-title">Order_id:</div>
        <div className="order-id">{currentOrder}</div>
      </div>
      
      <div className="device-info">
        <div className="device-title">Device_id:</div>
        <div className="device-id">{currentDevice}</div>
      </div>
      
      <div className="dimensions-section">
        <div className="dimensions-title">Dimensions</div>
        
        <div className="dimension-item">
          <span className="dimension-label">Length:</span>
          <span className="dimension-value">
            {currentScan ? formatDimension(currentScan.dimensions.length) : '--- mm'}
          </span>
        </div>
        
        <div className="dimension-item">
          <span className="dimension-label">Width:</span>
          <span className="dimension-value">
            {currentScan ? formatDimension(currentScan.dimensions.width) : '--- mm'}
          </span>
        </div>
        
        <div className="dimension-item">
          <span className="dimension-label">Height:</span>
          <span className="dimension-value">
            {currentScan ? formatDimension(currentScan.dimensions.height) : '--- mm'}
          </span>
        </div>
        
        <div className="dimension-item">
          <span className="dimension-label">Weight:</span>
          <span className="dimension-value">
            {currentScan ? formatWeight(currentScan.weight) : '0.0 kg'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default LeftSidebar;
