import axios from 'axios';

const API_KEY = 'f915205eb20adbafa318bc0f6c0453c1';  // Replace with your actual API key

export const loadBibleVersions = async () => {
  try {
    const { data } = await axios.get('https://v2.api.bible/bibles', {
      headers: { 'api-key': API_KEY },
    });
    return data.data.map(v => ({
      id: v.id,
      name: v.name,
      abbreviation: v.abbreviation,
      description: v.description,
      language: v.language.name,
    }));
  } catch (error) {
    console.error('Error loading Bible versions:', error);
    return [];
  }
};

export const loadBooks = async (bibleVersionID) => {
  try {
    const { data } = await axios.get(`https://v2.api.bible/bibles/${bibleVersionID}/books`, {
      headers: { 'api-key': API_KEY },
    });
    return data.data.map(book => ({ id: book.id, name: book.name }));
  } catch (error) {
    console.error('Error loading books:', error);
    return [];
  }
};

// Similarly, export other API functions like loadChapters, loadSections, loadVerses, loadSelectedVerse, loadSelectedSection, and search.

export const loadChapters = async (bibleVersionID, bibleBookID) => {
  try {
    const { data } = await axios.get(`https://v2.api.bible/bibles/${bibleVersionID}/books/${bibleBookID}/chapters`, {
      headers: { 'api-key': API_KEY },
    });
    return data.data.map(chapter => ({
      id: chapter.id,
      number: chapter.number,
    }));
  } catch (error) {
    console.error('Error loading chapters:', error);
    return [];
  }
};

// Continue exporting the other functions in the same pattern.

// Existing API functions like loadBibleVersions and loadBooks...

export const loadSelectedSection = async (bibleVersionID, abbreviation, bibleSectionID) => {
    try {
      const { data } = await axios.get(`https://v2.api.bible/bibles/${bibleVersionID}/sections/${bibleSectionID}`, {
        headers: { 'api-key': API_KEY },
      });
      return {
        title: data.data.title,
        content: data.data.content,
      };
    } catch (error) {
      console.error('Error loading selected section:', error);
      return {};
    }
  };
  
  export const search = async (query, start, bibleVersionID, abbreviation) => {
    try {
      const { data } = await axios.get(`https://v2.api.bible/bibles/${bibleVersionID}/search`, {
        headers: { 'api-key': API_KEY },
        params: {
          query,
          start,
          limit: 10,  // Adjust as needed
        },
      });
      return data.data.verses.map(verse => ({
        id: verse.id,
        reference: verse.reference,
        text: verse.text,
      }));
    } catch (error) {
      console.error('Error searching:', error);
      return [];
    }
  };
  
  export const loadSections = async (bibleVersionID, abbreviation, bibleBookID) => {
    try {
      const { data } = await axios.get(`https://v2.api.bible/bibles/${bibleVersionID}/books/${bibleBookID}/sections`, {
        headers: { 'api-key': API_KEY },
      });
      return data.data.map(section => ({
        id: section.id,
        title: section.title,
      }));
    } catch (error) {
      console.error('Error loading sections:', error);
      return [];
    }
  };
  
  export const loadVerses = async (bibleVersionID, abbreviation, bibleChapterID) => {
    try {
      const { data } = await axios.get(`https://v2.api.bible/bibles/${bibleVersionID}/chapters/${bibleChapterID}/verses`, {
        headers: { 'api-key': API_KEY },
      });
      return {
        content: data.data.content,
        verses: data.data.verses.map(verse => ({
          id: verse.id,
          number: verse.reference, // or verse.number depending on API structure
          text: verse.text,
        })),
      };
    } catch (error) {
      console.error('Error loading verses:', error);
      return { content: '', verses: [] };
    }
  };
  
  export const loadSelectedVerse = async (bibleVersionID, abbreviation, bibleVerseID) => {
    try {
      const { data } = await axios.get(`https://v2.api.bible/bibles/${bibleVersionID}/verses/${bibleVerseID}`, {
        headers: { 'api-key': API_KEY },
      });
      return {
        reference: data.data.reference,
        content: data.data.content,
      };
    } catch (error) {
      console.error('Error loading selected verse:', error);
      return { reference: '', content: '' };
    }
  };
