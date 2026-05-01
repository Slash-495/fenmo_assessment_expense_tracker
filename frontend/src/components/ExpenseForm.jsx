import React, { useState } from 'react';
import { createExpense } from '../services/api';

function ExpenseForm({ onExpenseAdded }) {
  const [formData, setFormData] = useState({ amount: '', category: '', description: '', date: '' });
  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
      console.error(error);
      setStatusMessage({ type: 'error', text: error.message || 'Network error. Make sure the backend is running.' });
    }
  };

  return (
    <>
      <h2 className="card-title" style={{ textAlign: 'center', fontSize: '1.15rem' }}>Add New Expense</h2>

      {statusMessage.text && (
        <div className={`alert ${statusMessage.type === 'success' ? 'alert-success' : 'alert-error'}`}>
          {statusMessage.text}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label>Amount (₹)</label>
            <input type="number" name="amount" value={formData.amount} onChange={handleChange} step="0.01" placeholder="0.00" />
          </div>
          <div className="form-group">
            <label>Category</label>
            <input type="text" name="category" value={formData.category} onChange={handleChange} placeholder="e.g. Food, Travel" />
          </div>
          <div className="form-group">
            <label>Description</label>
            <input type="text" name="description" value={formData.description} onChange={handleChange} placeholder="What was this for?" />
          </div>
          <div className="form-group">
            <label>Date</label>
            <input type="date" name="date" value={formData.date} onChange={handleChange} />
          </div>
        </div>
        <button type="submit" className="btn btn-primary btn-full" style={{ marginTop: '1rem' }}>
          + Add Expense
        </button>
      </form>
    </>
  );
}

export default ExpenseForm;
