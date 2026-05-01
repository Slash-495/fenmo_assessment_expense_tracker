import React, { useState, useEffect } from 'react';
import { getGroups, createGroup, createGroupExpense, getGroupExpenses, getGroupBalances, settleGroupDebt } from '../services/api';

function GroupDetails() {
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);

  // Create Group
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupMembers, setNewGroupMembers] = useState('');
  const [groupStatus, setGroupStatus] = useState({ type: '', text: '' });
  const [isLoading, setIsLoading] = useState(false);

  // Add Expense
  const [expenseAmount, setExpenseAmount] = useState('');
  const [paidBy, setPaidBy] = useState('');
  const [selectedParticipants, setSelectedParticipants] = useState([]);
  const [isCustomSplit, setIsCustomSplit] = useState(false);
  const [customSplits, setCustomSplits] = useState({});
  const [expenseStatus, setExpenseStatus] = useState({ type: '', text: '' });

  // History & Balances
  const [groupExpenses, setGroupExpenses] = useState([]);
  const [isLoadingExpenses, setIsLoadingExpenses] = useState(false);
  const [groupBalances, setGroupBalances] = useState({ simplifiedDebts: [], memberBalances: {} });
  const [isLoadingBalances, setIsLoadingBalances] = useState(false);
  const [settleStatus, setSettleStatus] = useState({ type: '', text: '' });

  // ── Loaders ───────────────────────────────────────────────
  const loadGroups = async () => {
    setIsLoading(true);
    try {
      setGroups(await getGroups());
    } catch (err) {
      setGroupStatus({ type: 'error', text: 'Failed to load groups.' });
    } finally {
      setIsLoading(false);
    }
  };

  const loadGroupExpenses = async (id) => {
    setIsLoadingExpenses(true);
    try { setGroupExpenses(await getGroupExpenses(id)); }
    catch (err) { console.error(err); }
    finally { setIsLoadingExpenses(false); }
  };

  const loadGroupBalances = async (id) => {
    setIsLoadingBalances(true);
    try { setGroupBalances(await getGroupBalances(id)); }
    catch (err) { console.error(err); }
    finally { setIsLoadingBalances(false); }
  };

  const refreshGroup = (id) => {
    loadGroupExpenses(id);
    loadGroupBalances(id);
  };

  useEffect(() => { loadGroups(); }, []);

  useEffect(() => {
    if (selectedGroup) {
      setExpenseAmount('');
      setPaidBy(selectedGroup.members[0] || '');
      setSelectedParticipants([...selectedGroup.members]);
      setIsCustomSplit(false);
      const splits = {};
      selectedGroup.members.forEach(m => { splits[m] = ''; });
      setCustomSplits(splits);
      setExpenseStatus({ type: '', text: '' });
      setSettleStatus({ type: '', text: '' });
      refreshGroup(selectedGroup.id);
    }
  }, [selectedGroup]);

  // ── Handlers ──────────────────────────────────────────────
  const handleCreateGroup = async (e) => {
    e.preventDefault();
    setGroupStatus({ type: '', text: '' });
    if (!newGroupName.trim() || !newGroupMembers.trim()) {
      setGroupStatus({ type: 'error', text: 'Group name and members are required.' });
      return;
    }
    const membersArray = newGroupMembers.split(',').map(m => m.trim()).filter(Boolean);
    if (membersArray.length < 2) {
      setGroupStatus({ type: 'error', text: 'A group needs at least 2 members.' });
      return;
    }
    try {
      await createGroup(newGroupName, membersArray);
      setGroupStatus({ type: 'success', text: 'Group created!' });
      setNewGroupName('');
      setNewGroupMembers('');
      loadGroups();
    } catch (error) {
      setGroupStatus({ type: 'error', text: error.message || 'Failed to create group.' });
    }
  };

  const handleParticipantToggle = (member) => {
    setSelectedParticipants(prev =>
      prev.includes(member) ? prev.filter(m => m !== member) : [...prev, member]
    );
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();
    setExpenseStatus({ type: '', text: '' });
    if (!expenseAmount || Number(expenseAmount) <= 0) {
      setExpenseStatus({ type: 'error', text: 'Amount must be positive.' });
      return;
    }
    if (selectedParticipants.length === 0) {
      setExpenseStatus({ type: 'error', text: 'Select at least one participant.' });
      return;
    }
    const expenseData = { amount: expenseAmount, paidBy, participants: selectedParticipants };
    if (isCustomSplit) {
      const activeCustomSplits = {};
      let totalSplit = 0;
      for (const p of selectedParticipants) {
        const val = Number(customSplits[p]) || 0;
        activeCustomSplits[p] = val;
        totalSplit += val;
      }
      if (Math.abs(totalSplit - Number(expenseAmount)) > 0.01) {
        setExpenseStatus({ type: 'error', text: `Custom splits (${totalSplit.toFixed(2)}) must equal total (${Number(expenseAmount).toFixed(2)}).` });
        return;
      }
      expenseData.customSplits = activeCustomSplits;
    }
    try {
      await createGroupExpense(selectedGroup.id, expenseData);
      setExpenseStatus({ type: 'success', text: 'Expense added!' });
      setExpenseAmount('');
      const resetSplits = {};
      selectedGroup.members.forEach(m => { resetSplits[m] = ''; });
      setCustomSplits(resetSplits);
      refreshGroup(selectedGroup.id);
    } catch (error) {
      setExpenseStatus({ type: 'error', text: error.message || 'Failed to add expense.' });
    }
  };

  const handleSettle = async (debt) => {
    setSettleStatus({ type: '', text: '' });
    try {
      await settleGroupDebt(selectedGroup.id, debt.from, debt.to, debt.amount);
      setSettleStatus({ type: 'success', text: `✅ Settled! ${debt.from} paid ${debt.to} ₹${debt.amount.toFixed(2)}.` });
      refreshGroup(selectedGroup.id);
    } catch (err) {
      setSettleStatus({ type: 'error', text: err.message || 'Failed to settle.' });
    }
  };

  // ── Group Detail View ──────────────────────────────────────
  if (selectedGroup) {
    return (
      <div className="page">
        <button className="btn btn-ghost" style={{ marginBottom: '1rem' }} onClick={() => setSelectedGroup(null)}>
          ← Back to Groups
        </button>

        {/* Header */}
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <h1 style={{ fontSize: '1.4rem', marginBottom: '4px' }}>{selectedGroup.name}</h1>
          <p className="members-text">👥 {selectedGroup.members.join(', ')}</p>
        </div>

        {/* Add Expense Form */}
        <div className="card">
          <h2 className="card-title">Add Group Expense</h2>

          {expenseStatus.text && (
            <div className={`alert ${expenseStatus.type === 'success' ? 'alert-success' : 'alert-error'}`}>
              {expenseStatus.text}
            </div>
          )}

          <form onSubmit={handleAddExpense}>
            <div className="form-grid">
              <div className="form-group">
                <label>Total Amount (₹)</label>
                <input type="number" step="0.01" value={expenseAmount} onChange={(e) => setExpenseAmount(e.target.value)} placeholder="0.00" />
              </div>
              <div className="form-group">
                <label>Paid By</label>
                <select value={paidBy} onChange={(e) => setPaidBy(e.target.value)}>
                  {selectedGroup.members.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>

              <div className="form-group full">
                <label>Participants</label>
                <div className="checkbox-group" style={{ marginTop: '4px' }}>
                  {selectedGroup.members.map(m => (
                    <label key={m} className="checkbox-label">
                      <input type="checkbox" checked={selectedParticipants.includes(m)} onChange={() => handleParticipantToggle(m)} />
                      {m}
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-group full">
                <label className="checkbox-label" style={{ textTransform: 'none', letterSpacing: 0, fontSize: '0.9rem' }}>
                  <input type="checkbox" checked={isCustomSplit} onChange={(e) => setIsCustomSplit(e.target.checked)} />
                  Custom Splits
                </label>
              </div>
            </div>

            {isCustomSplit && (
              <div className="splits-form" style={{ marginTop: '0.75rem' }}>
                <p className="splits-form-title">Custom Amounts</p>
                {selectedGroup.members.map(m => {
                  if (!selectedParticipants.includes(m)) return null;
                  return (
                    <div key={m} className="split-row">
                      <label>{m}</label>
                      <input type="number" step="0.01" value={customSplits[m]}
                        onChange={(e) => setCustomSplits({ ...customSplits, [m]: e.target.value })}
                        placeholder="0.00" />
                    </div>
                  );
                })}
              </div>
            )}

            <button type="submit" className="btn btn-primary btn-full" style={{ marginTop: '1rem' }}>
              Submit Expense
            </button>
          </form>
        </div>

        {/* Current Balances */}
        <div className="card">
          <h2 className="card-title">Current Balances</h2>

          {settleStatus.text && (
            <div className={`alert ${settleStatus.type === 'success' ? 'alert-success' : 'alert-error'}`}>
              {settleStatus.text}
            </div>
          )}

          {isLoadingBalances ? (
            <p className="empty-state">Loading balances...</p>
          ) : groupBalances.simplifiedDebts.length === 0 ? (
            <div className="settled-banner">✅ Everyone is settled up!</div>
          ) : (
            <div>
              {groupBalances.simplifiedDebts.map((debt, index) => (
                <div key={index} className="balance-row owe">
                  <span><strong>{debt.from}</strong> owes <strong>{debt.to}</strong></span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <span className="balance-amount">₹{debt.amount.toFixed(2)}</span>
                    <button className="btn btn-success btn-sm" onClick={() => handleSettle(debt)}>
                      Settle Up
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Expense History */}
        <div className="card">
          <h2 className="card-title">Expense History</h2>

          {isLoadingExpenses ? (
            <p className="empty-state">Loading history...</p>
          ) : groupExpenses.length === 0 ? (
            <p className="empty-state">No expenses recorded yet.</p>
          ) : (
            <div>
              {groupExpenses.map(exp =>
                exp.isSettlement ? (
                  <div key={exp.id} className="settle-card">
                    <span>🤝 <strong>{exp.paidBy}</strong> settled up with <strong>{Object.keys(exp.splits)[0]}</strong></span>
                    <div style={{ textAlign: 'right' }}>
                      <span className="settle-amount">₹{exp.amount.toFixed(2)}</span>
                      <div style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>{new Date(exp.created_at).toLocaleDateString()}</div>
                    </div>
                  </div>
                ) : (
                  <div key={exp.id} className="exp-card">
                    <div className="exp-card-header">
                      <span className="exp-card-amount">₹{exp.amount.toFixed(2)}</span>
                      <span className="exp-card-date">{new Date(exp.created_at).toLocaleDateString()}</span>
                    </div>
                    <span className="paid-badge">💳 {exp.paidBy} paid</span>
                    <ul className="splits-list">
                      {Object.entries(exp.splits).map(([person, amount]) => (
                        <li key={person}>{person}: ₹{amount.toFixed(2)}</li>
                      ))}
                    </ul>
                  </div>
                )
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── Groups Dashboard ───────────────────────────────────────
  return (
    <div className="page">
      {/* Create Group */}
      <div className="card">
        <h2 className="card-title">Create New Group</h2>

        {groupStatus.text && (
          <div className={`alert ${groupStatus.type === 'success' ? 'alert-success' : 'alert-error'}`}>
            {groupStatus.text}
          </div>
        )}

        <form onSubmit={handleCreateGroup}>
          <div className="form-grid">
            <div className="form-group">
              <label>Group Name</label>
              <input type="text" value={newGroupName} onChange={(e) => setNewGroupName(e.target.value)} placeholder="e.g. Trip to Goa" />
            </div>
            <div className="form-group">
              <label>Members (comma-separated)</label>
              <input type="text" value={newGroupMembers} onChange={(e) => setNewGroupMembers(e.target.value)} placeholder="Alice, Bob, Charlie" />
            </div>
          </div>
          <button type="submit" className="btn btn-primary btn-full" style={{ marginTop: '1rem' }}>
            + Create Group
          </button>
        </form>
      </div>

      {/* Groups List */}
      <div className="card">
        <h2 className="card-title">Your Groups</h2>

        {isLoading ? (
          <p className="empty-state">Loading groups...</p>
        ) : groups.length === 0 ? (
          <p className="empty-state">No groups yet. Create one above!</p>
        ) : (
          <div className="group-grid">
            {groups.map(group => (
              <div key={group.id} className="group-card" onClick={() => setSelectedGroup(group)}>
                <h3>{group.name}</h3>
                <p>{group.members.length} members</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default GroupDetails;
