import { useSigner } from 'wagmi';
import { toast } from 'react-toastify';
import { Refund } from '@prisma/client';
import { useClaimRefundMutation } from '@/store/lotteriesReducer';
import LoaderSpinner from '@/components/LoaderSpinner';

interface Props {
  refund: Refund;
}

export default function ClaimRefundButton({ refund }: Props) {
  const [claimRefund, { isLoading: isClaimingRefund }] = useClaimRefundMutation();
  const { data: signer } = useSigner();

  async function handleInteractButtonClick() {
    if (!signer) {
      toast.info('Please sign in with a wallet.');
      return;
    }
    await claimRefund({ refund, signer });
  }

  if (refund.txHash) {
    return (
      <button disabled={true} className='notifications-panel__interact-button'>
        claimed
      </button>
    );
  }
  return (
    <button
      disabled={isClaimingRefund || !!refund.txHash}
      onClick={handleInteractButtonClick}
      className='notifications-panel__interact-button'
    >
      {isClaimingRefund ? <LoaderSpinner /> : 'claim'}
    </button>
  );
}
