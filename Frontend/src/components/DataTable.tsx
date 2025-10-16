import React from 'react';
import { TableRow } from '../data/mockData';

interface DataTableProps {
  data: TableRow[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const DataTable: React.FC<DataTableProps> = ({ data, onEdit, onDelete }) => {
  return (
    <div className="data-table-container">
      <table className="data-table">
        <thead>
          <tr>
            <th>Item#</th>
            <th>Order_ID</th>
            <th>Length (mm)</th>
            <th>Width (mm)</th>
            <th>Height (mm)</th>
            <th>Weight (kg)</th>
            <th>Capture</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={row.id}>
              <td>{data.length - index}</td>
              <td>{row.orderNo}</td>
              <td>{row.length}</td>
              <td>{row.width}</td>
              <td>{row.height}</td>
              <td>{row.weight}</td>
              <td>{row.captureTime}</td>
              <td>
                <span style={{ 
                  color: row.status === 'Complete' ? '#4CAF50' : '#FFC107',
                  fontWeight: '500'
                }}>
                  {row.status}
                </span>
              </td>
              <td>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button 
                    className="action-btn"
                    onClick={() => onEdit(row.id)}
                  >
                    Edit
                  </button>
                  <button 
                    className="action-btn secondary"
                    onClick={() => onDelete(row.id)}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
