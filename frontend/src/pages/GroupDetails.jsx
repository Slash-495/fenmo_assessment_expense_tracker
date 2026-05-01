import React, { useState, useEffect } from 'react';
import { getGroups, createGroup } from '../services/api';

function GroupDetails() {
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupMembers, setNewGroupMembers] = useState('');
  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });
  const [isLoading, setIsLoading] = useState(false);

  const loadGroups = async () => {
    setIsLoading(true);
    try {
      const data = await getGroups();
      setGroups(data);
    } catch (err) {
      console.error(err);
      setStatusMessage({ type: 'error', text: 'Failed to load groups.' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadGroups();
  }, []);

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    setStatusMessage({ type: '', text: '' });

    if (!newGroupName.trim()) {
      setStatusMessage({ type: 'error', text: 'Group name is required.' });
      return;
    }

    if (!newGroupMembers.trim()) {
      setStatusMessage({ type: 'error', text: 'Members are required.' });
      return;
    }

    const membersArray = newGroupMembers.split(',').map(m => m.trim()).filter(Boolean);
    if (membersArray.length < 2) {
      setStatusMessage({ type: 'error', text: 'A group needs at least 2 members.' });
      return;
    }

    try {
      await createGroup(newGroupName, membersArray);
      setStatusMessage({ type: 'success', text: 'Group created successfully!' });
      setNewGroupName('');
      setNewGroupMembers('');
      loadGroups();
    } catch (error) {
      console.error(error);
      setStatusMessage({ type: 'error', text: error.message || 'Failed to create group.' });
    }
  };

  if (selectedGroup) {
    return (
      <div style={{ maxWidth: '800px', margin: '2rem auto', padding: '1.5rem', border: '1px solid #ddd', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', backgroundColor: 'white' }}>
        <button 
          onClick={() => setSelectedGroup(null)}
          style={{ marginBottom: '1rem', background: 'none', border: 'none', color: '#007bff', cursor: 'pointer', fontSize: '16px', padding: 0 }}
        >
          ← Back to Groups
        </button>
        
        <h1 style={{ marginTop: 0 }}>{selectedGroup.name}</h1>
        <p style={{ color: '#666' }}>Members: {selectedGroup.members.join(', ')}</p>
        
        <hr style={{ margin: '2rem 0', border: 'none', borderTop: '1px solid #eee' }} />
        
        <p style={{ textAlign: 'center', color: '#999', fontStyle: 'italic' }}>
          Group expense submission and balances will be implemented here.
        </p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '2rem auto', padding: '1.5rem', border: '1px solid #ddd', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', backgroundColor: 'white' }}>
      <h1 style={{ textAlign: 'center', marginTop: 0 }}>Groups Dashboard</h1>

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

      <div style={{ marginBottom: '3rem', padding: '1.5rem', backgroundColor: '#f8f9fa', borderRadius: '8px', border: '1px solid #e9ecef' }}>
        <h2 style={{ marginTop: 0, marginBottom: '1rem', fontSize: '1.2rem' }}>Create New Group</h2>
        <form onSubmit={handleCreateGroup} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Group Name:</label>
            <input 
              type="text" 
              value={newGroupName} 
              onChange={(e) => setNewGroupName(e.target.value)} 
              placeholder="e.g., Trip to Goa"
              style={{ width: '100%', padding: '8px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Members (comma-separated):</label>
            <input 
              type="text" 
              value={newGroupMembers} 
              onChange={(e) => setNewGroupMembers(e.target.value)} 
              placeholder="e.g., Alice, Bob, Charlie"
              style={{ width: '100%', padding: '8px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </div>
          <button type="submit" style={{ padding: '10px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px' }}>
            Create Group
          </button>
        </form>
      </div>

      <h2 style={{ marginBottom: '1rem' }}>Your Groups</h2>
      
      {isLoading ? (
        <p style={{ textAlign: 'center', color: '#666' }}>Loading groups...</p>
      ) : groups.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#666', fontStyle: 'italic' }}>No groups found. Create one above!</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '15px' }}>
          {groups.map(group => (
            <div 
              key={group.id} 
              onClick={() => setSelectedGroup(group)}
              style={{ 
                padding: '1.5rem', 
                border: '1px solid #007bff', 
                borderRadius: '8px', 
                cursor: 'pointer', 
                textAlign: 'center',
                transition: 'transform 0.2s, box-shadow 0.2s',
                backgroundColor: '#f8fbff'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,123,255,0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <h3 style={{ margin: '0 0 10px 0', color: '#0056b3' }}>{group.name}</h3>
              <p style={{ margin: 0, color: '#666', fontSize: '0.9em' }}>{group.members.length} members</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default GroupDetails;
