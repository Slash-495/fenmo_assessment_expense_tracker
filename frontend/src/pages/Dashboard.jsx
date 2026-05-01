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

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadExpenses();
  }, [filterCategory, sortDateDesc]);

  const handleExpenseAdded = () => {
    loadExpenses();
    loadCategories();
  };

  return (
    <div style={{ maxWidth: '800px', margin: '2rem auto', padding: '1.5rem', border: '1px solid #ddd', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', backgroundColor: 'white' }}>
      <ExpenseForm onExpenseAdded={handleExpenseAdded} />
      
      <h2 style={{ textAlign: 'center', marginTop: '3rem' }}>All Expenses</h2>
      
      <FilterSortBar 
        availableCategories={availableCategories}
        filterCategory={filterCategory}
        setFilterCategory={setFilterCategory}
        sortDateDesc={sortDateDesc}
        setSortDateDesc={setSortDateDesc}
      />

      {error && (
        <div style={{ padding: '10px', backgroundColor: '#f8d7da', color: '#721c24', borderRadius: '4px', textAlign: 'center', marginBottom: '1rem' }}>
          {error}
        </div>
      )}

      {isLoading ? (
        <p style={{ textAlign: 'center', color: '#666', padding: '2rem 0' }}>Loading expenses...</p>
      ) : (
        <ExpenseTable expenses={expenses} />
      )}
    </div>
  );
}

export default Dashboard;
