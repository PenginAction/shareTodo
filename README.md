## アプリケーションの概要

各々のユーザーのタスク（予定）、アルバム写真を作成して管理するアプリケーションです．
ユーザー同士で友達申請を送り、友達となり、指定したタスクとアルバム写真を共有することができます．

## 利用している技術

NestJS、GraphQL、Prisma(MySQL)、Typescript、Google Cloud Storage

## Installation

```bash
$ npm install
```

## アプリの起動

まずGoogle Cloud Storageより、サービスアカウントを作成し、ロールをストレージ管理者に設定し、json keyを作成．
そのjsonファイルを本アプリケーションのルートディレクトリに配置．

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

## GraphQLでの実行

GraphQLの実行では、Altairで実行することをおすすめいたします．
理由としましては、ファイル、画像の使用が可能なためです．