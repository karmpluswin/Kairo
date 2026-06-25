"use client";

import { GitHubButton } from "./GithubButton";
import { SearchCommand } from "./SearchCommand";
import { FilterButton } from "./FilterButton";
import ThemeToggle from "@/components/ui/ThemeToggle";
import Link from "next/link";

const Header = () => {
  return (
    <header className="fixed inset-x-0 top-0 z-10 backdrop-blur-md bg-background/60 border-b border-border/40">
  <nav className="container mx-auto flex items-center justify-between h-14 sm:h-16 px-3 sm:px-4">
    <Link href="/" className="flex items-center shrink-0">
      <span
        className="
          bg-gradient-to-r
          from-green-400
          via-green-500
          to-lime-500
          bg-clip-text
          text-transparent
          text-3xl
          sm:text-4xl
          lg:text-5xl
          leading-none
          whitespace-nowrap
        "
        style={{ fontFamily: "var(--font-sukajan)" }}
      >
        Kairo
      </span>
    </Link>

    <div className="flex items-center gap-2">
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
