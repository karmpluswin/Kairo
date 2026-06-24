<div align="center">

# Kairo カイロ

**Track what's airing. Never miss a season.**

A clean, fast seasonal anime tracker built with Next.js 15. Browse currently airing shows, discover all-time favorites, track your watch progress episode by episode, and filter by genre — all powered by the Jikan MAL API.

![Next.js](https://img.shields.io/badge/Next.js_15-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-000000?style=for-the-badge&logo=shadcnui&logoColor=white)

</div>

---

## Features

- **Seasonal Anime Feed** — current season shows fetched live from the Jikan MAL API, refreshed every hour
- **Pinned Popular Titles** — all-time classics like Attack on Titan, Death Note, and Jujutsu Kaisen always at the top
- **Watch Tracker** — mark shows as watching, track episode progress with + / − controls and a live progress bar
- **Episode Countdown** — real-time countdown to the next episode for airing shows
- **Search** — instant fuzzy search across all titles via a command palette
- **Genre Filter** — filter by Action, Romance, Mystery, Sci-Fi, and 15+ other genres
- **Synopsis Modal** — read the full synopsis and open the trailer without leaving the page
- **Dark / Light Mode** — full theme support with system preference detection
- **Responsive** — works on mobile, tablet, and desktop

---

## Tech Stack

| | |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Components | shadcn/ui + Radix UI |
| Animations | Motion (Framer Motion) |
| Data | Jikan API (MyAnimeList) |
| Icons | Lucide React |
| Package Manager | pnpm |

---

## Getting Started

```bash
# Clone the repo
git clone https://github.com/your-username/kairo.git

cd kairo

# Install dependencies
pnpm install

# Run the dev server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Project Structure

```
src/
├── app/              # Next.js app router (layout, page, globals.css)
├── components/
│   ├── AnimeList/    # AnimeCard, AnimeGrid, Countdown, SynopsisModal, WatchingStatusControl
│   ├── Header/       # SearchCommand, FilterButton, GithubButton, ThemeToggle
│   ├── Providers/    # ThemeProvider, AnimeFilterContext
│   └── ui/           # shadcn/ui components
├── hooks/            # useAnimeWatching
├── lib/              # Jikan API client, constants, utils, fonts
└── types/            # Anime types
```

---

## Data & Caching

Anime data is fetched server-side from the [Jikan API](https://jikan.moe/) (unofficial MyAnimeList API) and revalidated every hour (`revalidate = 3600`). Watch progress is stored locally in `localStorage`.

---

<div align="center">
Made with ❤️ by Karmjeet and Special thanks to github.com/@ senbo1
</div>
