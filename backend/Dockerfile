# 1. Pythonの公式イメージを使う（軽量版）
FROM python:3.11-slim

# 2. コンテナ内の作業フォルダを設定
WORKDIR /app

# 3. 必要なライブラリをインストールするための準備
# システム依存のライブラリを入れておく（Postgres接続などで必要になることが多い）
RUN apt-get update && apt-get install -y \
    libpq-dev \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# 4. requirements.txt をコピーしてインストール
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 5. gunicornが入っていない場合に備えて念のためインストール
RUN pip install gunicorn

# 6. アプリのコードを全てコピー
COPY . .

# 7. Cloud Runはポート8080で待機するルールがある
ENV PORT 8080

# 8. 起動コマンド（Railwayの時と同じ）
CMD exec gunicorn config.wsgi:application --bind 0.0.0.0:$PORT