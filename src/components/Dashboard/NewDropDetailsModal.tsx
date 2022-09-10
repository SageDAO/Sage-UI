import Modal, { Props as ModalProps } from '@/components/Modals';
import { Drop_include_GamesAndArtist } from '@/prisma/types';

interface NewDropDetailsModalProps extends ModalProps {
  drop: Drop_include_GamesAndArtist;
}

export function NewDropDetailsModal({ isOpen, closeModal, drop }: NewDropDetailsModalProps) {
  return (
    <Modal title='Drop Details' isOpen={isOpen} closeModal={closeModal}>
      <div className='dashboard__drop-details-modal' style={{ padding: '25px' }}>
        <div style={{ textAlign: 'center', fontSize: '14px', lineHeight: '18px' }}>
          DROP {drop.id}
          <br />
          <br />
          <img src={drop.bannerImageS3Path} width={300} />
          <br />
          {drop.name}, by {drop.NftContract.Artist.username}
          <br />
          <br />
          Description: {drop.description}
          <br />
          <br />
          {drop.Lotteries && (
            <>
              <hr />
              <br />
              {drop.Lotteries.map((lottery, i) => {
                return (
                  <div key={i}>
                    LOTTERY {lottery.id}
                    <br />
                    <br />
                    Start Time: {lottery.startTime}
                    <br />
                    End Time: {lottery.endTime}
                    <br />
                    Cost: {lottery.costPerTicketTokens} ASH + {lottery.costPerTicketPoints} PIXEL
                    <br />
                    Max Tickets: {lottery.maxTickets}
                    <br />
                    Max Tickets Per User: {lottery.maxTicketsPerUser}
                    <br />
                    <br />
                    <table>
                      <tr>
                        {lottery.Nfts.map((nft, i) => {
                          return (
                            <td key={i} style={{ padding: '10px' }}>
                              <img src={nft.s3Path} width={150} />
                              <br />
                              Name: {nft.name}
                              <br />
                              Editions: {nft.numberOfEditions}
                              <br />
                              Tags: {nft.tags}
                              <br />
                              Description: {nft.description}
                              <br />
                            </td>
                          );
                        })}
                      </tr>
                    </table>
                  </div>
                );
              })}
            </>
          )}
          <hr />
          <br />
          {drop.Auctions &&
            drop.Auctions.map((auction, i) => {
              return (
                <div key={i}>
                  AUCTION {auction.id}
                  <br />
                  <br />
                  Start Time: {auction.startTime}
                  <br />
                  End Time: {auction.endTime}
                  <br />
                  Min Price: {auction.minimumPrice} ASH
                  <br />
                  <br />
                  <img src={auction.Nft.s3Path} width={150} />
                  <br />
                  Name: {auction.Nft.name}
                  <br />
                  Tags: {auction.Nft.tags}
                  <br />
                  Description: {auction.Nft.description}
                  <br />
                </div>
              );
            })}
        </div>
      </div>
    </Modal>
  );
}
