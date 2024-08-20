import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_KEY = 'YOUR_API_KEY';  // Replace with your actual API key

const App = () => {
  const [params, setParams] = useState({});
  const [bibleVersions, setBibleVersions] = useState([]);
  const [books, setBooks] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [verses, setVerses] = useState([]);
  const [sections, setSections] = useState([]);
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('Bible');
  const [viewingLabel, setViewingLabel] = useState('Select a:');
  const [listType, setListType] = useState('bible-list');
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    updatePage(params, false);
  }, [params]);

  const updatePage = (params, updateParams = true) => {
    if (updateParams) {
      updateParamsInURL(params);
    }
    
    const abbreviation = getParameterByName('abbr');
    const bibleVersionID = getParameterByName('version');
    const bibleBookID = getParameterByName('book');
    const bibleChapterID = getParameterByName('chapter');
    const bibleVerseID = getParameterByName('verse');
    const bibleSectionID = getParameterByName('section');
    const query = getParameterByName('query');

    setContent('');
    setSearchResults([]);

    if (!bibleVersionID || !abbreviation) {
      loadBibleVersions();
    } else if (bibleSectionID) {
      loadSelectedSection(bibleVersionID, abbreviation, bibleSectionID);
    } else if (query) {
      search(query, 0, bibleVersionID, abbreviation);
    } else if (bibleVersionID && !bibleBookID && !bibleChapterID && !bibleVerseID) {
      loadBooks(bibleVersionID, abbreviation);
    } else if (bibleVersionID && bibleBookID) {
      loadChapters(bibleVersionID, abbreviation, bibleBookID);
      loadSections(bibleVersionID, abbreviation, bibleBookID);
    } else if (bibleVersionID && bibleChapterID) {
      loadVerses(bibleVersionID, abbreviation, bibleChapterID);
    } else if (bibleVersionID && bibleVerseID) {
      loadSelectedVerse(bibleVersionID, abbreviation, bibleVerseID);
    }
  };

  const loadBibleVersions = async () => {
    setViewingLabel('Select a:');
    setTitle('Bible');
    setListType('bible-list');
    setBooks([]);
    setChapters([]);
    setVerses([]);
    setSections([]);
    setContent('');

    try {
      const { data } = await axios.get('https://v2.api.bible/bibles', {
        headers: { 'api-key': API_KEY }
      });
      const versions = data.data.map(v => ({
        id: v.id,
        name: v.name,
        abbreviation: v.abbreviation,
        description: v.description,
        language: v.language.name,
      }));
      setBibleVersions(sortVersionsByLanguage(versions));
    } catch (error) {
      console.error('Error loading Bible versions:', error);
    }
  };

  const loadBooks = async (bibleVersionID, abbreviation) => {
    setTitle(abbreviation);
    setViewingLabel('Viewing:');
    setListType('bible-list');
    setChapters([]);
    setVerses([]);
    setSections([]);
    setContent('');

    try {
      const { data } = await axios.get(`https://v2.api.bible/bibles/${bibleVersionID}/books`, {
        headers: { 'api-key': API_KEY }
      });
      const bookList = data.data.map(book => ({ id: book.id, name: book.name }));
      setBooks(bookList);
    } catch (error) {
      console.error('Error loading books:', error);
    }
  };

  const loadChapters = async (bibleVersionID, abbreviation, bibleBookID) => {
    setTitle(bibleBookID);
    setViewingLabel('Viewing:');
    setListType('numeric-list');
    setVerses([]);
    setSections([]);
    setContent('');

    try {
      const { data } = await axios.get(`https://v2.api.bible/bibles/${bibleVersionID}/books/${bibleBookID}/chapters`, {
        headers: { 'api-key': API_KEY }
      });
      const chapterList = data.data.map(chapter => ({
        id: chapter.id,
        number: chapter.number,
      }));
      setChapters(chapterList);
    } catch (error) {
      console.error('Error loading chapters:', error);
    }
  };

  const loadSections = async (bibleVersionID, abbreviation, bibleBookID) => {
    setTitle(bibleBookID);
    setSections([]);

    try {
      const { data } = await axios.get(`https://v2.api.bible/bibles/${bibleVersionID}/books/${bibleBookID}/sections`, {
        headers: { 'api-key': API_KEY }
      });
      const sectionList = data.data
        ? data.data.map(section => ({
            id: section.id,
            title: section.title,
          }))
        : null;
      setSections(sectionList);
    } catch (error) {
      console.error('Error loading sections:', error);
    }
  };

  const loadVerses = async (bibleVersionID, abbreviation, bibleChapterID) => {
    setTitle(bibleChapterID);
    setViewingLabel('Viewing:');
    setListType('numeric-list');

    try {
      const { data } = await axios.get(`https://v2.api.bible/bibles/${bibleVersionID}/chapters/${bibleChapterID}`, {
        headers: { 'api-key': API_KEY }
      });
      setContent(data.data.content);
      const verses = data.data.verses.map(verse => ({
        id: verse.id,
        number: getVerseNumber(verse.id),
      }));
      setVerses(verses);
    } catch (error) {
      console.error('Error loading verses:', error);
    }
  };

  const loadSelectedVerse = async (bibleVersionID, abbreviation, bibleVerseID) => {
    try {
      const { data } = await axios.get(`https://v2.api.bible/bibles/${bibleVersionID}/verses/${bibleVerseID}`, {
        headers: { 'api-key': API_KEY }
      });
      setTitle(data.data.reference);
      setContent(data.data.content);
    } catch (error) {
      console.error('Error loading selected verse:', error);
    }
  };

  const loadSelectedSection = async (bibleVersionID, abbreviation, bibleSectionID) => {
    try {
      const { data } = await axios.get(`https://v2.api.bible/bibles/${bibleVersionID}/sections/${bibleSectionID}`, {
        headers: { 'api-key': API_KEY }
      });
      setTitle(data.data.title);
      setContent(data.data.content);
    } catch (error) {
      console.error('Error loading selected section:', error);
    }
  };

  const search = async (searchText, offset = 0, bibleVersionID, abbreviation) => {
    try {
      const { data } = await axios.get(
        `https://v2.api.bible/bibles/${bibleVersionID}/search?query=${searchText}&offset=${offset}`,
        {
          headers: { 'api-key': API_KEY }
        }
      );
      setSearchResults(data.data.verses);
      // Update pagination and other UI elements as needed.
    } catch (error) {
      console.error('Error performing search:', error);
    }
  };

  // Utility Functions
  const updateParamsInURL = (params) => {
    const urlParams = new URLSearchParams(window.location.search);
    for (let key in params) {
      if (params[key]) {
        urlParams.set(key, params[key]);
      } else {
        urlParams.delete(key);
      }
    }
    const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
    window.history.pushState({ params }, '', newUrl);
  };

  const getParameterByName = (name) => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
  };

  const sortVersionsByLanguage = (versions) => {
    const sorted = {};
    versions.forEach((version) => {
      if (!sorted[version.language]) {
        sorted[version.language] = [];
      }
      sorted[version.language].push(version);
    });
    return sorted;
  };

  const getVerseNumber = (verseId) => {
    const parts = verseId.split('.');
    return parts[parts.length - 1];
  };

  return (
    <div className="app">
      <div id="breadcrumbs">{/* Breadcrumbs content here */}</div>
      <div id="viewing-label">{viewingLabel}</div>
      <div id="viewing">{title}</div>
      <div id="list" className={listType}>
        {bibleVersions.length > 0 && (
          <BibleVersionsList
            versions={bibleVersions}
            onVersionSelect={(version, abbr) => setParams({ version, abbr })}
          />
        )}
        {books.length > 0 && (
          <BooksList
            books={books}
            onBookSelect={(book) => setParams({ ...params, book })}
          />
        )}
        {chapters.length > 0 && (
          <ChaptersList
            chapters={chapters}
            onChapterSelect={(chapter) => setParams({ ...params, chapter })}
          />
        )}
        {verses.length > 0 && (
          <VersesList
            verses={verses}
            onVerseSelect={(verse) => setParams({ ...params, verse })}
          />
        )}
        {sections.length > 0 && (
          <SectionsList
            sections={sections}
            onSectionSelect={(section) => setParams({ ...params, section })}
          />
        )}
        {searchResults.length > 0 && (
          <SearchResultsList
            results={searchResults}
            onResultSelect={(verse) => setParams({ ...params, verse })}
          />
        )}
      </div>
      <div id="content">{content}</div>
    </div>
  );
};

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

// Component for rendering Books
const BooksList = ({ books, onBookSelect }) => {
  return (
    <div className="books-list">
      {books.map((book) => (
        <div key={book.id} className="book" onClick={() => onBookSelect(book.id)}>
          {book.name}
        </div>
      ))}
    </div>
  );
};



export default App;
