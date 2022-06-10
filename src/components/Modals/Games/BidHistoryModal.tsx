import Modal, { Props as ModalProps } from '@/components/Modals';
import shortenAddress from '@/utilities/shortenAddress';
import { gql, useQuery } from '@apollo/client';

interface Props extends ModalProps {
  auctionId: number;
}

export function BidHistoryModal({ isOpen, closeModal, auctionId }: Props) {

  const BID_HISTORY_QUERY = gql`
    query GetBidHistory($auctionId: String) {
      auction(id: $auctionId) {
        bids {
          bidder
          amount
        }
      }
    }
  `;
  const auctionIdHexStr = '0x' + auctionId.toString(16);
  const { error, data } = useQuery(BID_HISTORY_QUERY, {
    variables: { auctionId: auctionIdHexStr },
  });
  
  return (
    <Modal isOpen={isOpen} closeModal={closeModal}>
      <div className=''>
        {error}
        {data && data.auction &&
          data.auction.bids.map(({ bidder, amount }, i: number) => (
            <div key={i}>
              <p>
                {shortenAddress(bidder)} -&gt; {amount}
              </p>
            </div>
          ))}
      </div>
    </Modal>
  );
}
