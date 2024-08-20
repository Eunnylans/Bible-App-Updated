import React from 'react'

// Component for rendering Sections
const SectionsList = ({ sections, onSectionSelect }) => {
    return (
      <div className="sections-list">
        {sections.map((section) => (
          <div
            key={section.id}
            className="section"
            onClick={() => onSectionSelect(section.id)}
          >
            {section.title}
          </div>
        ))}
      </div>
    );
  };  

export default SectionsList