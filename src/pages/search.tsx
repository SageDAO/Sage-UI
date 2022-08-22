import LoaderSpinner from '@/components/LoaderSpinner';
import SearchResultsTile from '@/components/Pages/Search/SearchResultsTile';
import { SearchableNftData, useGetSearchableNftDataQuery } from '@/store/nftsReducer';
import { useRouter } from 'next/router';
import { useState } from 'react';

export default function Search() {
  const displayPageCount = 9;
  const [displayTotalCount, setDisplayTotalCount] = useState<number>(displayPageCount);
  const router = useRouter();
  const query = router.query.q;
  const { data, isLoading } = useGetSearchableNftDataQuery();
  const results = performSearch(data!, query as string);
  const displayResults = results.slice(0, displayTotalCount);

  const handleLoadMoreBtnClick = () => {
    setDisplayTotalCount(displayTotalCount + displayPageCount);
  };

  return (
    <>
      <div className='searchresults__header'>
        <div className='searchresults__term'>
          <div className='searchresults__right-dot'></div>
          <div>{query}</div>
        </div>
        <div className='searchresults__text'>
          {isLoading && <LoaderSpinner />}
          {data && (results.length == 0 ? 'No Results Found' : 'Your Search Results')}
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
      {displayTotalCount < results.length && (
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
