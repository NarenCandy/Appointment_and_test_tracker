import { useState, useEffect, useCallback } from 'react';
import './FilterPanel.css';

export interface FilterCriteria {
  keyword: string;
  startDate: Date | null;
  endDate: Date | null;
}

interface FilterPanelProps {
  onFilterChange: (filters: FilterCriteria) => void;
}

/**
 * FilterPanel component for filtering appointments by keyword and date range
 * Implements debouncing for keyword input to avoid excessive filtering
 */
export function FilterPanel({ onFilterChange }: FilterPanelProps) {
  const [keyword, setKeyword] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [debouncedKeyword, setDebouncedKeyword] = useState('');

  // Debounce keyword input (300ms delay)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedKeyword(keyword);
    }, 300);

    return () => clearTimeout(timer);
  }, [keyword]);

  // Apply filters whenever debounced keyword or date range changes
  useEffect(() => {
    const filters: FilterCriteria = {
      keyword: debouncedKeyword,
      startDate: startDate ? new Date(startDate) : null,
      endDate: endDate ? new Date(endDate) : null,
    };
    onFilterChange(filters);
  }, [debouncedKeyword, startDate, endDate, onFilterChange]);

  // Clear all filters
  const handleClearFilters = useCallback(() => {
    setKeyword('');
    setStartDate('');
    setEndDate('');
    setDebouncedKeyword('');
  }, []);

  return (
    <div className="filter-panel" role="search" aria-label="Filter appointments">
      <h3 className="filter-panel-title">Filter Appointments</h3>

      <div className="filter-controls">
        {/* Keyword filter */}
        <div className="filter-field">
          <label htmlFor="keyword-filter" className="filter-label">
            Search
          </label>
          <input
            id="keyword-filter"
            type="text"
            className="filter-input"
            placeholder="Search by name, location, or notes..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            aria-describedby="keyword-help"
          />
          <span id="keyword-help" className="visually-hidden">
            Search appointments by name, location, or preparation notes
          </span>
        </div>

        {/* Date range filters */}
        <div className="filter-date-range">
          <div className="filter-field">
            <label htmlFor="start-date-filter" className="filter-label">
              From
            </label>
            <input
              id="start-date-filter"
              type="datetime-local"
              className="filter-input"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              aria-label="Filter start date"
            />
          </div>

          <div className="filter-field">
            <label htmlFor="end-date-filter" className="filter-label">
              To
            </label>
            <input
              id="end-date-filter"
              type="datetime-local"
              className="filter-input"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              aria-label="Filter end date"
            />
          </div>
        </div>

        {/* Clear filters button */}
        <button
          type="button"
          className="clear-filters-button"
          onClick={handleClearFilters}
          disabled={!keyword && !startDate && !endDate}
          aria-label="Clear all filters"
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
}
