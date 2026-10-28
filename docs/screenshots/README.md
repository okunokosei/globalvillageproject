# スクリーンショットの撮影

このディレクトリのPNGは、実際のアプリをローカルで動かして撮影したものです。架空のデータとデモ用の幾何学図案を使用しています。寮の実際の人物・部屋・イベント・写真は含みません。

## 条件

- 画面：390 × 844 CSSピクセル、device scale factor 2（PNGは780 × 1688）
- ブラウザ：Playwright経由のGoogle Chrome、`ja-JP` / `Asia/Tokyo`
- 撮影用の基準日：2026-10-28（ブラウザの日付とデモイベントの日付を一致させる）
- アプリ：Next.js本番ビルド（Webpack）とDjangoのローカルデモAPI
- データ：`seed_demo` で生成。ネットワークレスポンスの差し替えはしない
- 撮影後の画像加工：なし

## 再撮影

[ルートREADME](../../README.md)の手順で依存関係を導入後、バックエンドを起動します。

```bash
source .venv/bin/activate
cd backend
export LOCAL_DEMO=1
python manage.py migrate
python manage.py seed_demo --date 2026-10-28
python manage.py runserver 127.0.0.1:8000
```

別のターミナルでフロントエンドを本番ビルドして起動します。開発時のインジケーターが写り込まないように本番ビルドを使います。

```bash
cd frontend
cp .env.example .env.local
npm ci
npm run build -- --webpack
npm run start -- --hostname 127.0.0.1
```

さらに別のターミナルで、リポジトリのルートから撮影します。

```bash
source .venv/bin/activate
python -m pip install -r scripts/requirements-screenshots.txt
python -m playwright install chromium
python scripts/capture_screenshots.py --date 2026-10-28
```

Google Chromeがインストール済みなら、Chromiumの追加ダウンロードを省略し、最後のコマンドに `--chrome` を付けて実行できます。撮影用ブラウザは新規コンテキストで動作し、普段のブラウザのログイン状態を使用しません。

日付を変更する場合は、`seed_demo` と撮影スクリプトの両方に同じ `--date` を渡してください。スクリプトは既存の6枚のPNGを上書きします。普段のデモに戻すときは `seed_demo` を日付指定なしで再実行すると、その日を基準にイベントを生成します。

## 出力

| ファイル | 内容 |
| --- | --- |
| `home.png` | 寮生向けのお知らせ一覧 |
| `events.png` | イベントカレンダーと当日のイベント |
| `event-detail.png` | イベント詳細モーダル |
| `gallery.png` | アルバム一覧 |
| `profile.png` | 架空の寮生のプロフィール |
| `admin-notice.png` | 管理者のお知らせ作成フォーム |

スクリプトでは、未ログイン時のリダイレクト、2種類のアカウントでのログイン、主要画面の内容、画像読み込み、管理者フォームのタグ表示、ブラウザ内の未処理例外がないことを確認します。登録メール・パスワード再設定・外部サービスとの連携まで網羅したテストではありません。
