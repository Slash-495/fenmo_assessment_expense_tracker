import React from 'react';

function ExpenseTable({ expenses }) {
  const totalAmount = expenses.reduce((sum, exp) => sum + Number(exp.amount), 0);

  if (expenses.length === 0) {
    return <p className="empty-state">No expenses found. Add one above!</p>;
  }

  return (
    <table className="expense-table">
      <thead>
        <tr>
          <th>Date</th>
          <th>Description</th>
          <th>Category</th>
          <th>Amount</th>
        </tr>
      </thead>
      <tbody>
        {expenses.map((expense) => (
          <tr key={expense.id}>
            <td>{expense.date}</td>
            <td>{expense.description}</td>
            <td><span className="badge">{expense.category}</span></td>
            <td>₹{parseFloat(expense.amount).toFixed(2)}</td>
          </tr>
        ))}
      </tbody>
      <tfoot>
        <tr>
          <td colSpan="3" style={{ textAlign: 'right', color: 'var(--muted)' }}>Total</td>
          <td>₹{totalAmount.toFixed(2)}</td>
        </tr>
      </tfoot>
    </table>
  );
}

export default ExpenseTable;
