'use client';

import { FC, useEffect, useState } from 'react';
import { Calendar } from 'lucide-react';
import { AnimeStatus, TimeUnits } from '@/types/anime';
import { TIME_UNITS } from '@/lib/constants';
import { calculateTimeRemaining, getNextBroadcastDate } from '@/lib/datetime';

type CountdownProps = {
  broadcastDay?: string | null;
  broadcastTime?: string | null;
  airedString?: string | null;
  type: string;
  status: AnimeStatus;
};

const Countdown: FC<CountdownProps> = ({
  broadcastDay,
  broadcastTime,
  airedString,
  type,
  status,
}) => {
  const [timeRemaining, setTimeRemaining] = useState<TimeUnits>({
    days: 0,
    hours: 0,
    minutes: 0,
  });

  useEffect(() => {
    if (type !== 'TV' || !broadcastDay || !broadcastTime) return;

    const updateCountdown = () => {
      const nextBroadcast = getNextBroadcastDate(broadcastDay, broadcastTime);
      setTimeRemaining(calculateTimeRemaining(nextBroadcast));
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, TIME_UNITS.minutes.ms);
    return () => clearInterval(interval);
  }, [type, broadcastDay, broadcastTime]);

  if (status === AnimeStatus.FINISHED_AIRING) {
    return (
      <div className="flex items-center gap-1">
        <Calendar className="mr-1 h-4 w-4" />
        <span>Finished Airing</span>
      </div>
    );
  }

  if (type === 'TV' && status === AnimeStatus.NOT_YET_AIRED) {
    return (
      <div className="flex items-center gap-1">
        <Calendar className="mr-1 h-4 w-4" />
        <span>Not Yet Aired</span>
      </div>
    );
  }

  const formatTime = (time: TimeUnits): string =>
    `${time.days}d ${time.hours}h ${time.minutes}m`;

  return (
    <div className="flex items-center gap-1">
      <Calendar className="mr-1 h-4 w-4" />
      <span>
        {type !== 'TV'
          ? (airedString ?? 'N/A')
          : formatTime(timeRemaining)}
      </span>
    </div>
  );
};

export default Countdown;
