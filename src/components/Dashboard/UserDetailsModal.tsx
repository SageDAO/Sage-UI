import { useGetPointsBalanceQuery } from '@/store/services/pointsReducer';
import Modal, { Props as ModalProps } from '@/components/Modals';
import Loader from 'react-loader-spinner';
import { PfpImage } from '@/components/Image';

interface UserDetailsModalProps extends ModalProps {
  userData: any;
}

export function UserDetailsModal({ isOpen, closeModal, userData }: UserDetailsModalProps) {
  const { data: pointsBalance, isFetching: isFetchingPoints } = useGetPointsBalanceQuery(
    userData?.walletAddress,
    { skip: !userData }
  );

  return (
    <Modal title='User Details' isOpen={isOpen} closeModal={closeModal}>
      <div>
        {isFetchingPoints ? (
          <Loader type='ThreeDots' color='white' height={10} width={50} timeout={0} />
        ) : (
          <div style={{ textAlign: 'center' }}>
            <div className='dashboard__user-details-pfp-container'>
              <PfpImage src={userData?.profilePicture} />
            </div>
            <div style={{ fontWeight: 'bolder' }}>{userData?.username}</div>
            <div>{userData?.displayName}</div>
            <div>{userData?.email}</div>
            <div style={{ fontStyle: 'italic' }}>{userData?.bio}</div>
            <div>{userData?.walletAddress}</div>
            <div>{userData?.EarnedPoints.totalPointsEarned} PIXEL earned</div>
            <div>{pointsBalance} PIXEL balance</div>
          </div>
        )}
      </div>
    </Modal>
  );
}
