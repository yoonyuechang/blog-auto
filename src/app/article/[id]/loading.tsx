import Skeleton from "@/components/shared/Skeleton";

export default function ArticleLoading() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12">
      <div className="mb-4 flex gap-2">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-3 w-12" />
      </div>
      <Skeleton className="mb-3 h-8 w-3/4" />
      <Skeleton className="mb-6 h-5 w-1/2" />
      <Skeleton className="mb-8 h-24 w-full rounded-xl" />
      <div className="space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    </article>
  );
}
