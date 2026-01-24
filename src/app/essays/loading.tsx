export default function Loading() {
    return (
        <div className="flex min-h-screen flex-col items-center p-6 sm:p-24 relative">
            <div className="max-w-4xl w-full space-y-8 backdrop-blur-xl bg-white/30 dark:bg-zinc-900/30 p-8 sm:p-12 rounded-3xl border border-white/20 shadow-2xl">

                <div className="space-y-4 text-center sm:text-left sm:pl-20">
                    <div className="h-10 w-48 bg-gray-200 dark:bg-zinc-800 rounded-lg animate-pulse mx-auto sm:mx-0"></div>
                    <div className="h-4 w-64 bg-gray-200 dark:bg-zinc-800 rounded-lg animate-pulse mx-auto sm:mx-0"></div>
                </div>

                <div className="grid gap-6 py-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="p-8 bg-white/50 dark:bg-zinc-800/30 rounded-xl border border-white/40 dark:border-zinc-700/30 shadow-sm">
                            <div className="flex flex-col gap-4">
                                <div className="flex justify-between items-start">
                                    <div className="h-8 w-1/3 bg-purple-100 dark:bg-purple-900/30 rounded animate-pulse"></div>
                                    <div className="h-4 w-24 bg-gray-200 dark:bg-zinc-700 rounded animate-pulse"></div>
                                </div>
                                <div className="space-y-2 pl-6 border-l-2 border-purple-200 dark:border-purple-900/50">
                                    <div className="h-4 w-full bg-gray-200 dark:bg-zinc-700 rounded animate-pulse"></div>
                                    <div className="h-4 w-5/6 bg-gray-200 dark:bg-zinc-700 rounded animate-pulse"></div>
                                    <div className="h-4 w-4/6 bg-gray-200 dark:bg-zinc-700 rounded animate-pulse"></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
