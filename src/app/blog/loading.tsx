export default function Loading() {
    return (
        <div className="flex min-h-screen flex-col items-center p-6 sm:p-24 relative">
            <div className="max-w-6xl w-full flex flex-col xl:flex-row gap-6">
                <div className="flex-1 space-y-8 backdrop-blur-xl bg-white/30 dark:bg-zinc-900/30 p-8 sm:p-12 rounded-3xl border border-white/20 shadow-2xl">
                    <div className="space-y-4 text-center sm:text-left sm:pl-20">
                        <div className="h-10 w-48 bg-gray-200 dark:bg-zinc-800 rounded-lg animate-pulse mx-auto sm:mx-0"></div>
                        <div className="h-4 w-64 bg-gray-200 dark:bg-zinc-800 rounded-lg animate-pulse mx-auto sm:mx-0"></div>
                    </div>

                    <div className="grid gap-4 py-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="p-6 bg-white/60 dark:bg-zinc-800/40 rounded-2xl border border-zinc-200/50 dark:border-zinc-700/50 shadow-sm space-y-4">
                                <div className="flex justify-between items-center">
                                    <div className="h-6 w-1/2 bg-gray-200 dark:bg-zinc-700 rounded animate-pulse"></div>
                                    <div className="h-5 w-20 bg-gray-200 dark:bg-zinc-700 rounded animate-pulse"></div>
                                </div>
                                <div className="space-y-2">
                                    <div className="h-4 w-full bg-gray-200 dark:bg-zinc-700 rounded animate-pulse"></div>
                                    <div className="h-4 w-2/3 bg-gray-200 dark:bg-zinc-700 rounded animate-pulse"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Sidebar Skeleton */}
                <aside className="xl:w-72 flex-shrink-0 hidden xl:block">
                    <div className="p-5 bg-white/40 dark:bg-zinc-900/40 rounded-3xl border border-white/20 dark:border-zinc-800/50 backdrop-blur-xl shadow-xl space-y-4">
                        <div className="h-6 w-24 bg-gray-200 dark:bg-zinc-700 rounded animate-pulse"></div>
                        <div className="flex flex-wrap gap-2">
                            {[1, 2, 3, 4, 5, 6].map(i => (
                                <div key={i} className="h-8 w-16 bg-gray-200 dark:bg-zinc-700 rounded-full animate-pulse"></div>
                            ))}
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}
