import { computeLotteryStatus, ComputeLotteryStatusArgs } from '@/utilities/status';
import Countdown from '../Countdown';
import LoaderSpinner from '../LoaderSpinner';

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
            <LoaderSpinner /> Getting...
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
