import { Tab } from '@headlessui/react';
import useTabs from '@/hooks/useTabs';
import { Signer } from 'ethers';
import { BaseMedia } from '@/components/Media';
import Image from 'next/image';
import { useClaimLotteryPrizeMutation, useGetUnclaimedPrizesQuery } from '@/store/prizesReducer';
import { useClaimAuctionNftMutation } from '@/store/auctionsReducer';
import { useSession } from 'next-auth/react';
import { useGetUserQuery } from '@/store/usersReducer';
import { useSigner } from 'wagmi';

export default function Notifications() {
  const { data: prizeData } = useGetUnclaimedPrizesQuery();
  const [claimLotteryPrize] = useClaimLotteryPrizeMutation();
  const [claimAuctionPrize] = useClaimAuctionNftMutation();
  const { data: userData } = useGetUserQuery();
  const { data: signer } = useSigner();
  return (
    <div className='notifications-panel'>
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
                <th className='notifications-panel__th'>date</th>
                <th className='notifications-panel__th'>interact</th>
              </tr>
            </thead>
            <tbody className='notifications-panel__data-list'>
              {prizeData?.map((p) => {
                const dateDisplay = p.claimedAt?.toLocaleDateString().replace('/', '.');
                async function handleInteractButtonClick() {
                  if (!userData) return;
                  if (p.lotteryId && p.lotteryProof) {
                    claimLotteryPrize({
                      lotteryId: p.lotteryId,
                      proof: p.lotteryProof,
                      walletAddress: userData.walletAddress,
                      signer: signer as Signer,
                      nftId: p.nftId,
                    });
                  } else if (p.auctionId) {
                    claimAuctionPrize({ id: p.auctionId, signer: signer as Signer });
                  }
                }
                return (
                  <tr className='notifications-panel__data-row'>
                    <td className='notifications-panel__td--creation'>
                      <Image
                        width={50}
                        height={50}
                        src={p.s3Path}
                        objectFit='cover'
                        className=''
                      ></Image>
                      fungible
                    </td>
                    <td className='notifications-panel__td'>{dateDisplay}</td>
                    <td className='notifications-panel__td'>
                      <button
                        onClick={handleInteractButtonClick}
                        className='notifications-panel__interact-button'
                      >
                        mint/claim
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}
