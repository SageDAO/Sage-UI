import { useEffect, useState } from 'react';

interface UseCountdownArgs {
  targetDate: number | Date;
}

function checkTime(i: number) {
  let value: string = String(i);
  if (i < 10) {
    value = String('0' + value);
  }

  return value;
}

const useCountdown = ({ targetDate }: UseCountdownArgs) => {
  const countDownDate = new Date(targetDate).getTime();

  const [countDown, setCountDown] = useState(countDownDate - new Date().getTime());

  useEffect(() => {
    const interval = setInterval(() => {
      setCountDown(countDownDate - new Date().getTime());
    }, 1000);

    return () => clearInterval(interval);
  }, [countDownDate]);

  return getReturnValues(countDown);
};

const getReturnValues = (countDown: number) => {
  // calculate time left
  const days = Math.floor(countDown / (1000 * 60 * 60 * 24));
  const hours = Math.floor((countDown % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((countDown % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((countDown % (1000 * 60)) / 1000);
  const total = countDown;

  let h = checkTime(days * 24 + hours);
  let m = checkTime(minutes);
  let s = checkTime(seconds);

  const displayValue = `${h}:${m}:${s}`;

  return { days, hours, minutes, seconds, total, displayValue };
};

export default useCountdown;
