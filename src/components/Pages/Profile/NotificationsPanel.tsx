import { Tab } from '@headlessui/react';
import { animated, Spring } from 'react-spring';
import ClaimPrizeButton from './ClaimPrizeButton';
import { reformatDate } from '@/utilities/strings';
import { GamePrize } from '@/prisma/types';
import { BaseMedia } from '@/components/Media/BaseMedia';
import CheckSVG from '@/public/icons/check.svg';
import usePagination from '@/hooks/usePagination';
import useUserNotifications from '@/hooks/useUserNotifications';

const prizeSorting = (a: GamePrize, b: GamePrize) => {
  if (a.claimedAt) {
    return b.claimedAt ? new Date(b.claimedAt).getTime() - new Date(a.claimedAt).getTime() : 1;
  }
  if (b.claimedAt) {
    return -1;
  }
  return b.nftId - a.nftId;
};

export default function Notifications() {
  const { prizeNfts, isLoading } = useUserNotifications();
  const sortedPrizes = prizeNfts.sort(prizeSorting);
  const { selectedPage, onNext, onPrev, pageSize } = usePagination({
    totalCount: prizeNfts.length,
    pageSize: 10,
  });
  const firstIndex = (selectedPage - 1) * pageSize;
  const secondIndex = selectedPage * pageSize;
  const pageItems = sortedPrizes.slice(firstIndex, secondIndex);

  return (
    <>
      <Spring to={{ translateX: 0 }} from={{ translateX: -100 }}>
        {(styles) => {
          return (
            <animated.h1 style={styles} className='profile-page__tabs-panel-header'>
              notifications
              <span className='profile-page__tabs-panel-subheader'>
                your personal control panel
              </span>
            </animated.h1>
          );
        }}
      </Spring>
      <Spring to={{ translateX: 0 }} from={{ translateX: -100 }}>
        {(styles) => {
          return (
            <animated.div style={styles} className='notifications-panel'>
              <Tab.Group>
                <Tab.List as='div' className='notifications-panel__tab-list'>
                  <Tab className='notifications-panel__tab-item' as='button'>
                    claim prizes
                  </Tab>
                </Tab.List>
                <Tab.Panels as='div' className='notifications-panel__panels'>
                  <Tab.Panel as='table' className='notifications-panel__table'>
                    <thead>
                      <tr className='notifications-panel__th-row'>
                        <th className='notifications-panel__th'>creation</th>
                        <th className='notifications-panel__th'>claim date</th>
                        <th className='notifications-panel__th'>interact</th>
                      </tr>
                    </thead>
                    <tbody className='notifications-panel__data-list'>
                      {!isLoading &&
                        pageItems.map((nft: GamePrize) => {
                          const dateDisplay = nft.claimedAt
                            ? reformatDate(nft.claimedAt)
                            : 'unclaimed';
                          return (
                            <tr key={nft.nftId} className='notifications-panel__data-row'>
                              <td className='notifications-panel__td--creation'>
                                <div className='notifications-panel__td-media-container'>
                                  <BaseMedia
                                    src={nft.s3Path}
                                    className='notifications-panel__td-media'
                                  ></BaseMedia>
                                </div>
                                <span className='notifications-panel__td--creation-name'>
                                  {nft.nftName}
                                </span>
                              </td>
                              <td className='notifications-panel__td--date'>{dateDisplay}</td>
                              <td className='notifications-panel__td--interact'>
                                <ClaimPrizeButton gamePrize={nft} />
                                <CheckSVG
                                  data-claimed={!!nft.claimedAt}
                                  className='notifications-panel__td--interact-check-svg'
                                />
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </Tab.Panel>
                  <div className='notifications-panel__pagination'>
                    <div onClick={onPrev} className='notifications-panel__pagination-page-arrow'>
                      &lt;
                    </div>
                    <div className='notifications-panel__pagination-page'>{selectedPage}</div>
                    <div onClick={onNext} className='notifications-panel__pagination-page-arrow'>
                      &gt;
                    </div>
                  </div>
                </Tab.Panels>
              </Tab.Group>
            </animated.div>
          );
        }}
      </Spring>
    </>
  );
}
