'use client';

import { GitHubButton } from './GithubButton';
import { SearchCommand } from './SearchCommand';
import { FilterButton } from './FilterButton';
import ThemeToggle from '@/components/ui/ThemeToggle';

const Header = () => {
  return (
    <header className="fixed inset-x-0 top-0 z-10 backdrop-blur-md bg-background/60 border-b border-border/40">
      <nav className="container mx-auto flex justify-between items-center h-16">

        <div className="flex items-center shrink-0">
          <h1 className="flex text-2xl font-bold whitespace-nowrap">
            <span
              className="bg-gradient-to-r from-green-400 via-green-500 to-lime-500 bg-clip-text text-transparent mr-1 text-5xl"
              style={{ fontFamily: "var(--font-sukajan)" }}
            >
              Kairo
            </span>
            {/* <span className="text-foreground">[カイロ]</span> */}
          </h1>
        </div>

        <div className="flex gap-2 items-center">
          <SearchCommand />
          <FilterButton />
          <GitHubButton repoUrl="https://github.com/karmpluswin/kairo" />
          <ThemeToggle />
        </div>

      </nav>
    </header>
  );
};

export default Header;