const express = require('express');
const cors = require('cors');

const app = express();
const port = 5000;

let expenses = [];
let nextId = 1;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Backend is running!');
});

app.post('/expenses', (req, res) => {
  const { amount, category, description, date } = req.body;

  if (!amount || !category || !description || !date) {
    return res.status(400).json({ error: 'Please provide amount, category, description, and date' });
  }

  const newExpense = {
    id: nextId++,
    amount: Number(amount),
    category,
    description,
    date,
    created_at: new Date().toISOString()
  };

  expenses.push(newExpense);
  res.status(201).json(newExpense);
});

app.get('/expenses', (req, res) => {
  const { category, sort } = req.query;
  
  let result = [...expenses];

  if (category) {
    result = result.filter(exp => exp.category === category);
  }

  if (sort === 'date_desc') {
    result.sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  res.json(result);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
