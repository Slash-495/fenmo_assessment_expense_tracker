import React from 'react';

function ExpenseTable({ expenses }) {
  const totalAmount = expenses.reduce((sum, exp) => sum + Number(exp.amount), 0);

  if (expenses.length === 0) {
    return <p style={{ textAlign: 'center', color: '#666' }}>No expenses found.</p>;
  }

  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
      <thead>
        <tr style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #dee2e6' }}>
          <th style={{ padding: '12px', textAlign: 'left' }}>Date</th>
          <th style={{ padding: '12px', textAlign: 'left' }}>Description</th>
          <th style={{ padding: '12px', textAlign: 'left' }}>Category</th>
          <th style={{ padding: '12px', textAlign: 'right' }}>Amount</th>
        </tr>
      </thead>
      <tbody>
        {expenses.map((expense) => (
          <tr key={expense.id} style={{ borderBottom: '1px solid #dee2e6' }}>
            <td style={{ padding: '12px' }}>{expense.date}</td>
            <td style={{ padding: '12px' }}>{expense.description}</td>
            <td style={{ padding: '12px' }}>{expense.category}</td>
            <td style={{ padding: '12px', textAlign: 'right' }}>₹{parseFloat(expense.amount).toFixed(2)}</td>
          </tr>
        ))}
      </tbody>
      <tfoot>
        <tr style={{ backgroundColor: '#f8f9fa', fontWeight: 'bold' }}>
          <td colSpan="3" style={{ padding: '12px', textAlign: 'right', fontSize: '1.1em' }}>Total:</td>
          <td style={{ padding: '12px', textAlign: 'right', fontSize: '1.1em' }}>₹{totalAmount.toFixed(2)}</td>
        </tr>
      </tfoot>
    </table>
  );
}

export default ExpenseTable;
