import Link from "next/link";

const RegisterSuccessPage = () => {
    return (
        <div className="p-10 max-w-md mx-auto text-center">
            <h1 className="text-2xl font-bold mb-4">仮登録完了</h1>
            <p className="mb-6">
                入力されたメールアドレスに <br />
                確認メールを送信しました。<br />
                <br />
                メール内のリンクをクリックして、<br />
                アカウントを有効化してください。
            </p>
            <Link href="/login" className="text-blue-600 hover:underline">
                ログイン画面へ戻る
            </Link>
        </div>
    )
};

export default RegisterSuccessPage