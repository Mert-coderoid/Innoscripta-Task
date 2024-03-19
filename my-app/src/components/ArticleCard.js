import React from 'react';

const FilterComponent = ({ categories, sources, onFilterChange, onSearch }) => {
  return (
    <div className="mb-8 p-4 rounded-lg bg-white shadow">
      <div className="flex flex-wrap -mx-2">
        <div className="w-full md:w-1/3 px-2 mb-4">
          <input
            type="text"
            name="keyword"
            placeholder="Keyword..."
            onChange={onFilterChange}
            className="border p-2 w-full rounded"
          />
        </div>
        <div className="w-full md:w-1/3 px-2 mb-4">
          <select
            name="category"
            onChange={onFilterChange}
            className="border p-2 w-full rounded"
          >
            <option value="">All Categories</option>
            {categories.map((category, index) => (
              <option key={index} value={category.category}>{category.category}</option>
            ))}
          </select>
        </div>
        <div className="w-full md:w-1/3 px-2 mb-4">
          <select
            name="sources"
            onChange={onFilterChange}
            className="border p-2 w-full rounded"
          >
            <option value="">All Sources</option>
            {sources.map((source, index) => (
              <option key={index} value={source.source}>{source.source}</option>
            ))}
          </select>
        </div>
        <div className="w-full md:w-1/4 px-2 mb-4">
          <input
            type="date"
            name="start_date"
            onChange={onFilterChange}
            className="border p-2 w-full rounded"
          />
        </div>
        <div className="w-full md:w-1/4 px-2 mb-4">
          <input
            type="date"
            name="end_date"
            onChange={onFilterChange}
            className="border p-2 w-full rounded"
          />
        </div>
        <div className="w-full md:w-1/4 px-2 mb-4">
          <select
            name="sort_by"
            onChange={onFilterChange}
            className="border p-2 w-full rounded"
          >
            <option value="">Sort By</option>
            <option value="publishedAt">Published At</option>
            <option value="title">Title</option>
            <option value="author">Author</option>
            <option value="source">Source</option>
            <option value="category">Category</option>
          </select>
        </div>
        <div className="w-full md:w-1/4 px-2 mb-4 flex justify-end">
          <button
            onClick={onSearch}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors duration-200"
          >
            Search
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterComponent;
