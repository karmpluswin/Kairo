import Header from '@/components/Header/Header';
import AnimeList from '@/components/AnimeList/AnimeList';
import { HeroLine } from '@/components/HeroLine';

export const dynamic = 'force-dynamic';
export const revalidate = 3600;

export default function Home() {
  return (
    <>
      <Header />
      <div className="w-full mx-auto flex flex-col items-center p-2 xl:p-0 mt-16">
        <HeroLine />
        <AnimeList />
      </div>
    </>
  );
}