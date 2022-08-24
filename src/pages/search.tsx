import LoaderSpinner from '@/components/LoaderSpinner';
import SearchResultsTile from '@/components/Pages/Search/SearchResultsTile';
import { SearchInput } from '@/components/SearchInput';
import { SearchableNftData, useGetSearchableNftDataQuery } from '@/store/nftsReducer';
import { useSearch } from '@/store/searchContext';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function Search() {
  const ITEMS_PER_PAGE = 9;
  const [displayCount, setDisplayCount] = useState<number>(ITEMS_PER_PAGE);
  const { data, isLoading } = useGetSearchableNftDataQuery();
  const { query, setQuery } = useSearch();
  const [isEditing, setIsEditing] = useState<boolean>(false);

  useEffect(() => {
    setDisplayCount(ITEMS_PER_PAGE); // reset display count to default when query changes
  }, [query]);

  const urlParamQuery = useRouter().query.q as string;
  if (query == '' && urlParamQuery && urlParamQuery != '' && !isEditing) {
    setQuery(urlParamQuery); // use url param if context is uninitialized
  }

  const results = performSearch(data!, query);
  const displayResults = results.slice(0, displayCount);

  const handleLoadMoreBtnClick = () => {
    setDisplayCount(displayCount + ITEMS_PER_PAGE);
  };

  return (
    <>
      <div className='searchresults__header'>
        <div className='searchresults__term'>
          <div className='searchresults__right-dot'></div>
          <div>
            <SearchInput
              placeholder=''
              className='searchresults__input'
              displayIcon={false}
              onChange={() => {
                setIsEditing(true);
              }}
            />
          </div>
        </div>
        <div className='searchresults__text'>
          {isLoading && <LoaderSpinner />}
          {data &&
            (query.length < 3
              ? 'Search must include at least 3 characters'
              : results.length == 0
              ? 'No Results Found'
              : 'Your Search Results')}
        </div>
      </div>
      <div className='drop-page__content' style={{ padding: '50px 0 0' }}>
        <div className='drop-page__grid'>
          {displayResults &&
            displayResults.map((nft: SearchableNftData, i: number) => (
              <SearchResultsTile key={i} nft={nft} />
            ))}
        </div>
      </div>
      {displayCount < results.length && (
        <button className='searchresults__button' onClick={handleLoadMoreBtnClick}>
          Load more results
        </button>
      )}
    </>
  );
}

function performSearch(data: SearchableNftData[], query: string): SearchableNftData[] {
  if (!data || !query || query.length < 3) {
    return [];
  }
  query = query.toLowerCase();
  return data.filter((item) => {
    return (
      item.artist.toLowerCase().indexOf(query) != -1 ||
      item.name.toLowerCase().indexOf(query) != -1 ||
      item.tags.toLowerCase().indexOf(query) != -1 ||
      (item.dName && item.dName.toLowerCase().indexOf(query) != -1)
    );
  });
}
