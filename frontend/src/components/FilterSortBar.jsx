import React from 'react';

function FilterSortBar({ availableCategories, filterCategory, setFilterCategory, sortDateDesc, setSortDateDesc }) {
  return (
    <div className="filter-bar">
      <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center', gap: '10px', marginBottom: 0 }}>
        <label style={{ textTransform: 'none', letterSpacing: 0, fontSize: '0.9rem', whiteSpace: 'nowrap' }}>Filter:</label>
        <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} style={{ width: 'auto' }}>
          <option value="">All Categories</option>
          {availableCategories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <button
        className={`btn btn-sm ${sortDateDesc ? 'btn-primary' : 'btn-secondary'}`}
        onClick={() => setSortDateDesc(!sortDateDesc)}
      >
        {sortDateDesc ? '↓ Newest First' : 'Sort by Date'}
      </button>
    </div>
  );
}

export default FilterSortBar;
