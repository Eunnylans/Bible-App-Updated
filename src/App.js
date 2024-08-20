import React, { useState, useEffect } from 'react';
import { loadBibleVersions, loadBooks, loadChapters, loadSections, loadVerses, loadSelectedSection, loadSelectedVerse, search } from './Components/Api/Api';
import BibleVersionsList from './Components/BibleVersionsList/BibleVersionsList';
import BooksList from './Components/BooksList/BooksList';
import ChaptersList from './Components/ChaptersList/ChaptersList';
import SearchResultsList from './Components/SearchResultsList/SearchResultsList';
import SectionsList from './Components/SectionsList/SectionsList';
import VersesList from './Components/VersesList/VersesList';


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

export default App;
