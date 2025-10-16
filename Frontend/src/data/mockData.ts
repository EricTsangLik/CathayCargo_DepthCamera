// Updated mock data to match the new interface design

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

export interface SystemStatusType {
  dbStatus: 'waiting' | 'ready';
  socketId: 'waiting' | 'ready';
  deviceStatus: 'waiting' | 'ready';
}

export const mockTableData: TableRow[] = [
  {
    id: '1',
    orderNo: 'Pallet_2025_1011_001',
    length: 1200,
    width: 800,
    height: 600,
    weight: 15.5,
    captureTime: '2024-10-11 14:30:25',
    status: 'Complete'
  },
  {
    id: '2',
    orderNo: 'Pallet_2025_1011_002',
    length: 950,
    width: 650,
    height: 450,
    weight: 12.3,
    captureTime: '2024-10-11 14:28:15',
    status: 'Complete'
  },
  {
    id: '3',
    orderNo: 'Pallet_2025_1011_003',
    length: 1500,
    width: 1000,
    height: 800,
    weight: 22.7,
    captureTime: '2024-10-11 14:25:42',
    status: 'Processing'
  },
  {
    id: '4',
    orderNo: 'Pallet_2025_1011_004',
    length: 750,
    width: 500,
    height: 300,
    weight: 8.9,
    captureTime: '2024-10-11 14:22:18',
    status: 'Complete'
  },
  {
    id: '5',
    orderNo: 'Pallet_2025_1011_005',
    length: 1100,
    width: 750,
    height: 550,
    weight: 18.2,
    captureTime: '2024-10-11 14:20:05',
    status: 'Complete'
  }
];

export const defaultSystemStatus: SystemStatusType = {
  dbStatus: 'waiting',
  socketId: 'waiting',
  deviceStatus: 'ready'
};