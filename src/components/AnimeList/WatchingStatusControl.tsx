'use client';
import { FC } from 'react';
import { Plus, Minus, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RainbowButton } from '@/components/ui/rainbow-button';
import { useAnimeWatching } from '@/hooks/useAnimeWatching';

type WatchingStatusControlProps = {
  title: string;
  totalEpisodes: number;
};

const WatchingStatusControl: FC<WatchingStatusControlProps> = ({
  title,
  totalEpisodes,
}) => {
  const {
    watchedEpisodes,
    isWatching,
    progress,
    startWatching,
    increaseWatched,
    decreaseWatched,
  } = useAnimeWatching(title, totalEpisodes);

  return (
    <div className="w-full">
      {isWatching ? (
        <div className="w-full">
          <div className="flex items-center justify-between gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={decreaseWatched}
              disabled={watchedEpisodes === -1}
              className="rounded-xl border-2 transition-colors hover:bg-primary hover:text-primary-foreground shrink-0"
            >
              <Minus className="h-4 w-4" />
              <span className="sr-only">Decrease</span>
            </Button>
            <div className="flex-1 text-center">
              <div className="font-medium tabular-nums text-sm">
                {watchedEpisodes === totalEpisodes
                  ? 'Completed'
                  : `${watchedEpisodes} / ${totalEpisodes}`}
              </div>
              <div className="relative h-1 overflow-hidden rounded-full bg-muted mt-1">
                <div
                  className="absolute left-0 top-0 h-full rounded-full bg-primary transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={increaseWatched}
              disabled={watchedEpisodes === totalEpisodes}
              className="rounded-xl border-2 transition-colors hover:bg-primary hover:text-primary-foreground shrink-0"
            >
              <Plus className="h-4 w-4" />
              <span className="sr-only">Increase</span>
            </Button>
          </div>
        </div>
      ) : (
        // RainbowButton: dark bg + white text in dark mode, white bg + dark text in light mode
        // Rainbow animated border visible in both modes
        <RainbowButton onClick={startWatching}>
          <Eye className="h-4 w-4 mr-2" /> Start Watching
        </RainbowButton>
      )}
    </div>
  );
};

export default WatchingStatusControl;