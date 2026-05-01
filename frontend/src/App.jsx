import React, { useState, useEffect } from 'react'

function App() {
  const [message, setMessage] = useState('Loading...');

  useEffect(() => {
    fetch('http://localhost:5000/')
      .then(res => res.text())
      .then(data => setMessage(data))
      .catch(err => {
        console.error(err);
        setMessage('Failed to connect to backend');
      });
  }, []);

  return (
    <div style={{ fontFamily: 'sans-serif', padding: '2rem' }}>
      <h1>Expense Tracker</h1>
      <div style={{ padding: '1rem', background: '#f0f0f0', borderRadius: '8px' }}>
        <h2>Backend Status:</h2>
        <p>{message}</p>
      </div>
    </div>
  )
}

export default App
