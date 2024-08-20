import React from 'react'

// Component for rendering Bible Versions
const BibleVersionsList = ({ versions, onVersionSelect }) => {
    return (
      <div className="bible-versions">
        {Object.keys(versions).map((lang) => (
          <div key={lang} className="language-group">
            <h3>{lang}</h3>
            {versions[lang].map((version) => (
              <div
                key={version.id}
                className="bible-version"
                onClick={() => onVersionSelect(version.id, version.abbreviation)}
              >
                <abbr title={version.name}>{version.abbreviation}</abbr> {version.name}
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  };

export default BibleVersionsList