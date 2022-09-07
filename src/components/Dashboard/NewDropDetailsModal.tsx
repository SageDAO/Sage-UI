import Modal, { Props as ModalProps } from '@/components/Modals';
import { Drop_include_GamesAndArtist } from '@/prisma/types';

interface NewDropDetailsModalProps extends ModalProps {
  drop: Drop_include_GamesAndArtist;
}

export function NewDropDetailsModal({ isOpen, closeModal, drop }: NewDropDetailsModalProps) {
  return (
    <Modal title='Drop Details' isOpen={isOpen} closeModal={closeModal}>
      <div className='dashboard__drop-details-modal'>
        <div style={{ textAlign: 'center' }}>
          Drop Details Preview<br/>
          WORK IN PROGRESS<br/><br/>
          {drop.Lotteries && (
            <>
              Lotteries:<br/><br/>
              {drop.Lotteries.map((lottery, i) => {
                return (
                  <div key={i}>
                    Start Time: {lottery.startTime}<br/>
                    End Time: {lottery.endTime}<br/>
                    Cost: {lottery.costPerTicketTokens} ASH + {lottery.costPerTicketPoints} PIXEL<br/>
                    Max Tickets: {lottery.maxTickets}<br/>
                    Max Tickets Per User: {lottery.maxTicketsPerUser}<br/>
                    Nfts:<br/>

                    {lottery.Nfts.map((nft, i) => {
                      return (
                        <div key={i}>
                          Name: {nft.name}<br/>
                          Editions: {nft.numberOfEditions}<br/>
                          Tags: {nft.tags}<br/>
                          Description: {nft.description}<br/>
                        </div>
                      );
                    })}
                    <br/><br/>
                  </div>
                );
              })}
            </>
          )}
          {drop.Auctions && (
            <>
              Auctions:<br/><br/>
              {drop.Auctions.map((auction, i) => {
                return (
                  <>{auction.Nft.name}<br/></>
                );
              })}
            </>
          )}
        </div>
      </div>
    </Modal>
  );
}
