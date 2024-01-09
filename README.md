## アプリケーションの概要

各々のユーザーのタスク（予定）、アルバム写真を作成して管理するアプリケーションです．
ユーザー同士で友達申請を送り、友達となり、指定したタスクとアルバム写真を共有することができます．

## 利用している技術

NestJS、GraphQL、Prisma(MySQL)、Typescript、Google Cloud Storage

## 最初に

```bash
$ npm install
```
## アプリの起動

まずGoogle Cloud Storageより、サービスアカウントを作成し、ロールをストレージ管理者に設定し、json keyを作成．
そのjsonファイルを本アプリケーションのルートディレクトリに配置．

次にアプリケーションのルートディレクトリに以下のようなenvファイルの作成をいたします．各自の環境に合わせて、書いていきます．
```
例
DATABASE_URL="mysql://janedoe:mypassword@localhost:3306/mydb"

MYSQL_ROOT_PASSWORD=rootpassword
MYSQL_USER=username
MYSQL_PASSWORD=password
MYSQL_DATABASE=db

JWT_SECRET="secret"

GOOGLE_APPLICATION_CREDENTIALS=sample.json #GCSから取得したjsonファイルの名前
GCLOUD_PROJECT_ID=project id #GCPのプロジェクトID
GCLOUD_STORAGE_BUCKET=bucket name #バケット名

GOOGLE_CLIENT_ID=client id
GOOGLE_SECRET=secret
GOOGLE_AUTH_CALLBACKURL_URL=url
```

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## テスト

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

<!-- ## GraphQLでの実行

GraphQLの実行では、Altairで実行することをおすすめいたします．
理由としましては、ファイル、画像の使用が可能なためです．

Altair:
https://altairgraphql.dev/ -->