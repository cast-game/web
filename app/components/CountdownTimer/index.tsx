import React, { useState, useEffect } from 'react';

interface CountdownTimerProps {
  endTime: Date;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ endTime }) => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  function calculateTimeLeft() {
    const difference = +new Date(endTime) - +new Date();
    let timeLeft = {
      hours: 0,
      minutes: 0,
      seconds: 0
    };

    if (difference > 0) {
      timeLeft = {
        hours: Math.floor(difference / (1000 * 60 * 60)),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }

    return timeLeft;
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearTimeout(timer);
  });

  const formatTime = (value: number) => {
    return value.toString().padStart(2, '0');
  };

  return (
    <div className="flex items-center justify-center">
      {timeLeft.hours !== undefined ? (
        <span className="text-2xl font-bold">
          {formatTime(timeLeft.hours)}:{formatTime(timeLeft.minutes)}:{formatTime(timeLeft.seconds)}
        </span>
      ) : (
        <span className="text-2xl font-bold">00:00:00</span>
      )}
    </div>
  );
};

export default CountdownTimer;