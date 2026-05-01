import React, { useState } from 'react';
import { createExpense } from '../services/api';

function ExpenseForm({ onExpenseAdded }) {
  const [formData, setFormData] = useState({
    amount: '',
    category: '',
    description: '',
    date: ''
  });
  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusMessage({ type: '', text: '' });

    if (!formData.amount || Number(formData.amount) <= 0) {
      setStatusMessage({ type: 'error', text: 'Amount must be a positive number.' });
      return;
    }
    
    if (!formData.category.trim()) {
      setStatusMessage({ type: 'error', text: 'Category is required.' });
      return;
    }

    if (!formData.description.trim()) {
      setStatusMessage({ type: 'error', text: 'Description is required.' });
      return;
    }

    if (!formData.date) {
      setStatusMessage({ type: 'error', text: 'Date is required.' });
      return;
    }

    try {
      await createExpense(formData);
      setStatusMessage({ type: 'success', text: 'Expense added successfully!' });
      setFormData({ amount: '', category: '', description: '', date: '' });
      if (onExpenseAdded) onExpenseAdded();
    } catch (error) {
      console.error('Error submitting form:', error);
      setStatusMessage({ type: 'error', text: error.message || 'Network error. Make sure the backend is running.' });
    }
  };

  return (
    <>
      <h2 style={{ textAlign: 'center', marginTop: 0 }}>Add New Expense</h2>
      
      {statusMessage.text && (
        <div style={{ 
          padding: '10px', 
          marginBottom: '15px', 
          borderRadius: '4px',
          backgroundColor: statusMessage.type === 'success' ? '#d4edda' : '#f8d7da',
          color: statusMessage.type === 'success' ? '#155724' : '#721c24'
        }}>
          {statusMessage.text}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Amount:</label>
          <input 
            type="number" 
            name="amount" 
            value={formData.amount} 
            onChange={handleChange} 
            step="0.01"
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc' }}
          />
        </div>
        
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Category:</label>
          <input 
            type="text" 
            name="category" 
            value={formData.category} 
            onChange={handleChange} 
            placeholder="e.g., Food, Travel"
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Description:</label>
          <input 
            type="text" 
            name="description" 
            value={formData.description} 
            onChange={handleChange} 
            placeholder="What was it for?"
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Date:</label>
          <input 
            type="date" 
            name="date" 
            value={formData.date} 
            onChange={handleChange} 
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc' }}
          />
        </div>

        <button type="submit" style={{ padding: '12px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px', marginTop: '10px' }}>
          Add Expense
        </button>
      </form>
    </>
  );
}

export default ExpenseForm;
