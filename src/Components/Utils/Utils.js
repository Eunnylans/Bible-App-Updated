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
  