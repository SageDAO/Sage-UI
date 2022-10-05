import useCountdown from '@/hooks/useCountdown';
import { useEffect, useState } from 'react';

type Colors = 'purple';

interface Props {
  endTime: number | Date;
  color?: Colors;
  className?: string;
}

// function formatTime () {
//    var sec_num = parseInt(this, 10); // don't forget the second param
//    var hours   = Math.floor(sec_num / 3600);
//    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
//    var seconds = sec_num - (hours * 3600) - (minutes * 60);

//    if (hours   < 10) {hours   = "0"+hours;}
//    if (minutes < 10) {minutes = "0"+minutes;}
//    if (seconds < 10) {seconds = "0"+seconds;}
//    return hours+':'+minutes+':'+seconds;
// }
//

function checkTime(i: number) {
  let value: string = String(i);
  if (i < 10) {
    value = String('0' + value);
  }

  return value;
}

export default function Countdown({ endTime, color, className }: Props) {
  const { days, hours, minutes, seconds, total } = useCountdown({ targetDate: endTime });
  const [displayValue, setDisplayValue] = useState<string>('');
  let h = checkTime(days * 24 + hours);
  let m = checkTime(minutes);
  let s = checkTime(seconds);
  useEffect(() => {
    setDisplayValue(`${h}:${m}:${s}`);
  }, [total]);
  if (total < 0) {
    return null;
  }
  return (
    <div className={className} data-color={color} style={{ flexWrap: 'nowrap' }}>
      {displayValue}
    </div>
  );
}
