import React, { useState } from 'react';
import Dashboard from './pages/Dashboard';
import GroupDetails from './pages/GroupDetails';
import FriendsBalances from './pages/FriendsBalances';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');

  return (
    <div>
      <nav className="navbar">
        <div className="navbar-inner">
          <span className="navbar-brand">💸 SplitTrack</span>
          <button
            className={`nav-btn ${currentPage === 'dashboard' ? 'active' : ''}`}
            onClick={() => setCurrentPage('dashboard')}
          >
            Dashboard
          </button>
          <button
            className={`nav-btn ${currentPage === 'groups' ? 'active' : ''}`}
            onClick={() => setCurrentPage('groups')}
          >
            Groups
          </button>
          <button
            className={`nav-btn ${currentPage === 'friends' ? 'active' : ''}`}
            onClick={() => setCurrentPage('friends')}
          >
            Friends & Balances
          </button>
        </div>
      </nav>

      <main>
        {currentPage === 'dashboard' && <Dashboard />}
        {currentPage === 'groups'    && <GroupDetails />}
        {currentPage === 'friends'   && <FriendsBalances />}
      </main>
    </div>
  );
}

export default App;
