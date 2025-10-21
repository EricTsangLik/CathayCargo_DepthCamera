import React from 'react';
import { TableRow } from '../types';

interface DataTableProps {
  data: TableRow[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onView: (id: string) => void;
  loading?: boolean;
  error?: string | null;
}

const DataTable: React.FC<DataTableProps> = ({ data, onEdit, onDelete, onView, loading, error }) => {
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
          {loading ? (
            <tr>
              <td colSpan={9} style={{ textAlign: 'center', padding: '2rem' }}>
                Loading data...
              </td>
            </tr>
          ) : error ? (
            <tr>
              <td colSpan={9} style={{ textAlign: 'center', padding: '2rem' }}>
                <div style={{ color: '#f44336' }}>
                  <div style={{ marginBottom: '1rem' }}>Failed to load data from server</div>
                  <div style={{ fontSize: '0.9rem', color: '#666' }}>{error}</div>
                  <button 
                    onClick={() => window.location.reload()} 
                    style={{ 
                      marginTop: '1rem', 
                      padding: '0.5rem 1rem', 
                      backgroundColor: '#2196F3', 
                      color: 'white', 
                      border: 'none', 
                      borderRadius: '4px', 
                      cursor: 'pointer' 
                    }}
                  >
                    Retry
                  </button>
                </div>
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={9} style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
                No scan data available
              </td>
            </tr>
          ) : (
            data.map((row, index) => (
              <tr key={row.id}>
                <td>{data.length - index}</td>
                <td>{row.orderNo}</td>
                <td>{row.length}</td>
                <td>{row.width}</td>
                <td>{row.height}</td>
                <td>{row.weight || '0'}</td>
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
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <button 
                      className="action-btn"
                      onClick={() => onView(row.id)}
                      title="View captured image"
                    >
                      View
                    </button>
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
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
