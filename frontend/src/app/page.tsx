import Link from "next/link";

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <h1 className="text-4xl font-bold mb-6">Global Village Life</h1>
      <p className="text-lg text-gray-600 mb-8">寮生活をより快適に、よりスマートに。</p>
      <div className="flex gap-4">
        <Link href="/login" className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700">
          ログイン
        </Link>
        <Link href="/register" className="px-6 py-3 bg-white text-blue-600 border border-blue-600 rounded hover:bg-gray-50">
          新規会員登録
        </Link>
      </div>
    </div>
  )
};

export default Home