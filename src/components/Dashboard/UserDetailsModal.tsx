import { useGetPointsBalanceByUserQuery } from '@/store/pointsReducer';
import Modal, { Props as ModalProps } from '@/components/Modals';
import { PfpImage } from '@/components/Media';
import LoaderDots from '../LoaderDots';
import { User_include_EarnedPoints } from '@/prisma/types';
import { usePromoteUserToArtistMutation } from '@/store/dashboardReducer';
import LoaderSpinner from '../LoaderSpinner';
import { useSigner } from 'wagmi';
import { Signer } from 'ethers';

interface UserDetailsModalProps extends ModalProps {
  userData: User_include_EarnedPoints;
}

export function UserDetailsModal({ isOpen, closeModal, userData }: UserDetailsModalProps) {
  const { data: pointsBalance, isFetching: isFetchingPoints } = useGetPointsBalanceByUserQuery(
    userData?.walletAddress,
    { skip: !userData }
  );
  const [promoteUserToArtist, {isLoading: isPromoting}] = usePromoteUserToArtistMutation();
  const { data: signer } = useSigner();

  async function handlePromoteToArtistClick(walletAddress: string) {
    await promoteUserToArtist({walletAddress, signer: signer as Signer});
  }

  return (
    <Modal title='User Details' isOpen={isOpen} closeModal={closeModal}>
      <div className='dashboard__user-details-modal'>
        <div style={{ textAlign: 'center' }}>
          {isFetchingPoints ? (
            <LoaderDots />
          ) : (
            <div>
              <div className='dashboard__user-details-modal__pfp-container'>
                <PfpImage src={userData?.profilePicture} />
              </div>
              <div style={{ fontWeight: 'bolder' }}>{userData?.username}</div>
              <div style={{ marginTop: '20px' }}>{userData?.email}</div>
              <div style={{ marginTop: '20px', fontStyle: 'italic', maxWidth: '300px', marginLeft: 'auto', marginRight: 'auto' }}>{userData?.bio}</div>
              <div style={{ marginTop: '20px' }}>{userData?.walletAddress}</div>
              <div style={{ marginTop: '20px' }}>
                {userData?.EarnedPoints?.totalPointsEarned} PIXEL earned
              </div>
              <div>{pointsBalance} PIXEL balance</div>
              <div style={{ marginTop: '20px' }}>
                Role: {<span style={{ color: userData?.role == 'ADMIN' ? 'red' : userData?.role == 'ARTIST' ? 'blue' : '' }}>{userData?.role}</span>}
              </div>
              {userData?.role == 'USER' && userData?.username && (
                <button
                  disabled={isPromoting}
                  onClick={() => handlePromoteToArtistClick(userData?.walletAddress!)}
                  className='btn-place-bid'
                  style={{ marginTop: '20px', lineHeight: '40px' }}
                >
                  {isPromoting ? <LoaderSpinner /> : 'Promote to ARTIST'}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
