# ベースイメージを指定
FROM node

# node.js の環境変数を定義する
# 本番環境では production
ENV NODE_ENV=development

# ディレクトリを移動する
WORKDIR /usr/app

RUN apt-get update && apt-get install -y zip && apt-get clean \
 && rm -rf /var/lib/apt/lists/*
# 雛形を生成するのに必要なパッケージのインストール
#RUN npm install whois-parsed-v2

# ポート3000番を開放する
EXPOSE 3000
