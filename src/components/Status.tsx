import Countdown from './Countdown';

// styles/components/_status.scss
type GameStatus = 'Done' | 'Live' | 'Error' | 'Upcoming' | 'Settled';

interface ComputeGameStatusArgs {
  endTime: number | Date;
  startTime: number | Date;
  settled: boolean;
}

export function computeGameStatus({
  startTime,
  endTime,
  settled,
}: ComputeGameStatusArgs): GameStatus {
  let end = +endTime;
  let start = +startTime;
  if (settled) {
    return 'Settled';
  }
  if (end < Date.now()) {
    return 'Done';
  }
  if (start < Date.now()) {
    return 'Live';
  }
  if (start > Date.now()) {
    return 'Upcoming';
  }

  return 'Error';
}

interface Props extends ComputeGameStatusArgs {}

// src/styles/components/_status.scss
export default function Status({ endTime, startTime, settled }: Props) {
  const gameStatus = computeGameStatus({ endTime, startTime, settled });
  return (
    <div className='status'>
      <div className='status__is-live'>
        <div className='status__dot' data-status={gameStatus} />
        <div className='status__text'>{gameStatus}</div>
        {gameStatus === 'Live' && (
          <Countdown className='status__countdown' endTime={endTime}></Countdown>
        )}
        {gameStatus === 'Upcoming' && (
          <Countdown className='status__countdown' endTime={startTime}></Countdown>
        )}
      </div>
    </div>
  );
}
