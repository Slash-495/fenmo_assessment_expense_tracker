import React, { useState } from 'react';
import Dashboard from './pages/Dashboard';
import GroupDetails from './pages/GroupDetails';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');

  return (
    <div style={{ fontFamily: 'sans-serif', backgroundColor: '#f4f6f8', minHeight: '100vh', paddingBottom: '2rem' }}>
      <nav style={{ backgroundColor: '#007bff', padding: '1rem', marginBottom: '2rem' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', gap: '20px' }}>
          <button 
            onClick={() => setCurrentPage('dashboard')}
            style={{ 
              background: 'none', 
              border: 'none', 
              color: 'white', 
              fontSize: '16px', 
              fontWeight: currentPage === 'dashboard' ? 'bold' : 'normal',
              cursor: 'pointer',
              textDecoration: currentPage === 'dashboard' ? 'underline' : 'none'
            }}
          >
            Dashboard
          </button>
          <button 
            onClick={() => setCurrentPage('groups')}
            style={{ 
              background: 'none', 
              border: 'none', 
              color: 'white', 
              fontSize: '16px', 
              fontWeight: currentPage === 'groups' ? 'bold' : 'normal',
              cursor: 'pointer',
              textDecoration: currentPage === 'groups' ? 'underline' : 'none'
            }}
          >
            Group Details
          </button>
        </div>
      </nav>

      <main>
        {currentPage === 'dashboard' && <Dashboard />}
        {currentPage === 'groups' && <GroupDetails />}
      </main>
    </div>
  );
}

export default App;
