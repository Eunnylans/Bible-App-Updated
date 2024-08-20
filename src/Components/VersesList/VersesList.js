import React from 'react'

// Component for rendering Verses
const VersesList = ({ verses, onVerseSelect }) => {
    return (
      <div className="verses-list">
        {verses.map((verse) => (
          <div
            key={verse.id}
            className="verse"
            onClick={() => onVerseSelect(verse.id)}
          >
            {verse.number}
          </div>
        ))}
      </div>
    );
  };
export default VersesList