export default function Loading() {
    return (
        <div className="flex min-h-screen flex-col items-center p-6 sm:p-24 relative overflow-hidden">
            {/* Background Skeleton */}
            <div className="fixed inset-0 z-[-1] pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-gray-200/50 dark:bg-zinc-800/30 rounded-full blur-[100px] animate-pulse"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-gray-200/50 dark:bg-zinc-800/30 rounded-full blur-[100px] animate-pulse animation-delay-2000"></div>
            </div>

            <div className="max-w-4xl w-full space-y-8 mt-16">
                {/* Title Skeleton */}
                <div className="space-y-4 text-center sm:text-left sm:pl-20">
                    <div className="h-10 w-48 bg-gray-200 dark:bg-zinc-800 rounded-lg animate-pulse mx-auto sm:mx-0"></div>
                    <div className="h-4 w-64 bg-gray-200 dark:bg-zinc-800 rounded-lg animate-pulse mx-auto sm:mx-0"></div>
                </div>

                {/* Cards Skeleton */}
                <div className="grid gap-6 py-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="p-8 bg-white/30 dark:bg-zinc-900/30 rounded-xl border border-white/20 dark:border-zinc-800/30 shadow-sm space-y-4">
                            <div className="flex justify-between items-start">
                                <div className="h-6 w-3/4 bg-gray-200 dark:bg-zinc-800 rounded animate-pulse"></div>
                                <div className="h-4 w-20 bg-gray-200 dark:bg-zinc-800 rounded animate-pulse"></div>
                            </div>
                            <div className="space-y-2">
                                <div className="h-4 w-full bg-gray-200 dark:bg-zinc-800 rounded animate-pulse"></div>
                                <div className="h-4 w-5/6 bg-gray-200 dark:bg-zinc-800 rounded animate-pulse"></div>
                            </div>
                            <div className="flex justify-end pt-2">
                                <div className="h-4 w-16 bg-gray-200 dark:bg-zinc-800 rounded animate-pulse"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
