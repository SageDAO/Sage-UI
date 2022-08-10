import useCountdown from '@/hooks/useCountdown';
import { useEffect, useState } from 'react';

type Colors = 'purple';

interface Props {
  endTime: number | Date;
  color?: Colors;
  className?: string;
}

export default function Countdown({ endTime, color, className }: Props) {
  const { days, hours, minutes, seconds, total } = useCountdown({ targetDate: endTime });
  const [displayValue, setDisplayValue] = useState<string>('');
  useEffect(() => {
    setDisplayValue(`${days * 24 + hours}h ${minutes}m ${seconds}s`);
  }, [total]);
  if (total < 0) {
  }
  return (
    <div className={className} data-color={color} style={{ flexWrap: 'nowrap' }}>
      {displayValue}
    </div>
  );
}
