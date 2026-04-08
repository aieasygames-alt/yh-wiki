import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-24 text-center">
      <h1 className="text-6xl font-bold text-gray-700 mb-4">404</h1>
      <p className="text-xl text-gray-400 mb-2">页面未找到</p>
      <p className="text-sm text-gray-500 mb-8">Page Not Found</p>
      <Link
        href="/zh"
        className="inline-block px-6 py-2.5 bg-primary-600 hover:bg-primary-500 text-white rounded-lg font-medium transition-colors"
      >
        返回首页
      </Link>
    </div>
  );
}
