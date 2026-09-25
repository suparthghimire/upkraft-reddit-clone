'use client';
import { ArrowDownUp, Search } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

function PostsToolbar() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const querySearchValue = searchParams.get('q') ?? '';

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      return params.toString();
    },
    [searchParams],
  );

  function onQueryChange(key: string, value: string) {
    const queryString = createQueryString(key, value);
    router.push(pathname + '?' + queryString);
  }

  return (
    <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center">
      <label className="relative min-w-0 flex-1">
        <span className="sr-only">Search posts</span>
        <Search
          className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-black/40"
          aria-hidden="true"
        />
        <input
          value={querySearchValue}
          onChange={(event) => onQueryChange('q', event.target.value)}
          className="h-11 w-full rounded-full border border-black/10 bg-white pl-11 pr-11 text-sm shadow-[0_1px_0_rgba(0,0,0,0.03)] outline-none transition placeholder:text-black/35 focus:border-[#ee5a2f]/50 focus:ring-4 focus:ring-[#ee5a2f]/10"
          placeholder="Search posts"
          type="search"
        />
      </label>

      <button
        type="button"
        //   onClick={() =>
        //     setSortDirection((currentDirection) =>
        //       currentDirection === 'newest' ? 'oldest' : 'newest',
        //     )
        //   }
        className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-full border border-black/10 bg-white px-4 text-sm font-medium shadow-[0_1px_0_rgba(0,0,0,0.03)] transition hover:border-black/20 hover:bg-white/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ee5a2f]/40"
        //   aria-label={`Sort by ${sortDirection === 'newest' ? 'oldest' : 'newest'} first`}
      >
        <ArrowDownUp className="size-4 text-black/45" aria-hidden="true" />
        Newest first
        {/* {sortDirection === 'newest' ? 'Newest first' : 'Oldest first'} */}
      </button>
    </div>
  );
}

export default PostsToolbar;
