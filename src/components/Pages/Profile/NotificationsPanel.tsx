import { Tab } from '@headlessui/react';
import ClaimPrizeButton from './ClaimPrizeButton';
import { formatDateYYMMddHHmm, formatTimestampYYMMddHHmm } from '@/utilities/strings';
import { BaseMedia } from '@/components/Media/BaseMedia';
import usePagination from '@/hooks/usePagination';
import useUserNotifications from '@/hooks/useUserNotifications';
import ClaimRefundButton from './ClaimRefundButton';
import { GamePrize } from '@/prisma/types';
import { Refund } from '@prisma/client';

export default function Notifications() {
  const { prizeNfts, refunds, isLoading } = useUserNotifications();
  const items = prizeNfts && refunds ? [...prizeNfts, ...refunds] : [];
  const { selectedPage, onNext, onPrev, pageSize } = usePagination({
    totalCount: items.length,
    pageSize: 10,
  });
  const firstIndex = (selectedPage - 1) * pageSize;
  const secondIndex = selectedPage * pageSize;
  const sortedItems = items.sort(sorting);
  const pageItems = sortedItems.slice(firstIndex, secondIndex);

  return (
    <>
      <h1 className='profile-page__tabs-panel-header'>
        notifications
        <span className='profile-page__tabs-panel-subheader'>your personal control panel</span>
      </h1>
      <div className='notifications-panel'>
        <Tab.Group>
          <Tab.List as='div' className='notifications-panel__tab-list'>
            <Tab className='notifications-panel__tab-item' as='button'>
              claim prizes <span style={{ fontSize: '66%' }}>& refunds</span>
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
                  pageItems.map((item: any, i: number) => {
                    return isRefund(item) ? (
                      <RefundNotificationRow key={i} refund={item} />
                    ) : (
                      <GamePrizeNotificationRow key={i} prize={item} />
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
      </div>
    </>
  );
}

function RefundNotificationRow({ refund }) {
  const dateDisplay = refund.blockTimestamp
    ? formatTimestampYYMMddHHmm(refund.blockTimestamp)
    : 'unclaimed';
  return (
    <tr key={refund.id} className='notifications-panel__data-row'>
      <td className='notifications-panel__td--creation'>
        <div className='notifications-panel__td-media-container'>
          <BaseMedia
            src={refund.Lottery.Nfts[0].s3PathOptimized}
            className='notifications-panel__td-media'
          ></BaseMedia>
        </div>
        <span className='notifications-panel__td--creation-name'>
          REFUND: {refund.refundableTokens} ASH
        </span>
      </td>
      <td className='notifications-panel__td--date'>{dateDisplay}</td>
      <td className='notifications-panel__td--interact'>
        <ClaimRefundButton refund={refund} />
      </td>
    </tr>
  );
}

function GamePrizeNotificationRow({ prize }) {
  const dateDisplay = prize.claimedAt ? formatDateYYMMddHHmm(prize.claimedAt) : 'unclaimed';
  return (
    <tr key={prize.nftId} className='notifications-panel__data-row'>
      <td className='notifications-panel__td--creation'>
        <div className='notifications-panel__td-media-container'>
          <BaseMedia
            src={prize.s3PathOptimized}
            className='notifications-panel__td-media'
          ></BaseMedia>
        </div>
        <span className='notifications-panel__td--creation-name'>{prize.nftName}</span>
      </td>
      <td className='notifications-panel__td--date'>{dateDisplay}</td>
      <td className='notifications-panel__td--interact'>
        <ClaimPrizeButton gamePrize={prize} />
      </td>
    </tr>
  );
}

function isRefund(obj: GamePrize | Refund): boolean {
  return Object.hasOwn(obj, 'buyer');
}

const getTimeMilis = (x: GamePrize | Refund) => {
  if (isRefund(x)) {
    return (x as Refund).blockTimestamp ? (x as Refund).blockTimestamp * 1000 : undefined;
  }
  return (x as GamePrize).claimedAt ? new Date((x as GamePrize).claimedAt).getTime() : undefined;
};

const sorting = (a: GamePrize | Refund, b: GamePrize | Refund) => {
  const aTime = getTimeMilis(a);
  const bTime = getTimeMilis(b);
  if (aTime) {
    return bTime ? bTime - aTime : 1;
  }
  if (bTime) {
    return -1;
  }
  return 1;
};
