import { createContext, useContext, useState } from 'react';

export type SearchContextType = {
  query: string;
  setQuery: (query: string) => void;
};

export const SearchContext = createContext<SearchContextType>({
  query: '',
  setQuery: (q) => console.warn('no search provider'),
});

export const useSearch = () => useContext(SearchContext);
