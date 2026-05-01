# SplitTrack — Full-Stack Expense Tracker

A full-stack expense tracking application with group expense splitting, balance calculation, and settlement tracking. Built with real-world considerations like idempotent API handling and financial calculation correctness.

---

## Tech Stack

| Layer | Technology | Reason |
|---|---|---|
| Backend | Node.js + Express | Lightweight, fast to set up, great for REST APIs |
| Frontend | React + Vite | Component-based UI, fast dev server |
| Storage | In-memory (JS arrays) | Simplicity for rapid prototyping; no DB setup needed |

---

## Features

### Expense Management
- Add personal expenses (amount, category, description, date)
- View all expenses in a clean, sortable table
- Filter by category; sort by newest date
- Dynamic total calculation based on active filters

### Group Expense Splitting
- Create groups with named members
- Add group expenses with automatic equal splitting
- Override with custom splits per participant
- Validation ensures custom splits always equal the total amount

### Balance Tracking
- Per-group balance calculation (who paid, who owes)
- Debt simplification algorithm — minimises the number of transactions needed to settle
- Global "Friends & Balances" view aggregating debts across all groups
- Perspective-based display (select who you are to see personalised owe/owed view)

### Settle Up
- Settle debts between members with one click
- Settlements are recorded as transactions — expense history is never deleted
- Balances update immediately after settlement

### API Reliability
- Idempotent `POST /expenses` and `POST /groups/:id/expenses` — duplicate requests return the existing record, not a new one
- Input validation on all endpoints with descriptive error messages

---

## Design Decisions

- **Backend-first approach** — API design, financial logic, and data correctness were the primary focus. The balance calculation and debt simplification algorithm were implemented from scratch.
- **Settlement as a transaction** — Rather than modifying existing records, settlements are stored as special expense entries (`isSettlement: true`). This preserves the full audit trail and keeps the balance math clean.
- **Idempotency** — Retry-safe endpoints prevent duplicate expenses from multiple form submissions or network issues.
- **Modular frontend** — UI is split into pages (`Dashboard`, `GroupDetails`, `FriendsBalances`), components (`ExpenseForm`, `ExpenseTable`, `FilterSortBar`), and a service layer (`api.js`) for separation of concerns.
- **No routing library** — State-based page switching keeps the dependency list minimal.

---

## Use of AI Tools

AI tools were used selectively during this project:

- **UI styling** — CSS layout, spacing, color palette, and visual polish were assisted by AI to speed up frontend development.
- **Debugging** — AI was used to help identify and fix minor issues during development.

The following was implemented and understood **independently**:
- All API endpoint design and logic
- Idempotent request handling
- Group expense splitting (equal and custom)
- Balance calculation and debt simplification algorithm
- Settlement transaction strategy
- Frontend data flow and state management

---

## Trade-offs / Limitations

- **No persistent storage** — All data is in-memory and resets when the backend restarts.
- **No authentication** — There is no user login system; group members are just name strings.
- **Single-instance only** — Not suitable for multi-user concurrent access without a real database.
- **UI kept minimal** — Frontend prioritises clarity over polish.

---

## Future Improvements

- [ ] JWT-based authentication and user accounts
- [ ] Persistent database (MongoDB or PostgreSQL)
- [ ] Friend system for easier recurring expense tracking
- [ ] Split by percentage or shares (not just amounts)
- [ ] Settlement reminders and notifications
- [ ] Expense categories with icons and analytics
- [ ] Automated unit and integration tests
- [ ] Mobile-responsive improvements

---

## How to Run

### Prerequisites
- Node.js v18+
- npm

### 1. Backend

```bash
cd backend
npm install
node server.js
```

Server starts on **http://localhost:5000**

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

App opens on **http://localhost:5173**

### API Endpoints (quick reference)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/expenses` | List expenses (supports `?category=` and `?sort=date_desc`) |
| `POST` | `/expenses` | Add a personal expense (idempotent) |
| `GET` | `/groups` | List all groups |
| `POST` | `/groups` | Create a group |
| `POST` | `/groups/:id/expenses` | Add a group expense (idempotent) |
| `GET` | `/groups/:id/expenses` | Get expense history for a group |
| `GET` | `/groups/:id/balances` | Get simplified debts for a group |
| `POST` | `/groups/:id/settle` | Settle a debt between two members |
| `GET` | `/balances` | Get global simplified debts across all groups |

---

## Repository

[github.com/Slash-495/fenmo_assessment_expense_tracker](https://github.com/Slash-495/fenmo_assessment_expense_tracker)