import React from 'react'

// Component for rendering Chapters
const ChaptersList = ({ chapters, onChapterSelect }) => {
    return (
      <div className="chapters-list">
        {chapters.map((chapter) => (
          <div
            key={chapter.id}
            className="chapter"
            onClick={() => onChapterSelect(chapter.id)}
          >
            {chapter.number}
          </div>
        ))}
      </div>
    );
  };
export default ChaptersList
