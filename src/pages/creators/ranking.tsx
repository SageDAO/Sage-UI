import prisma from '@/prisma/client';
import { getArtistsSalesData } from '@/prisma/functions';
import { ArtistSales } from '@/prisma/types';

const usdFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

interface Props {
  salesData: Map<string, ArtistSales>;
}

export default function ranking({ salesData }: Props) {
  const displayData = Array.from(salesData.values()).sort(
    (a, b) => b.amountTotalUSD - a.amountTotalUSD
  );
  return (
    <div className='ranking-page'>
      <h1 className='ranking-page__header'>Top Artists</h1>
      <table className='ranking-page__table'>
        <thead>
          <tr>
            <th>Rank</th>
            <th>Artist</th>
            <th>Total Artwork Value</th>
            <th>Artworks Sold</th>
            <th>Highest Sale</th>
            <th>Average Sale</th>
          </tr>
        </thead>
        <tbody>
          {displayData.slice(0, 10).map((item, i) => {
            const avgSale = item.amountTotalUSD / item.nftCountTotal;
            return (
              <tr key={i}>
                <td>{i + 1}</td>
                <td>{item.username}</td>
                <td>{usdFormatter.format(item.amountTotalUSD)}</td>
                <td>{item.nftCountTotal}</td>
                <td>{usdFormatter.format(item.highestSaleUSD)}</td>
                <td>{isNaN(avgSale) || avgSale == 0 ? '-' : usdFormatter.format(avgSale)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export async function getStaticProps() {
  const salesData = await getArtistsSalesData(prisma);
  return {
    props: { salesData },
    revalidate: 600,
  };
}
