const API_BASE_URL = 'http://localhost:5000';

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
