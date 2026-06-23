import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, Building2, Play } from 'lucide-react';
import { SynopsisModal } from './SynopsisModal';
import { Anime, AnimeStatus } from '@/types/anime';
import Image from 'next/image';
import WatchingStatusControl from './WatchingStatusControl';
import Countdown from './Countdown';

export default function AnimeCard({
  images,
  trailer,
  title,
  title_english,
  type,
  broadcast,
  studios,
  score,
  scored_by: scoredBy,
  episodes: totalEpisodes,
  status,
  aired,
  synopsis,
}: Readonly<Anime>) {
  const image = images.webp.large_image_url ?? images.jpg.large_image_url;
  const trailerUrl = trailer.url ?? '#';
  const joinedStudios = studios?.map((s) => s.name).join(', ') ?? 'N/A';

  return (
    <div
      className="flex flex-row overflow-hidden rounded-xl border border-border bg-card text-card-foreground hover:border-green-500 transition-all ease-in-out"
      style={{ width: '500px', height: '288px' }}
    >
      {/* Poster — fixed 200px wide */}
      <div className="relative shrink-0 h-full" style={{ width: '200px' }}>
        <Image
          src={image}
          alt={title}
          fill
          quality={90}
          className="object-cover rounded-l-xl"
          sizes="(min-width: 0px) 400px"
        />
      </div>

      {/* Content — fills remaining 300px */}
      <div className="flex flex-col justify-between w-full min-w-0 p-4">

        {/* Title row */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-bold text-lg leading-snug line-clamp-2 flex-1 min-h-[2.5rem]">
            {title_english ?? title}
          </h3>
          <Badge
            variant="secondary"
            className="shrink-0 text-xs font-semibold mt-0.5"
          >
            {type}
          </Badge>
        </div>

        {/* Stats */}
        <div className="flex flex-col gap-1.5 text-sm my-auto">
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 text-yellow-400 shrink-0" />
            <span>
              {!score
                ? 'N/A'
                : `${score} (${scoredBy?.toLocaleString("en-US") ?? 0})`}
            </span>
          </div>
          <Countdown
            broadcastDay={broadcast.day}
            broadcastTime={broadcast.time}
            airedString={aired?.string}
            type={type}
            status={status}
          />
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 shrink-0 text-foreground" />
            <span className="truncate">{joinedStudios}</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-2 mt-auto">
          {status !== AnimeStatus.NOT_YET_AIRED && totalEpisodes ? (
            <WatchingStatusControl
              title={title}
              totalEpisodes={totalEpisodes}
            />
          ) : null}
          <div className="flex flex-row gap-2 cursor-pointer">
            {/* <Button size="sm" className="w-1/2" asChild>
              <a target="_blank" rel="noopener noreferrer">
                <Play className="mr-2 h-3 w-3" /> Trailer
              </a>
            </Button> */}
            <SynopsisModal title={title} synopsis={synopsis} />
          </div>
        </div>
      </div>
    </div>
  );
}