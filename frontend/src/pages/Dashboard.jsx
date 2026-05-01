import React, { useState, useEffect } from 'react';
import ExpenseForm from '../components/ExpenseForm';
import FilterSortBar from '../components/FilterSortBar';
import ExpenseTable from '../components/ExpenseTable';
import { getExpenses, getCategories } from '../services/api';

function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [filterCategory, setFilterCategory] = useState('');
  const [sortDateDesc, setSortDateDesc] = useState(false);
  const [availableCategories, setAvailableCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadExpenses = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getExpenses(filterCategory, sortDateDesc);
      setExpenses(data);
    } catch (err) {
      console.error(err);
      setError('Failed to load expenses. Please make sure the backend is running.');
    } finally {
      setIsLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const categories = await getCategories();
      setAvailableCategories(categories);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => { loadCategories(); }, []);
  useEffect(() => { loadExpenses(); }, [filterCategory, sortDateDesc]);

  const handleExpenseAdded = () => {
    loadExpenses();
    loadCategories();
  };

  return (
    <div className="page">
      <div className="card">
        <ExpenseForm onExpenseAdded={handleExpenseAdded} />
      </div>

      <div className="card">
        <h2 className="card-title">All Expenses</h2>

        <FilterSortBar
          availableCategories={availableCategories}
          filterCategory={filterCategory}
          setFilterCategory={setFilterCategory}
          sortDateDesc={sortDateDesc}
          setSortDateDesc={setSortDateDesc}
        />

        {error && (
          <div className="alert alert-error">{error}</div>
        )}

        {isLoading ? (
          <p className="empty-state">Loading expenses...</p>
        ) : (
          <ExpenseTable expenses={expenses} />
        )}
      </div>
    </div>
  );
}

export default Dashboard;
