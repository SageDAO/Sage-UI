import { useRouter } from 'next/router';
import { useState } from 'react';
import { toast } from 'react-toastify';

export default function SearchForm() {
  const query = useRouter().query.q as string;
  const [q, setQ] = useState<string>(query);
  const router = useRouter();

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQ(event.target.value);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key == 'Enter') {
      handleButtonClick();
    }
  };

  const handleButtonClick = () => {
    if (q.length < 3) {
      toast.info('Search must include at least 3 characters');
      return;
    }
    router.push(`/search?q=${q}`);
  };

  return (
    <div className='searchform'>
      <input
        type='text'
        value={q}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder='search sage'
        className='searchform__input'
      />
      <img src='/icons/search.svg' onClick={handleButtonClick} className='searchform__white_icon' />
    </div>
  );
}
