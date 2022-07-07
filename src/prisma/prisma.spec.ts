import { getDropsPageData, getHomePageData } from './functions';
import { assert, expect } from 'chai';
import prisma from './client';
import { parameters } from '../constants/config';

const { LOTTERY_ADDRESS, AUCTION_ADDRESS } = parameters;

console.log('Running mocha tests using config: ', process.env.NEXT_PUBLIC_APP_MODE);
console.log(parameters);

describe('Prisma', async () => {
  after(() => {
    console.log('Test run complete, closing prisma instance...');
    prisma
      .$disconnect()
      .then(() => console.log('Successfully disconnected'))
      .catch(() => console.error('Failed to disconnect'));
  });

  describe('Home page data fetching', () => {
    type UpcomingDrops = Awaited<ReturnType<typeof getHomePageData>>['upcomingDrops'];
    type FeaturedDrop = Awaited<ReturnType<typeof getHomePageData>>['featuredDrop'];
    type Drops = Awaited<ReturnType<typeof getHomePageData>>['drops'];
    type Drop = Drops[number];
    let upcomingDrops: UpcomingDrops;
    let featuredDrop: FeaturedDrop;
    let drops: Drops;

    before(async () => {
      const data = await getHomePageData(prisma);
      upcomingDrops = data.upcomingDrops;
      drops = data.drops;
    });

    it('Drops limited to 4', async () => {
      assert.isAtMost(upcomingDrops.length, 4);
    });

    it('Featured drop is not null', async () => {
      assert.isNotNull(featuredDrop);
    });

    it('Drops include required display info', async () => {
      drops.forEach((d) => {
        assert.isNotNull(d.name);
        assert.isNotNull(d.bannerImageS3Path);
        assert.isNotNull(d.Artist);
        assert.isNotNull(d.Artist.displayName);
        assert.isNotNull(d.Lotteries);
        assert.isNotNull(d.Auctions);
      });
    });

    it('Drops are approved', async () => {
      drops.forEach((d) => {
        assert.isNotNull(d.approvedBy);
        assert.isNotNull(d.approvedAt);
      });
    });

    it('Drops ordered by most recently created first', async () => {
      let dropA: Drop;
      let dropB: Drop;
      if (drops.length < 2) return;
      for (let i = 1; i < drops.length; i++) {
        dropA = drops[i - 1];
        dropB = drops[i];
        if (!dropB.approvedAt) continue;
        expect(dropA.approvedAt).least(dropB.approvedAt);
      }
    });

    it('Fetched drops should have games with known contract addresses', async () => {
      drops.forEach((d) => {
        d.Lotteries.forEach(({ contractAddress }) => {
          assert.isNotNull(contractAddress);
          assert.deepEqual(contractAddress, LOTTERY_ADDRESS);
        });
        d.Auctions.forEach(({ contractAddress }) => {
          assert.isNotNull(contractAddress);
          assert.deepEqual(contractAddress, AUCTION_ADDRESS);
        });
      });
    });
  });

  describe('Drops page data fetching', () => {
    type Drops = Awaited<ReturnType<typeof getDropsPageData>>;
    type Drop = Drops[number];
    let drops: Drops;

    before(async () => {
      drops = await getDropsPageData(prisma);
    });

    it('Drops are approved', async () => {
      drops.forEach((d) => {
        assert.isNotNull(d.approvedBy);
        assert.isNotNull(d.approvedAt);
      });
    });

    it('Drops ordered by most recently created first', async () => {
      let dropA: Drop;
      let dropB: Drop;
      if (drops.length < 2) return;
      for (let i = 1; i < drops.length; i++) {
        dropA = drops[i - 1];
        dropB = drops[i];
        if (!dropB.approvedAt) continue;
        expect(dropA.approvedAt).least(dropB.approvedAt);
      }
    });

    it('Drops include required display info', async () => {
      drops.forEach((d) => {
        assert.isNotNull(d.name);
        assert.isNotNull(d.bannerImageS3Path);
        assert.isNotNull(d.Artist);
        assert.isNotNull(d.Artist.displayName);
        assert.isNotNull(d.Lotteries);
        assert.isNotNull(d.Auctions);
      });
    });

    it('Fetched drops have games with known contract addresses', async () => {
      drops.forEach((d) => {
        d.Lotteries.forEach(({ contractAddress }) => {
          assert.isNotNull(contractAddress);
          assert.deepEqual(contractAddress, LOTTERY_ADDRESS);
        });
        d.Auctions.forEach(({ contractAddress }) => {
          assert.isNotNull(contractAddress);
          assert.deepEqual(contractAddress, AUCTION_ADDRESS);
        });
      });
    });
  });
});
