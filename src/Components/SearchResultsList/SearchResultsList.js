import React from 'react'

// Component for rendering Search Results
const SearchResultsList = ({ results, onResultSelect }) => {
    return (
      <div className="search-results-list">
        {results.map((result) => (
          <div
            key={result.id}
            className="search-result"
            onClick={() => onResultSelect(result.id)}
          >
            {result.reference} - {result.text}
          </div>
        ))}
      </div>
    );
  };
export default SearchResultsList
