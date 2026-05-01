import React, { useState } from 'react';

function App() {
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

    try {
      const response = await fetch('http://localhost:5000/expenses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatusMessage({ type: 'success', text: 'Expense added successfully!' });
        setFormData({ amount: '', category: '', description: '', date: '' });
      } else {
        const errData = await response.json();
        setStatusMessage({ type: 'error', text: errData.error || 'Failed to add expense' });
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setStatusMessage({ type: 'error', text: 'Network error. Make sure the backend is running.' });
    }
  };

  return (
    <div style={{ fontFamily: 'sans-serif', maxWidth: '500px', margin: '2rem auto', padding: '1.5rem', border: '1px solid #ddd', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
      <h1 style={{ textAlign: 'center', marginTop: 0 }}>Add New Expense</h1>
      
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
            required 
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
            required 
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
            required 
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
            required 
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc' }}
          />
        </div>

        <button type="submit" style={{ padding: '12px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px', marginTop: '10px' }}>
          Add Expense
        </button>
      </form>
    </div>
  );
}

export default App;
