import { APP_ROUTES } from '@/lib/app-routes';
import { FileText, Plus } from 'lucide-react';
import Link from 'next/link';

export default function EmptyPosts() {
  return (
    <div className="rounded-2xl border border-dashed border-black/15 bg-white/60 px-6 py-16 text-center">
      <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-[#ffede7] text-[#d94a24]">
        <FileText className="size-5" aria-hidden="true" />
      </span>
      <h2 className="mt-5 text-lg font-semibold tracking-[-0.02em]">This space is wide open</h2>
      <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-black/50">
        Be the first to start a conversation and give the community something to talk about.
      </p>
      <Link
        href={APP_ROUTES.POST.CREATE}
        className="mt-6 inline-flex h-9 items-center gap-2 rounded-full bg-[#20211f] px-4 text-xs font-semibold text-white transition hover:-translate-y-0.5 hover:bg-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ee5a2f]/50"
      >
        <Plus className="size-4" aria-hidden="true" />
        Create the first post
      </Link>
    </div>
  );
}
