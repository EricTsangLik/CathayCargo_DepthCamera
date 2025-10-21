// TypeScript interfaces for the Smart Scanning System

export interface GoodsDimensions {
  length: number;
  width: number;
  height: number;
  unit: 'mm' | 'cm' | 'in';
}

export interface GoodsData {
  id: string;
  name: string;
  dimensions: GoodsDimensions;
  volume: number;
  weight?: number;
  scanTimestamp: Date;
  confidence: number; // 0-100 percentage
  status: 'scanning' | 'completed' | 'error';
}

// Table row interface for API data
export interface TableRow {
  id: string;
  orderNo: string;
  length: number;
  width: number;
  height: number;
  weight: number;
  captureTime: string;
  status: string;
}

// System status interface
export interface SystemStatusType {
  dbStatus: 'waiting' | 'ready';
  socketId: 'waiting' | 'ready';
  deviceStatus: 'waiting' | 'ready';
}

// API response interfaces
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ApiError {
  success: false;
  error: string;
  message: string;
}

export interface ScanningStatus {
  isActive: boolean;
  currentOperation: string;
  progress: number; // 0-100 percentage
  lastScanTime?: Date;
  totalScansToday: number;
}

export interface CameraStatus {
  isConnected: boolean;
  resolution: string;
  frameRate: number;
  depthRange: {
    min: number;
    max: number;
  };
}

export interface SystemStatus {
  camera: CameraStatus;
  scanning: ScanningStatus;
  backend: {
    isConnected: boolean;
    lastHeartbeat?: Date;
    version: string;
  };
}
