import Link from "next/link";

export default function ADNotFound() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center justify-center px-4 py-24 text-center">
      <h1 className="mb-2 text-6xl font-bold text-gray-700">404</h1>
      <p className="mb-6 text-lg text-gray-400">This Anime Destiny page doesn&apos;t exist.</p>
      <Link
        href="/en/anime-destiny"
        className="rounded-lg bg-purple-600 px-6 py-3 font-medium text-white transition-colors hover:bg-purple-700"
      >
        Back to Anime Destiny Wiki
      </Link>
    </div>
  );
}
