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

  const loadExpenses = async () => {
    try {
      const data = await getExpenses(filterCategory, sortDateDesc);
      setExpenses(data);
    } catch (error) {
      console.error(error);
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

      <ExpenseTable expenses={expenses} />
    </div>
  );
}

export default Dashboard;
