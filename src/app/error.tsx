'use client';

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-center px-4">
      <h2 className="text-2xl font-bold">Couldn&apos;t load anime right now</h2>
      <p className="text-muted-foreground">
        The anime data source is temporarily unavailable. Please try again.
      </p>
      <button
        onClick={reset}
        className="px-4 py-2 rounded-lg bg-foreground text-background font-medium"
      >
        Try again
      </button>
    </div>
  );
}
