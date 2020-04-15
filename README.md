# sagyoipu

![Screenshot](https://user-images.githubusercontent.com/1413408/79339945-9dda2d80-7f64-11ea-8ea2-65dd7745e276.png)

## sagyoipu-client

Web UI を持つフロントエンドアプリケーション。Firestore から Zoom ミーティングの状態を取得して表示している。

### Setup

```sh
yarn install
yarn run dev
```

## functions

HTTP トリガで Zoom からの Webhook を受け取り、Firestore のデータを更新する Cloud Function。

### Setup

```sh
yarn install
```

### Deploy

```sh
firebase deploy --only functions
```

## プロジェクトの初期セットアップ

やったことのメモ

### 1. Zoom アプリの作成

https://marketplace.zoom.us/docs/guides/getting-started/app-types/create-jwt-app に従い Zoom アプリを作成し、App Credentials を発行する。

また https://marketplace.zoom.us/docs/guides/getting-started/app-types/create-jwt-app#features に従い Webhook の登録をする必要がある。

- Participant/Host joined meeting
- Participant/Host left meeting

のイベントを選択し、`Event notification endpoint URL` にはデプロイした Cloud Functions の URL を指定する。

Webhook イベントは全てのミーティングに関するイベントが飛んでくるので、Cloud Function 側でさぎょイプに登録したミーティング ID に関するイベントかどうかを見てハンドリングしている。

### 2. Zoom ミーティングの用意

App Credentials を使って Zoom API を叩き、

- さぎょイプで用意する Zoom ミーティングの数だけライセンスユーザーを作成
- ライセンスユーザーをホストにした Zoom ミーティングを作成

する。Zoom の仕様で一人のユーザーは同時に複数の進行中ミーティングのホストになれないため、一人のユーザーに対して一つのミーティングにする必要がある。

<details>
<summary>作成手順の詳細</summary>

----

cURL で API リクエストを叩くのはちょっと大変なので https://github.com/hintmedia/zoom_rb を使うと楽。

```ruby
require 'zoom'
Zoom.configure do |config|
  config.api_key = '***'
  config.api_secret = '***'
end
client = Zoom.new
```

#### ユーザー作成

`custCreate` は ID/Password でログインできないユーザーを作るオプション。ドキュメントにはこのオプションを使うなら問い合わせてくれって書いてあるけど、実は普通に使えて、[フォーラム](https://devforum.zoom.us/t/custcreate-available-to-pro-accounts-now/6831/3)を見るとドキュメントが古いことがわかる。

```ruby
client.user_create(
  action: 'custCreate',
  first_name: 'Sagyoipu',
  last_name: 'Host',
  email: "sagyoipu-host@example.com",
  type: 2
)
```

#### ミーティング作成

`start_time` は現在時刻より前ならいつでも。

```ruby
c.meeting_create({
  topic:'さぎょイプ',
  type: 2,
  user_id: '<上で作ったユーザーのID>',
  settings: {
    joine_before_host: true
  },
  start_time: '2020-03-16T10:00:00Z'
})
```

このユーザー作成とミーティング作成を部屋の数だけ行い、作成したミーティングの ID (数字) を下記の手順で `functions:config:set` する。

----

</details>

### 3. Firebase プロジェクトの作成

Firebase の Web コンソールからポチポチとプロジェクトを作成する。Zoom の Webhook はたくさん飛んできて無料プランだと Cloud Functinos の Rate Limit に引っかかってしまうため、Blaze プランにアップグレードしておくと良い。おそらく無料枠に収まるはず。

また、さぎょイプで利用する Zoom ミーティングの ID を `functions:config:set` する必要がある。

設定の例

```sh
firebase functions:config:set \
  meeting_ids.0="12345678" \
  meeting_ids.1="23456789" \
  meeting_ids.2="34567890"
```

