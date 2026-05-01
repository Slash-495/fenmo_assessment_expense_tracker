const express = require('express');
const cors = require('cors');

const app = express();
const port = 5000;

let expenses = [];
let nextId = 1;

let groups = [];
let nextGroupId = 1;

let groupExpenses = [];
let nextGroupExpenseId = 1;

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

  const existingExpense = expenses.find(exp => 
    exp.amount === Number(amount) && 
    exp.category === category && 
    exp.description === description && 
    exp.date === date
  );

  if (existingExpense) {
    return res.status(200).json(existingExpense);
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

app.get('/groups', (req, res) => {
  res.json(groups);
});

app.post('/groups', (req, res) => {
  const { name, members } = req.body;

  if (!name || !members || !Array.isArray(members)) {
    return res.status(400).json({ error: 'Please provide a valid group name and an array of members' });
  }

  const newGroup = {
    id: nextGroupId++,
    name,
    members,
    created_at: new Date().toISOString()
  };

  groups.push(newGroup);
  res.status(201).json(newGroup);
});

app.post('/groups/:groupId/expenses', (req, res) => {
  const groupId = parseInt(req.params.groupId);
  const { amount, paidBy, participants } = req.body;

  const group = groups.find(g => g.id === groupId);
  if (!group) {
    return res.status(404).json({ error: 'Group not found' });
  }

  if (!amount || !paidBy || !participants || !Array.isArray(participants) || participants.length === 0) {
    return res.status(400).json({ error: 'Please provide amount, paidBy, and an array of participants' });
  }

  const invalidParticipants = participants.filter(p => !group.members.includes(p));
  if (invalidParticipants.length > 0) {
    return res.status(400).json({ error: `Some participants are not in the group: ${invalidParticipants.join(', ')}` });
  }

  const sortedParticipantsStr = [...participants].sort().join(',');
  const existingExpense = groupExpenses.find(exp => 
    exp.groupId === groupId &&
    exp.amount === Number(amount) &&
    exp.paidBy === paidBy &&
    [...exp.participants].sort().join(',') === sortedParticipantsStr
  );

  if (existingExpense) {
    return res.status(200).json(existingExpense);
  }

  const splitAmount = Number((Number(amount) / participants.length).toFixed(2));

  const newGroupExpense = {
    id: nextGroupExpenseId++,
    groupId,
    amount: Number(amount),
    paidBy,
    participants,
    splitAmount,
    created_at: new Date().toISOString()
  };

  groupExpenses.push(newGroupExpense);
  res.status(201).json(newGroupExpense);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
