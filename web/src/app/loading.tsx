export default function Loading() {
  return (
    <main className="garden-shell">
      <div className="mb-8 space-y-3 border-b border-border pb-8">
        <div className="h-4 w-36 animate-pulse rounded-md bg-muted" />
        <div className="h-10 w-64 animate-pulse rounded-md bg-muted" />
        <div className="h-5 w-full max-w-xl animate-pulse rounded-md bg-muted" />
      </div>
      <div className="grid gap-3">
        {[1, 2, 3].map((item) => (
          <div key={item} className="garden-panel p-5">
            <div className="mb-4 flex justify-between gap-6">
              <div className="h-6 w-1/2 animate-pulse rounded-md bg-muted" />
              <div className="h-5 w-20 animate-pulse rounded-md bg-muted" />
            </div>
            <div className="space-y-2">
              <div className="h-4 w-full animate-pulse rounded-md bg-muted" />
              <div className="h-4 w-2/3 animate-pulse rounded-md bg-muted" />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
