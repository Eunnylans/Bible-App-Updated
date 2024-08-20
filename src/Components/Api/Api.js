import axios from 'axios';

const API_KEY = 'YOUR_API_KEY';  // Replace with your actual API key

export const loadBibleVersions = async () => {
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

  export const loadBooks = async (bibleVersionID, abbreviation) => {
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

  export const loadChapters = async (bibleVersionID, abbreviation, bibleBookID) => {
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

  export const loadSections = async (bibleVersionID, abbreviation, bibleBookID) => {
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

  export const loadVerses = async (bibleVersionID, abbreviation, bibleChapterID) => {
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

  export const loadSelectedVerse = async (bibleVersionID, abbreviation, bibleVerseID) => {
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

  export const loadSelectedSection = async (bibleVersionID, abbreviation, bibleSectionID) => {
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

  export const search = async (searchText, offset = 0, bibleVersionID, abbreviation) => {
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
  export const updateParamsInURL = (params) => {
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

  export const getParameterByName = (name) => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
  };

  export const sortVersionsByLanguage = (versions) => {
    const sorted = {};
    versions.forEach((version) => {
      if (!sorted[version.language]) {
        sorted[version.language] = [];
      }
      sorted[version.language].push(version);
    });
    return sorted;
  };

  export const getVerseNumber = (verseId) => {
    const parts = verseId.split('.');
    return parts[parts.length - 1];
  };
