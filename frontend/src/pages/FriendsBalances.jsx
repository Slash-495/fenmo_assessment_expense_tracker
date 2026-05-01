import React, { useState, useEffect } from 'react';
import { getGlobalBalances } from '../services/api';

function FriendsBalances() {
  const [data, setData] = useState({ members: [], simplifiedDebts: [] });
  const [currentUser, setCurrentUser] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadBalances = async () => {
      setIsLoading(true);
      try {
        const result = await getGlobalBalances();
        setData(result);
        if (result.members.length > 0) setCurrentUser(result.members[0]);
      } catch (err) {
        console.error(err);
        setError('Failed to load global balances. Make sure the backend is running.');
      } finally {
        setIsLoading(false);
      }
    };
    loadBalances();
  }, []);

  if (isLoading) return <div className="page"><p className="empty-state">Loading balances...</p></div>;

  if (error) return (
    <div className="page">
      <div className="card">
        <div className="alert alert-error">{error}</div>
      </div>
    </div>
  );

  if (data.members.length === 0) {
    return (
      <div className="page">
        <div className="card" style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '1.3rem', marginBottom: '0.5rem' }}>Friends & Balances</h1>
          <p className="empty-state">No groups found yet. Create some groups and add expenses first!</p>
        </div>
      </div>
    );
  }

  const relevantDebts = data.simplifiedDebts.filter(d => d.from === currentUser || d.to === currentUser);

  return (
    <div className="page">
      <div className="card">
        <h1 style={{ fontSize: '1.3rem', marginBottom: '1.25rem' }}>Friends & Balances</h1>

        <div className="identity-box">
          <label style={{ display: 'block', marginBottom: '8px' }}>Who are you?</label>
          <select value={currentUser} onChange={(e) => setCurrentUser(e.target.value)}>
            {data.members.map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>

        <h2 className="section-title" style={{ marginTop: 0 }}>Your Balances</h2>

        {relevantDebts.length === 0 ? (
          <div className="settled-banner">✅ You are all settled up!</div>
        ) : (
          <div>
            {relevantDebts.map((debt, index) =>
              debt.from === currentUser ? (
                <div key={index} className="balance-row owe">
                  <span>You owe <strong>{debt.to}</strong></span>
                  <span className="balance-amount">₹{debt.amount.toFixed(2)}</span>
                </div>
              ) : (
                <div key={index} className="balance-row owed">
                  <span><strong>{debt.from}</strong> owes you</span>
                  <span className="balance-amount">₹{debt.amount.toFixed(2)}</span>
                </div>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default FriendsBalances;
