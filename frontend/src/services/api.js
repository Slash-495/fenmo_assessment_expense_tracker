const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const getExpenses = async (filterCategory, sortDateDesc) => {
  let url = `${API_BASE_URL}/expenses`;
  const params = new URLSearchParams();
  if (filterCategory) params.append('category', filterCategory);
  if (sortDateDesc) params.append('sort', 'date_desc');
  
  const queryString = params.toString();
  if (queryString) url += `?${queryString}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch expenses');
  }
  return response.json();
};

export const getCategories = async () => {
  const response = await fetch(`${API_BASE_URL}/expenses`);
  if (!response.ok) {
    throw new Error('Failed to fetch categories');
  }
  const data = await response.json();
  return [...new Set(data.map(exp => exp.category))].filter(Boolean);
};

export const createExpense = async (expenseData) => {
  const response = await fetch(`${API_BASE_URL}/expenses`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(expenseData),
  });

  if (!response.ok) {
    const errData = await response.json();
    throw new Error(errData.error || 'Failed to add expense');
  }
  return response.json();
};

export const getGroups = async () => {
  const response = await fetch(`${API_BASE_URL}/groups`);
  if (!response.ok) {
    throw new Error('Failed to fetch groups');
  }
  return response.json();
};

export const createGroup = async (name, members) => {
  const response = await fetch(`${API_BASE_URL}/groups`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, members }),
  });

  if (!response.ok) {
    const errData = await response.json();
    throw new Error(errData.error || 'Failed to create group');
  }
  return response.json();
};

export const createGroupExpense = async (groupId, expenseData) => {
  const response = await fetch(`${API_BASE_URL}/groups/${groupId}/expenses`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(expenseData),
  });

  if (!response.ok) {
    const errData = await response.json();
    throw new Error(errData.error || 'Failed to add group expense');
  }
  return response.json();
};

export const getGlobalBalances = async () => {
  const response = await fetch(`${API_BASE_URL}/balances`);
  if (!response.ok) {
    throw new Error('Failed to fetch global balances');
  }
  return response.json();
};

export const getGroupExpenses = async (groupId) => {
  const response = await fetch(`${API_BASE_URL}/groups/${groupId}/expenses`);
  if (!response.ok) {
    throw new Error('Failed to fetch group expenses');
  }
  return response.json();
};

export const getGroupBalances = async (groupId) => {
  const response = await fetch(`${API_BASE_URL}/groups/${groupId}/balances`);
  if (!response.ok) {
    throw new Error('Failed to fetch group balances');
  }
  return response.json();
};

export const settleGroupDebt = async (groupId, debtor, creditor, amount) => {
  const response = await fetch(`${API_BASE_URL}/groups/${groupId}/settle`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ debtor, creditor, amount }),
  });
  if (!response.ok) {
    const errData = await response.json();
    throw new Error(errData.error || 'Failed to settle debt');
  }
  return response.json();
};
