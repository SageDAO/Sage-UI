import { computeLotteryStatus, ComputeLotteryStatusArgs } from '@/utilities/status';
import Loader from 'react-loader-spinner';
import Countdown from '../Countdown';

interface Props extends ComputeLotteryStatusArgs {
  pending: boolean;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}

export default function GetTicketsButton({ pending, onClick, startTime, endTime }: Props) {
  const status = computeLotteryStatus({ startTime, endTime });
  if (status === 'live') {
    return (
      <button className='btn-get-tickets' disabled={pending} onClick={onClick}>
        {pending ? (
          <>
            <Loader type='TailSpin' color='white' height='20px' width='20px' /> Getting...
          </>
        ) : (
          'Get Tickets'
        )}
      </button>
    );
  }

  if (status === 'drawn') {
    return (
      <button className='btn-get-tickets' disabled={true} onClick={onClick}>
        Drawn
      </button>
    );
  }

  if (status === 'upcoming') {
    return (
      <button className='btn-get-tickets' disabled={true} onClick={onClick} data-status='upcoming'>
        <Countdown endTime={startTime}></Countdown>
      </button>
    );
  }
  return null;
}
