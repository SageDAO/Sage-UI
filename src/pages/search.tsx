import LoaderSpinner from '@/components/LoaderSpinner';
import SearchResultsTile from '@/components/Pages/Search/SearchResultsTile';
import { SearchableNftData, useGetSearchableNftDataQuery } from '@/store/nftsReducer';
import { useRouter } from 'next/router';

export default function Search() {
  const router = useRouter();
  const query = router.query.q;
  const { data, isLoading } = useGetSearchableNftDataQuery();
  const results = performSearch(data!, query as string);

  return (
    <>
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <span style={{ textTransform: 'uppercase' }}>Search Results</span>
        {isLoading && <div style={{ marginTop: '50px' }}><LoaderSpinner /></div>}
        {data && results.length == 0 && <div style={{ marginTop: '50px' }}>No results found</div>}
      </div>
      <div className='drop-page__content'>
        <div className='drop-page__grid'>
          {results &&
            results.map((nft: SearchableNftData, i: number) => (
              <SearchResultsTile key={i} nft={nft} />
            ))}
        </div>
      </div>
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
