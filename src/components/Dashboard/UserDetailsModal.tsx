import { useGetPointsBalanceQuery } from '@/store/services/pointsReducer';
import Modal, { Props as ModalProps } from '@/components/Modals';
import Loader from 'react-loader-spinner';
import { DEFAULT_PROFILE_PICTURE } from '@/constants/config';

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
            <div>
              <img src={userData?.profilePicture || DEFAULT_PROFILE_PICTURE} />
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
