import React, { useState, useEffect } from 'react';

const TARGET_EXAM_DATE = new Date('2027-01-05T00:00:00').getTime();

const calculateTimeRemaining = () => {
  const now = new Date().getTime();
  const diff = Math.max(0, TARGET_EXAM_DATE - now);
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
};

export const CountdownTimer: React.FC = React.memo(() => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeRemaining);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeRemaining());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-4 gap-2 sm:gap-3 text-center" aria-label="Exam countdown timer">
      <div className="p-2.5 sm:p-3 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
        <span className="block text-xl sm:text-3xl font-black font-mono text-slate-900 dark:text-white">
          {timeLeft.days}
        </span>
        <span className="text-[10px] sm:text-xs font-mono text-slate-500 dark:text-slate-400 uppercase font-bold">
          Days
        </span>
      </div>
      <div className="p-2.5 sm:p-3 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
        <span className="block text-xl sm:text-3xl font-black font-mono text-slate-900 dark:text-white">
          {String(timeLeft.hours).padStart(2, '0')}
        </span>
        <span className="text-[10px] sm:text-xs font-mono text-slate-500 dark:text-slate-400 uppercase font-bold">
          Hours
        </span>
      </div>
      <div className="p-2.5 sm:p-3 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
        <span className="block text-xl sm:text-3xl font-black font-mono text-slate-900 dark:text-white">
          {String(timeLeft.minutes).padStart(2, '0')}
        </span>
        <span className="text-[10px] sm:text-xs font-mono text-slate-500 dark:text-slate-400 uppercase font-bold">
          Mins
        </span>
      </div>
      <div className="p-2.5 sm:p-3 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
        <span className="block text-xl sm:text-3xl font-black font-mono text-mech-orange">
          {String(timeLeft.seconds).padStart(2, '0')}
        </span>
        <span className="text-[10px] sm:text-xs font-mono text-slate-500 dark:text-slate-400 uppercase font-bold">
          Secs
        </span>
      </div>
    </div>
  );
});

export default CountdownTimer;
