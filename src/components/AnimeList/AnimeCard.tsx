import { Badge } from "@/components/ui/badge";
import { Star, Building2 } from "lucide-react";
import { SynopsisModal } from "./SynopsisModal";
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
  score,
  scored_by: scoredBy,
  episodes: totalEpisodes,
  status,
  aired,
  synopsis,
}: Readonly<Anime>) {
  const image = images.webp.large_image_url ?? images.jpg.large_image_url;
  const trailerUrl = trailer.url ?? "#";
  const joinedStudios = studios?.map((s) => s.name).join(", ") ?? "N/A";

  const showWatchingControl =
    status !== AnimeStatus.NOT_YET_AIRED && totalEpisodes;

  return (
    <div className="w-full max-w-[500px]">
      <div className="flex flex-col min-[400px]:flex-row overflow-hidden rounded-xl border border-border bg-card text-card-foreground hover:border-green-500 transition-all ease-in-out w-[200px] mx-auto min-[400px]:w-full min-[400px]:mx-0 min-[400px]:h-[288px]">
        {/* Poster — fixed 200×288 on all screen sizes */}
        <div className="relative shrink-0 w-[200px] h-[288px]">
          <Image
            src={image}
            alt={title}
            fill
            quality={100}
            className="object-cover"
            unoptimized
          />
        </div>

        {/* Below poster on narrow viewports; right-side panel on wider screens */}
        <div className="flex flex-col flex-1 min-w-0 p-2 min-[400px]:p-4 min-[400px]:justify-between gap-2 border-t min-[400px]:border-t-0 border-border">
          {/* Title + stats — hidden only on narrow viewports */}
          <div className="hidden min-[400px]:flex flex-col flex-1 justify-between min-h-0">
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

            <div className="flex flex-col gap-1.5 text-sm my-auto">
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-yellow-400 shrink-0" />
                <span>
                  {!score
                    ? "N/A"
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
          </div>

          {/* Buttons — below poster when narrow, bottom of content when wide */}
          <div className="flex flex-col gap-2 min-[400px]:mt-auto">
            {showWatchingControl ? (
              <WatchingStatusControl
                title={title}
                totalEpisodes={totalEpisodes}
              />
            ) : null}
            <SynopsisModal title={title} synopsis={synopsis} />
          </div>
        </div>
      </div>
    </div>
  );
}
