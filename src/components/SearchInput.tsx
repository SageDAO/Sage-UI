import { useSearch } from '@/store/searchContext';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';

export const SearchInput = ({ className, placeholder, displayIcon, onChange }) => {
  const { query, setQuery } = useSearch();
  const router = useRouter();

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange();
    setQuery(event.target.value);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key == 'Enter') {
      handleButtonClick();
    }
  };

  const handleButtonClick = () => {
    if (query.length < 3) {
      toast.info('Search must include at least 3 characters');
      return;
    }
    router.push(`/search?q=${query}`);
  };

  return (
    <>
      <input
        type='text'
        value={query}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={className}
      />
      {displayIcon && (
        <img
          src='/icons/search.svg'
          onClick={handleButtonClick}
          className='searchform__white_icon'
        />
      )}
    </>
  );
};
