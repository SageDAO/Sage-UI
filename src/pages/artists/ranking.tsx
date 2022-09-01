import LoaderSpinner from '@/components/LoaderSpinner';
import { gql, useQuery } from '@apollo/client';
import prisma from '@/prisma/client';
import {
  getArtistsUsernamesAndWallets,
  getDropsSalesData,
  getListingsSalesData,
} from '@/prisma/functions';
import { BigNumber, ethers } from 'ethers';

interface SaleItem {
  origin: 'Lottery' | 'Auction' | 'Marketplace';
  eventId: number;
  nftCount: number;
  amount: string; // bigint
}
interface ArtistSales {
  username: string;
  nftCountTotal: number;
  amountTotal: string; // bigint
  sales: SaleItem[];
  highestSale: string; // bigint
}

const GAMES_SALES_QUERY = gql`
  query GetGamesSales {
    lotteries {
      id
      tickets {
        id
      }
    }
    auctions {
      id
      highestBid
    }
    nftSales {
      nftId
      seller
      price
    }
  }
`;

export default function ranking({ dbSalesData }: { dbSalesData: Map<string, ArtistSales> }) {
  const { data: chainData, loading: isLoadingChainData } = useQuery(GAMES_SALES_QUERY);

  if (isLoadingChainData) {
    return (
      <div style={{ marginLeft: 'auto', marginRight: 'auto', marginTop: '50px' }}>
        <LoaderSpinner />
      </div>
    );
  }

  computeChainData(dbSalesData, chainData);

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
          {Array.from(dbSalesData.values()).map((item, i) => {
            return (
              <tr key={i}>
                <td>{i+1}</td>
                <td>{item.username}</td>
                <td>
                  {item.amountTotal} ASH
                </td>
                <td>{item.nftCountTotal}</td>
                <td>- ASH</td>
                <td>- ASH</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function findArtistAndSaleItem(dbSalesData: Map<string, ArtistSales>, eventId: number, eventType: string): { artistSales: ArtistSales, saleItem: SaleItem } {
  for (const as of Array.from(dbSalesData.values())) {
    for (const i of as.sales) {
      if (i.eventId == eventId && i.origin == eventType) {
        return { artistSales: as, saleItem: i };
      }
    }
  }
  return null;
}

function computeChainData(dbSalesData: Map<string, ArtistSales>, chainData: any) {
  for (const l of chainData.lotteries) {
    const { artistSales, saleItem } = findArtistAndSaleItem(dbSalesData, l.id, 'Lottery');
    const ticketCost = BigNumber.from(saleItem.amount);
    const itemValue = ticketCost.mul(l.tickets.length);
    if (itemValue.gt(BigNumber.from(artistSales.highestSale))) {
      artistSales.highestSale = itemValue.toString();
    }
    saleItem.amount = itemValue.toString();
    artistSales.amountTotal = BigNumber.from(artistSales.amountTotal).add(itemValue).toString();
  }
  for (const a of chainData.auctions) {
    const { artistSales, saleItem } = findArtistAndSaleItem(dbSalesData, a.id, 'Auction');
    const itemValue = BigNumber.from(a.highestBid.toString());
    if (itemValue.gt(BigNumber.from(artistSales.highestSale))) {
      artistSales.highestSale = itemValue.toString();
    }
    saleItem.amount = itemValue.toString();
    artistSales.amountTotal = BigNumber.from(artistSales.amountTotal).add(itemValue).toString();
  }
  for (const n of chainData.nftSales) {
    const { artistSales, saleItem } = findArtistAndSaleItem(dbSalesData, n.id, 'Marketplace');
    const itemValue = BigNumber.from(n.price);
    if (itemValue.gt(BigNumber.from(artistSales.highestSale))) {
      artistSales.highestSale = itemValue.toString();
    }
    saleItem.amount = itemValue.toString();
    artistSales.amountTotal = BigNumber.from(artistSales.amountTotal).add(itemValue).toString();
  }
}

export async function getStaticProps() {
  const artists = await getArtistsUsernamesAndWallets(prisma);
  const drops = await getDropsSalesData(prisma);
  const listings = await getListingsSalesData(prisma);
  const salesData = new Map<string, ArtistSales>();
  for (const a of artists) {
    salesData.set(a.walletAddress, {
      username: a.username,
      nftCountTotal: 0,
      amountTotal: '0',
      sales: [],
      highestSale: '0'
    } as ArtistSales);
  }
  for (const d of drops) {
    const s = salesData.get(d.artistAddress);
    for (const l of d.Lotteries) {
      s.nftCountTotal += l.Nfts.length;
      s.sales.push({
        origin: 'Lottery',
        eventId: l.id,
        amount: ethers.utils.parseEther(l.costPerTicketTokens.toString()).toString(), // will be updated with blockchain data
        nftCount: l.Nfts.length,
      } as SaleItem);
    }
    for (const a of d.Auctions) {
      s.nftCountTotal += 1;
      s.sales.push({
        origin: 'Auction',
        eventId: a.id,
        amount: '0', // will be updated with blockchain data
        nftCount: 1,
      } as SaleItem);
    }
  }
  for (const n of listings) {
    const s = salesData.get(n.artistAddress);
    s.sales.push({
      origin: 'Marketplace',
      eventId: n.id,
      amount: '0', // will be updated with blockchain data
      nftCount: 1,
    } as SaleItem);
  }
  return {
    props: {
      dbSalesData: salesData,
    },
    revalidate: 600,
  };
}
