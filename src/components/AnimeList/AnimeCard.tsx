import { Badge } from "@/components/ui/badge";
import { Star, Building2 } from "lucide-react";
import { SynopsisModal } from "./SynopsisModal";
import { TrailerModal } from "./TrailerModal";
import { Anime, AnimeStatus } from "@/types/anime";
import Image from "next/image";
import WatchingStatusControl from "./WatchingStatusControl";
import Countdown from "./Countdown";

export default function AnimeCard({
  images,
  trailer,
  title,
  title_english,
  type,
  broadcast,
  studios,
  genres,
  score,
  scored_by: scoredBy,
  episodes: totalEpisodes,
  status,
  aired,
  synopsis,
}: Readonly<Anime>) {
  const image = images.webp.large_image_url ?? images.jpg.large_image_url;
  const trailerUrl =
    trailer?.embed_url ??
    (trailer?.youtube_id
      ? `https://www.youtube.com/embed/${trailer.youtube_id}`
      : null);
  const joinedStudios = studios?.map((s) => s.name).join(", ") ?? "N/A";
  const showWatchingControl = status !== AnimeStatus.NOT_YET_AIRED && totalEpisodes;

  return (
    <div className="w-full max-w-[500px]">

      {/* ── < 400px: constrained width, side padding ── */}
<div className="flex min-[400px]:hidden flex-col w-[260px] mx-auto overflow-hidden rounded-xl border border-border bg-card text-card-foreground hover:border-green-500 transition-all ease-in-out">

  {/* Poster */}
  <div className="relative w-[220px] aspect-[2/3] mx-auto mt-3">
  <Image
    src={image}
    alt={title}
    fill
    className="object-cover rounded-lg"
    unoptimized
  />
</div>

  {/* Title */}
  <h3 className="font-bold text-base leading-snug line-clamp-2 text-center px-4 pt-3 pb-2">
    {title_english ?? title}
  </h3>

  {/* Buttons */}
  <div className="flex flex-col gap-2 px-4 pb-4">
    {showWatchingControl ? (
      <WatchingStatusControl title={title} totalEpisodes={totalEpisodes} />
    ) : null}

    <div className="flex flex-col gap-2">
      <SynopsisModal
        title={title_english ?? title}
        synopsis={synopsis}
        image={image}
        type={type}
        score={score}
        scoredBy={scoredBy}
        studios={joinedStudios}
        genres={genres}
      />
      <TrailerModal
        title={title_english ?? title}
        trailerUrl={trailerUrl}
        type={type}
        score={score}
        scoredBy={scoredBy}
        genres={genres}
      />
    </div>
  </div>
</div>

      {/* ── ≥ 400px: original horizontal card ── */}
      <div className="hidden min-[400px]:flex flex-row overflow-hidden rounded-xl border border-border bg-card text-card-foreground hover:border-green-500 transition-all ease-in-out w-full h-[288px]">

        {/* Poster */}
        <div className="relative shrink-0 w-[200px] h-[288px]">
          <Image
            src={image}
            alt={title}
            fill
            quality={90}
            className="object-cover"
            unoptimized
          />
        </div>

        {/* Right panel */}
        <div className="flex flex-col flex-1 min-w-0 p-4 justify-between gap-2">
          <div className="flex flex-col flex-1 justify-between min-h-0">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-bold text-lg leading-snug line-clamp-2 flex-1 min-h-[2.5rem]">
                {title_english ?? title}
              </h3>
              <Badge variant="secondary" className="shrink-0 text-xs font-semibold mt-0.5">
                {type}
              </Badge>
            </div>

            <div className="flex flex-col gap-1.5 text-sm my-auto">
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-yellow-400 shrink-0" />
                <span>
                  {!score ? "N/A" : `${score} (${scoredBy?.toLocaleString("en-US") ?? 0})`}
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
          </div>

          <div className="flex flex-col gap-2 mt-auto">
            {showWatchingControl ? (
              <WatchingStatusControl title={title} totalEpisodes={totalEpisodes} />
            ) : null}
            <div className="grid grid-cols-2 gap-2">
              <TrailerModal
                title={title_english ?? title}
                trailerUrl={trailerUrl}
                type={type}
                score={score}
                scoredBy={scoredBy}
                genres={genres}
              />
              <SynopsisModal
                title={title_english ?? title}
                synopsis={synopsis}
                image={image}
                type={type}
                score={score}
                scoredBy={scoredBy}
                studios={joinedStudios}
                genres={genres}
              />
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
