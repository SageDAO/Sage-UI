import useSageRoutes from '@/hooks/useSageRoutes';
import { useEffect, useState } from 'react';

interface Props {
  callback?: () => any;
}

export default function ASHPrice({ callback }: Props) {
  const [priceUSD, setPriceUSD] = useState<number>(null);
  const { pushToHowToBuyAsh } = useSageRoutes();
  useEffect(() => {
    fetch('https://min-api.cryptocompare.com/data/price?fsym=ASH&tsyms=USD').then((res) => {
      res.json().then(({ USD }) => {
        setPriceUSD(USD);
      });
    });
  }, []);
  return (
    <div
      onClick={() => {
        pushToHowToBuyAsh();
				callback && callback();
      }}
      className='ash-price'
    >
      $ASH: {priceUSD} USD
    </div>
  );
}
