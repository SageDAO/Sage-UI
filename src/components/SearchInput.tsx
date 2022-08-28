import { useSearch } from '@/store/searchContext';
import { useRouter } from 'next/router';
import SearchSVG from '@/public/icons/search.svg';
import { toast } from 'react-toastify';

interface Props {
  className?: string;
  placeholder?: string;
  displayIcon?: boolean;
  onChange?: any;
  dataColor?: string;
}

export const SearchInput = ({
  className,
  placeholder,
  displayIcon,
  onChange,
  dataColor,
}: Props) => {
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
        data-color={dataColor}
      />
      {displayIcon && (
        <SearchSVG
          data-color={dataColor}
          onClick={handleButtonClick}
          className='searchform__white_icon'
        />
      )}
    </>
  );
};
