import React, { useState, useEffect } from 'react';
import { getGroups, createGroup, createGroupExpense, getGroupExpenses, getGroupBalances, settleGroupDebt } from '../services/api';

function GroupDetails() {
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  
  // Create Group State
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupMembers, setNewGroupMembers] = useState('');
  const [groupStatusMessage, setGroupStatusMessage] = useState({ type: '', text: '' });
  const [isLoading, setIsLoading] = useState(false);

  // Add Expense State
  const [expenseAmount, setExpenseAmount] = useState('');
  const [paidBy, setPaidBy] = useState('');
  const [selectedParticipants, setSelectedParticipants] = useState([]);
  const [isCustomSplit, setIsCustomSplit] = useState(false);
  const [customSplits, setCustomSplits] = useState({});
  const [expenseStatusMessage, setExpenseStatusMessage] = useState({ type: '', text: '' });
  
  // History State
  const [groupExpenses, setGroupExpenses] = useState([]);
  const [isLoadingExpenses, setIsLoadingExpenses] = useState(false);

  // Balances State
  const [groupBalances, setGroupBalances] = useState({ simplifiedDebts: [], memberBalances: {} });
  const [isLoadingBalances, setIsLoadingBalances] = useState(false);
  const [settleStatusMessage, setSettleStatusMessage] = useState({ type: '', text: '' });

  const loadGroups = async () => {
    setIsLoading(true);
    try {
      const data = await getGroups();
      setGroups(data);
    } catch (err) {
      console.error(err);
      setGroupStatusMessage({ type: 'error', text: 'Failed to load groups.' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadGroups();
  }, []);

  const loadGroupExpenses = async (groupId) => {
    setIsLoadingExpenses(true);
    try {
      const data = await getGroupExpenses(groupId);
      setGroupExpenses(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingExpenses(false);
    }
  };

  const loadGroupBalances = async (groupId) => {
    setIsLoadingBalances(true);
    try {
      const data = await getGroupBalances(groupId);
      setGroupBalances(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingBalances(false);
    }
  };

  // When a group is selected, initialize the expense form state and load history
  useEffect(() => {
    if (selectedGroup) {
      setExpenseAmount('');
      setPaidBy(selectedGroup.members[0] || '');
      setSelectedParticipants([...selectedGroup.members]);
      setIsCustomSplit(false);
      
      const initialSplits = {};
      selectedGroup.members.forEach(m => {
        initialSplits[m] = '';
      });
      setCustomSplits(initialSplits);
      setExpenseStatusMessage({ type: '', text: '' });
      
      loadGroupExpenses(selectedGroup.id);
      loadGroupBalances(selectedGroup.id);
    }
  }, [selectedGroup]);

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    setGroupStatusMessage({ type: '', text: '' });

    if (!newGroupName.trim() || !newGroupMembers.trim()) {
      setGroupStatusMessage({ type: 'error', text: 'Group name and members are required.' });
      return;
    }

    const membersArray = newGroupMembers.split(',').map(m => m.trim()).filter(Boolean);
    if (membersArray.length < 2) {
      setGroupStatusMessage({ type: 'error', text: 'A group needs at least 2 members.' });
      return;
    }

    try {
      await createGroup(newGroupName, membersArray);
      setGroupStatusMessage({ type: 'success', text: 'Group created successfully!' });
      setNewGroupName('');
      setNewGroupMembers('');
      loadGroups();
    } catch (error) {
      console.error(error);
      setGroupStatusMessage({ type: 'error', text: error.message || 'Failed to create group.' });
    }
  };

  const handleParticipantToggle = (member) => {
    if (selectedParticipants.includes(member)) {
      setSelectedParticipants(selectedParticipants.filter(m => m !== member));
    } else {
      setSelectedParticipants([...selectedParticipants, member]);
    }
  };

  const handleCustomSplitChange = (member, value) => {
    setCustomSplits({
      ...customSplits,
      [member]: value
    });
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();
    setExpenseStatusMessage({ type: '', text: '' });

    if (!expenseAmount || Number(expenseAmount) <= 0) {
      setExpenseStatusMessage({ type: 'error', text: 'Amount must be positive.' });
      return;
    }

    if (selectedParticipants.length === 0) {
      setExpenseStatusMessage({ type: 'error', text: 'Select at least one participant.' });
      return;
    }

    const expenseData = {
      amount: expenseAmount,
      paidBy: paidBy,
      participants: selectedParticipants
    };

    if (isCustomSplit) {
      const activeCustomSplits = {};
      let totalSplit = 0;
      
      for (const p of selectedParticipants) {
        const val = Number(customSplits[p]) || 0;
        activeCustomSplits[p] = val;
        totalSplit += val;
      }

      if (Math.abs(totalSplit - Number(expenseAmount)) > 0.01) {
        setExpenseStatusMessage({ type: 'error', text: `Custom splits sum (${totalSplit.toFixed(2)}) must equal the total amount (${Number(expenseAmount).toFixed(2)}).` });
        return;
      }
      
      expenseData.customSplits = activeCustomSplits;
    }

    try {
      await createGroupExpense(selectedGroup.id, expenseData);
      setExpenseStatusMessage({ type: 'success', text: 'Group expense added successfully!' });
      setExpenseAmount('');
      
      loadGroupExpenses(selectedGroup.id);
      loadGroupBalances(selectedGroup.id);
      
      const resetSplits = {};
      selectedGroup.members.forEach(m => {
        resetSplits[m] = '';
      });
      setCustomSplits(resetSplits);
    } catch (error) {
      console.error(error);
      setExpenseStatusMessage({ type: 'error', text: error.message || 'Failed to add group expense.' });
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
        
        <h2>Add Group Expense</h2>
        
        {expenseStatusMessage.text && (
          <div style={{ 
            padding: '10px', 
            marginBottom: '15px', 
            borderRadius: '4px',
            backgroundColor: expenseStatusMessage.type === 'success' ? '#d4edda' : '#f8d7da',
            color: expenseStatusMessage.type === 'success' ? '#155724' : '#721c24'
          }}>
            {expenseStatusMessage.text}
          </div>
        )}

        <form onSubmit={handleAddExpense} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Total Amount (₹):</label>
            <input 
              type="number" 
              step="0.01"
              value={expenseAmount} 
              onChange={(e) => setExpenseAmount(e.target.value)} 
              style={{ width: '100%', padding: '8px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Paid By:</label>
            <select 
              value={paidBy} 
              onChange={(e) => setPaidBy(e.target.value)}
              style={{ width: '100%', padding: '8px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc' }}
            >
              {selectedGroup.members.map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Participants:</label>
            <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
              {selectedGroup.members.map(m => (
                <label key={m} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <input 
                    type="checkbox" 
                    checked={selectedParticipants.includes(m)}
                    onChange={() => handleParticipantToggle(m)}
                  />
                  {m}
                </label>
              ))}
            </div>
          </div>

          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 'bold', cursor: 'pointer' }}>
              <input 
                type="checkbox" 
                checked={isCustomSplit}
                onChange={(e) => setIsCustomSplit(e.target.checked)}
              />
              Use Custom Splits
            </label>
          </div>

          {isCustomSplit && (
            <div style={{ padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '4px', border: '1px solid #e9ecef' }}>
              <h4 style={{ marginTop: 0, marginBottom: '10px' }}>Custom Split Amounts</h4>
              {selectedGroup.members.map(m => {
                if (!selectedParticipants.includes(m)) return null;
                return (
                  <div key={m} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px', gap: '10px' }}>
                    <label style={{ width: '100px' }}>{m}:</label>
                    <input 
                      type="number" 
                      step="0.01"
                      value={customSplits[m]} 
                      onChange={(e) => handleCustomSplitChange(m, e.target.value)} 
                      placeholder="Amount"
                      style={{ padding: '6px', borderRadius: '4px', border: '1px solid #ccc' }}
                    />
                  </div>
                );
              })}
            </div>
          )}

          <button type="submit" style={{ padding: '12px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px', marginTop: '10px' }}>
            Submit Group Expense
          </button>
        </form>

        <hr style={{ margin: '3rem 0 2rem 0', border: 'none', borderTop: '1px solid #eee' }} />
        
        <h2>Current Balances</h2>
        {settleStatusMessage.text && (
          <div style={{
            padding: '10px',
            marginBottom: '15px',
            borderRadius: '4px',
            backgroundColor: settleStatusMessage.type === 'success' ? '#d4edda' : '#f8d7da',
            color: settleStatusMessage.type === 'success' ? '#155724' : '#721c24'
          }}>
            {settleStatusMessage.text}
          </div>
        )}
        {isLoadingBalances ? (
          <p style={{ color: '#666' }}>Loading balances...</p>
        ) : groupBalances.simplifiedDebts.length === 0 ? (
          <div style={{ padding: '1rem', backgroundColor: '#d4edda', borderRadius: '8px', color: '#155724', textAlign: 'center' }}>
            ✅ Everyone is settled up!
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {groupBalances.simplifiedDebts.map((debt, index) => (
              <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 15px', borderRadius: '8px', border: '1px solid #f5c6cb', backgroundColor: '#f8d7da' }}>
                <span style={{ color: '#721c24' }}>
                  <strong>{debt.from}</strong> owes <strong>{debt.to}</strong>
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <strong style={{ color: '#721c24' }}>₹{debt.amount.toFixed(2)}</strong>
                  <button
                    onClick={async () => {
                      setSettleStatusMessage({ type: '', text: '' });
                      try {
                        await settleGroupDebt(selectedGroup.id, debt.from, debt.to, debt.amount);
                        setSettleStatusMessage({ type: 'success', text: `Settled! ${debt.from} paid ${debt.to} ₹${debt.amount.toFixed(2)}.` });
                        loadGroupExpenses(selectedGroup.id);
                        loadGroupBalances(selectedGroup.id);
                      } catch (err) {
                        setSettleStatusMessage({ type: 'error', text: err.message || 'Failed to settle.' });
                      }
                    }}
                    style={{ padding: '6px 14px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.9em', whiteSpace: 'nowrap' }}
                  >
                    Settle Up
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <hr style={{ margin: '3rem 0 2rem 0', border: 'none', borderTop: '1px solid #eee' }} />
        
        <h2>Group Expense History</h2>
        {isLoadingExpenses ? (
          <p style={{ color: '#666' }}>Loading history...</p>
        ) : groupExpenses.length === 0 ? (
          <p style={{ color: '#666', fontStyle: 'italic' }}>No expenses recorded yet.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {groupExpenses.map(exp => (
              exp.isSettlement ? (
                <div key={exp.id} style={{ padding: '12px 15px', borderRadius: '8px', border: '1px dashed #adb5bd', backgroundColor: '#f8f9fa', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#555', fontStyle: 'italic' }}>
                    🤝 <strong>{exp.paidBy}</strong> settled up with <strong>{Object.keys(exp.splits)[0]}</strong>
                  </span>
                  <div style={{ textAlign: 'right' }}>
                    <strong style={{ color: '#28a745' }}>₹{exp.amount.toFixed(2)}</strong>
                    <div style={{ fontSize: '0.8em', color: '#888' }}>{new Date(exp.created_at).toLocaleDateString()}</div>
                  </div>
                </div>
              ) : (
                <div key={exp.id} style={{ padding: '15px', borderRadius: '8px', border: '1px solid #ddd', backgroundColor: '#fdfdfd' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <strong style={{ fontSize: '1.2em' }}>₹{exp.amount.toFixed(2)}</strong>
                  <span style={{ fontSize: '0.9em', color: '#888' }}>{new Date(exp.created_at).toLocaleDateString()}</span>
                </div>
                <div style={{ marginBottom: '10px' }}>
                  <span style={{ backgroundColor: '#e2e3e5', padding: '4px 8px', borderRadius: '4px', fontSize: '0.9em', fontWeight: 'bold' }}>
                    {exp.paidBy} paid
                  </span>
                </div>
                <div style={{ fontSize: '0.9em', color: '#555' }}>
                  <strong>Split Details:</strong>
                  <ul style={{ margin: '5px 0 0 0', paddingLeft: '20px' }}>
                    {Object.entries(exp.splits).map(([person, splitAmount]) => (
                      <li key={person}>
                        {person}: ₹{splitAmount.toFixed(2)}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              )
            ))}
          </div>
        )}

      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '2rem auto', padding: '1.5rem', border: '1px solid #ddd', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', backgroundColor: 'white' }}>
      <h1 style={{ textAlign: 'center', marginTop: 0 }}>Groups Dashboard</h1>

      {groupStatusMessage.text && (
        <div style={{ 
          padding: '10px', 
          marginBottom: '15px', 
          borderRadius: '4px',
          backgroundColor: groupStatusMessage.type === 'success' ? '#d4edda' : '#f8d7da',
          color: groupStatusMessage.type === 'success' ? '#155724' : '#721c24'
        }}>
          {groupStatusMessage.text}
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
