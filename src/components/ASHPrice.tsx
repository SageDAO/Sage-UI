import useSageRoutes from '@/hooks/useSageRoutes';
import { useEffect, useState } from 'react';

async function getAshPrice() {}

export default function ASHPrice() {
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
      }}
      className='ash-price'
    >
      $ASH: {priceUSD} USD
    </div>
  );
}
