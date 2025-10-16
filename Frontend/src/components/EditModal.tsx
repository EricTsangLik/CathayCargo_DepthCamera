import React, { useState, useEffect } from 'react';
import { TableRow } from '../data/mockData';

interface EditModalProps {
  isOpen: boolean;
  item: TableRow | null;
  onSave: (updatedItem: TableRow) => void;
  onCancel: () => void;
}

const EditModal: React.FC<EditModalProps> = ({ isOpen, item, onSave, onCancel }) => {
  const [formData, setFormData] = useState<TableRow>({
    id: '',
    orderNo: '',
    length: 0,
    width: 0,
    height: 0,
    weight: 0,
    captureTime: '',
    status: 'Complete'
  });

  useEffect(() => {
    if (item) {
      setFormData(item);
    }
  }, [item]);

  const handleInputChange = (field: keyof TableRow, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Edit Item</h2>
          <button className="modal-close-btn" onClick={onCancel}>×</button>
        </div>
        
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="orderNo">Order No</label>
              <input
                type="text"
                id="orderNo"
                value={formData.orderNo}
                onChange={(e) => handleInputChange('orderNo', e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="length">Length (mm)</label>
              <input
                type="number"
                id="length"
                value={formData.length}
                onChange={(e) => handleInputChange('length', Number(e.target.value))}
                min="0"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="width">Width (mm)</label>
              <input
                type="number"
                id="width"
                value={formData.width}
                onChange={(e) => handleInputChange('width', Number(e.target.value))}
                min="0"
                required
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="height">Height (mm)</label>
              <input
                type="number"
                id="height"
                value={formData.height}
                onChange={(e) => handleInputChange('height', Number(e.target.value))}
                min="0"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="weight">Weight (kg)</label>
              <input
                type="number"
                id="weight"
                value={formData.weight}
                onChange={(e) => handleInputChange('weight', Number(e.target.value))}
                min="0"
                step="0.1"
                required
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="status">Status</label>
              <select
                id="status"
                value={formData.status}
                onChange={(e) => handleInputChange('status', e.target.value)}
              >
                <option value="Complete">Complete</option>
                <option value="Processing">Processing</option>
                <option value="Error">Error</option>
              </select>
            </div>
          </div>
          
          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" className="btn-save">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditModal;
