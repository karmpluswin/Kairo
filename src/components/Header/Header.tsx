'use client';

import { GitHubButton } from './GithubButton';
import { SearchCommand } from './SearchCommand';
import { FilterButton } from './FilterButton';
import ThemeToggle from '@/components/ui/ThemeToggle';

const Header = () => {
  return (
    <header className="fixed inset-x-0 top-0 z-10 backdrop-blur-md bg-background/60 border-b border-border/40">
      <nav className="container mx-auto flex justify-between items-center h-16 px-4">

        <div className="flex items-center shrink-0">
          <h1 className="flex text-2xl font-bold whitespace-nowrap">
            <span className="text-green-500 mr-1">Kairo</span>
            <span className="text-foreground">[カイロ]</span>
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