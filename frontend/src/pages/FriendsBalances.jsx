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
        if (result.members.length > 0) {
          setCurrentUser(result.members[0]);
        }
      } catch (err) {
        console.error(err);
        setError('Failed to load global balances.');
      } finally {
        setIsLoading(false);
      }
    };
    loadBalances();
  }, []);

  if (isLoading) return <p style={{ textAlign: 'center', marginTop: '2rem' }}>Loading balances...</p>;
  if (error) return <p style={{ textAlign: 'center', color: 'red', marginTop: '2rem' }}>{error}</p>;

  if (data.members.length === 0) {
    return (
      <div style={{ maxWidth: '600px', margin: '2rem auto', textAlign: 'center', padding: '2rem', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
        <h1 style={{ marginTop: 0 }}>Friends & Balances</h1>
        <p style={{ color: '#666', fontStyle: 'italic' }}>No friends or groups found yet. Create some groups and add expenses first!</p>
      </div>
    );
  }

  const relevantDebts = data.simplifiedDebts.filter(d => d.from === currentUser || d.to === currentUser);

  return (
    <div style={{ maxWidth: '600px', margin: '2rem auto', padding: '2rem', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
      <h1 style={{ textAlign: 'center', marginTop: 0 }}>Friends & Balances</h1>
      
      <div style={{ marginBottom: '2rem', padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '8px', border: '1px solid #e9ecef' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Who are you?</label>
        <select 
          value={currentUser} 
          onChange={(e) => setCurrentUser(e.target.value)}
          style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '16px' }}
        >
          {data.members.map(m => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
      </div>

      <h2 style={{ marginBottom: '1rem' }}>Your Balances</h2>
      {relevantDebts.length === 0 ? (
        <p style={{ color: '#666', fontStyle: 'italic', textAlign: 'center', padding: '2rem', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>You are all settled up!</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {relevantDebts.map((debt, index) => {
            if (debt.from === currentUser) {
              return (
                <div key={index} style={{ padding: '15px', borderRadius: '8px', border: '1px solid #f5c6cb', backgroundColor: '#f8d7da', color: '#721c24', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>You owe <strong>{debt.to}</strong></span>
                  <strong style={{ fontSize: '1.2em' }}>₹{debt.amount.toFixed(2)}</strong>
                </div>
              );
            } else {
              return (
                <div key={index} style={{ padding: '15px', borderRadius: '8px', border: '1px solid #c3e6cb', backgroundColor: '#d4edda', color: '#155724', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span><strong>{debt.from}</strong> owes you</span>
                  <strong style={{ fontSize: '1.2em' }}>₹{debt.amount.toFixed(2)}</strong>
                </div>
              );
            }
          })}
        </div>
      )}
    </div>
  );
}

export default FriendsBalances;
