# Global Village Life — Frontend

寮生活向け情報共有アプリのNext.jsフロントエンドです。制作背景、画面例、開発状況、バックエンドを含む起動手順は[ルートREADME](../README.md)を参照してください。現在は開発中断・公開停止中で、ローカルデモで動作を確認できます。

## 起動

Node.js 22・npmを使用します。まず[バックエンドのデモ](../README.md#1-バックエンドを起動する)を `localhost:8000` で起動してください。

```bash
cd frontend
npm ci
cp .env.example .env.local
npm run dev -- --hostname 127.0.0.1
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開きます。`src/constants/MockData.ts` は残っていますが、主要画面は実APIを呼び出すため、フロントだけではログイン後のデモはできません。

### 環境変数

| 変数 | 設定例 | 用途 |
| --- | --- | --- |
| `NEXT_PUBLIC_API_URL` | `http://localhost:8000` | Django APIのベースURL |

コード側で `/api/...` を連結します。値に `/api` や末尾の `/` は付けません。この変数はブラウザに公開されるため、認証情報は入れないでください。変更後は開発サーバーを再起動し、本番ビルドで使用する場合は再ビルドしてください。

`.env.local` はGit管理対象外、設定例の `.env.example` は管理対象です。旧クラウドのURLは現在利用しません。

### コマンド

| コマンド | 内容 |
| --- | --- |
| `npm ci` | ロックファイルに従って依存関係を導入 |
| `npm run dev` | 開発サーバー起動 |
| `npm run build` | Next.jsの標準ビルド |
| `npm run build -- --webpack` | 今回検証したWebpackによる本番ビルド |
| `npm run start -- --hostname 127.0.0.1` | ビルド済みアプリをローカル起動 |
| `npm run lint` | ESLint。既存の警告は残っています |
| `npx tsc --noEmit` | TypeScriptの型チェック |

`next/font/google` を使用しているため、初回開発起動・ビルドではGoogle Fonts取得にネット接続が必要です。

## 画面とルーティング

| URL | 画面 |
| --- | --- |
| `/` | アプリの入口、ログイン／登録へのリンク |
| `/login` | メールアドレスとパスワードによるログイン |
| `/register` | ユーザー登録、部屋番号・入退寮年月・任意のアイコン入力 |
| `/register/success` | 登録後の案内 |
| `/activate/[uid]/[token]` | アカウント有効化 |
| `/password/reset` | パスワード再設定メールの要求 |
| `/password/reset/confirm/[uid]/[token]` | 新しいパスワードの設定 |
| `/dashboard` | お知らせ一覧・詳細、管理者の編集／削除 |
| `/dashboard/event` | イベントのカレンダー／一覧／詳細 |
| `/dashboard/gallery` | アルバム一覧・外部リンクを開く確認画面 |
| `/dashboard/profile` | プロフィール表示・編集、ログアウト、アカウント削除 |

ダッシュボード共通の右下ボタンから、管理者が、お知らせ・イベント・アルバムを作成します。

## コードの配置

```text
src/
  app/
    layout.tsx                  フォント、通知トースト
    globals.css                 共通スタイル
    login/ register/ activate/  認証関連画面
    password/reset/             パスワード再設定
    dashboard/
      layout.tsx                UserProvider、下部ナビ、管理者投稿ボタン
      page.tsx                  お知らせ一覧
      event/ gallery/ profile/  各機能の画面
      types.ts                  APIレスポンスに対応する型
      components/
        events/                 カレンダー、カード、詳細モーダル
        profile/                プロフィール、編集、操作確認
        modals/                 お知らせ・イベント・アルバムの作成
  contexts/UserContext.tsx      ログインユーザー情報の取得・共有
  middleware.ts                 Cookieの存在による画面のアクセス制御
  constants/MockData.ts          現在の主要画面では利用しないモックデータ
```

パスエイリアス `@/*` は `src/*` を指します。状態管理はReactのStateとContext、通信は各画面・モーダル内の `fetch` で行っています。専用のAPIクライアント層やグローバルなトークン更新処理はありません。

## 認証と権限

1. ログイン画面が `/api/auth/jwt/create/` にメールアドレスとパスワードを送信します。
2. 返されたアクセストークンとリフレッシュトークンを `js-cookie` でCookieに保存します。
3. `middleware.ts` が `accessToken` の有無を見て、未ログインのダッシュボードアクセスを `/login` へ戻します。
4. API呼び出し時に `Authorization: Bearer <accessToken>` を送ります。JWTの有効性はバックエンドが検証します。
5. `UserContext` が `/api/accounts/me/` を取得し、`role === 'Admin'` の場合に管理者UIを表示します。書き込みの最終的な権限チェックはAPI側で行います。

CookieはJavaScriptから操作する方式で、HttpOnly Cookieではありません。画面のアクセス制御はトークンの存在確認であり、有効期限の検証ではありません。アクセストークンは60分で期限切れになりますが、自動更新は未実装です。

## 使用する主なAPI

| API | 操作・用途 |
| --- | --- |
| `/api/auth/users/` | POST：登録 |
| `/api/auth/users/activation/` | POST：有効化 |
| `/api/auth/jwt/create/` | POST：ログイン |
| `/api/auth/users/reset_password/` | POST：パスワード再設定の要求 |
| `/api/auth/users/reset_password_confirm/` | POST：パスワードの再設定 |
| `/api/accounts/me/` | GET / PATCH：プロフィールの取得・更新 |
| `/api/accounts/me/deactivate/` | DELETE：アカウント削除 |
| `/api/notices/` | GET / POST：お知らせ一覧・作成 |
| `/api/notices/{id}/` | GET / PATCH / DELETE：詳細・更新・削除 |
| `/api/noticetags/` | GET：お知らせタグ |
| `/api/events/` | GET / POST：イベント一覧・作成 |
| `/api/gallery/` | GET / POST：アルバム一覧・作成 |

一覧レスポンスは `results` 内の配列を使用します。バックエンドは20件単位のページネーションですが、次ページを取得するUIは未実装です。

画像を含む投稿・更新は `FormData` を使います。お知らせ・イベントの画像は最大3枚で、アップロード時の `Content-Type` はブラウザに設定させます。アルバムはカバー画像1枚と共有URLを扱います。

## 動作確認

デモアカウントの詳細は[ルートREADME](../README.md#1-バックエンドを起動する)を参照してください。

1. 未ログインで `/dashboard` を開き、ログイン画面に戻ることを確認。
2. 寮生でログインし、お知らせ、イベント、ギャラリー、プロフィールを確認。
3. イベントの日付選択・リスト切り替え・詳細モーダルを確認。
4. 管理者でログインし、右下の投稿ボタンとタグ選択を確認。
5. デモ環境でお知らせを画像付きで作成し、編集・削除を確認。

[画面撮影スクリプト](../scripts/capture_screenshots.py)は、実APIを使ったログイン、主要画面への遷移、画像読み込み、管理者フォームの表示を確認して撮影します。ブラウザの通信をモックしません。操作全体を網羅するE2Eテストではありません。

## つまずきやすい点

| 症状 | 確認すること |
| --- | --- |
| ログイン・データ取得で通信エラー | Djangoの起動、`.env.local` のURL、設定変更後の再起動 |
| CORSエラー | ブラウザのURLを `http://localhost:3000` に統一。別ポートは既存の許可対象外 |
| しばらくするとAPIが401を返す | トークン期限切れ。Cookieを削除するか、`/login` から再ログイン |
| 投稿ボタンが出ない | アプリ内の `role` が `Admin` か確認。`is_staff` だけでは表示されない |
| お知らせのタグが空 | バックエンドで `LOCAL_DEMO=1 python manage.py seed_demo` を実行 |
| メールが届かない | ローカルデモはコンソール出力。Djangoのターミナルに出るリンクを使用 |
| 画像が出ない | Djangoが起動しているか、デモ画像が生成済みかを確認 |
| フォント取得でビルドに失敗 | Google Fontsへ接続できるネットワークで再実行 |

Next.js 16では既存の `middleware.ts` に非推奨警告が出ます。`proxy.ts` への移行、トークン更新、言語切り替え、ページネーション、アクセシビリティの改善は今後の課題です。
