import React from 'react';

function FilterSortBar({ availableCategories, filterCategory, setFilterCategory, sortDateDesc, setSortDateDesc }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', alignItems: 'center' }}>
      <div>
        <label style={{ marginRight: '10px', fontWeight: 'bold' }}>Filter by Category:</label>
        <select 
          value={filterCategory} 
          onChange={(e) => setFilterCategory(e.target.value)}
          style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
        >
          <option value="">All Categories</option>
          {availableCategories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>
      
      <button 
        onClick={() => setSortDateDesc(!sortDateDesc)}
        style={{ padding: '8px 12px', backgroundColor: sortDateDesc ? '#0056b3' : '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
      >
        {sortDateDesc ? 'Sorting by Newest First' : 'Sort by Newest Date'}
      </button>
    </div>
  );
}

export default FilterSortBar;
