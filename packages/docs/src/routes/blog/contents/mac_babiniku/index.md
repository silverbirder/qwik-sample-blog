---
title: Mac で バ美肉 りたい！  (Zoom + Gachikoe + 3Tene or Reality)
published: true
date: 2020-03-08
description: きっかけ みなさん、リモートワーク（テレワーク）してますか？Hangouts MeetやZoomといったビデオ会議ツールを使う機会が増えたと思います。そんな中、次の記事が流行りました。 バ美肉（バびにく）とは、バーチャル美少女受肉またはバーチャル美少女セルフ受肉の略語
tags: ["Mac", "Virtual Girl", "Zoom", "Gachikoe", "3Tene", "Reality"]
cover_image: https://res.cloudinary.com/silverbirder/image/upload/v1614412301/silver-birder.github.io/blog/バ美肉.png
socialMediaImage: https://res.cloudinary.com/silverbirder/image/upload/v1614412301/silver-birder.github.io/blog/バ美肉.png
---

# きっかけ

みなさん、リモートワーク（テレワーク）してますか？
Hangouts Meet や Zoom といったビデオ会議ツールを使う機会が増えたと思います。

そんな中、次の記事が流行りました。

https://level69.net/archives/26902

> バ美肉（バびにく）とは、バーチャル美少女受肉またはバーチャル美少女セルフ受肉の略語

> https://ja.wikipedia.org/wiki/バ美肉

これにより、ビデオ会議(例は Zoom)で、次のようなバーチャル美少女 (になりきった私)が参加できるようになります。もちろん、声もボイスチェンジできます。

<figure title="バーチャル美少女 (私)">
<img alt="バーチャル美少女 (私)" src="https://res.cloudinary.com/silverbirder/image/upload/v1614428127/silver-birder.github.io/blog/virtual_beautiful_girl_me.png" />
<figcaption>バーチャル美少女 (私)</figcaption>
</figure>

<figure title="Whiteboard in Zoom">
<img alt="Whiteboard in Zoom" src="https://res.cloudinary.com/silverbirder/image/upload/v1614428171/silver-birder.github.io/blog/whiteboard_in_zoom.png" />
<figcaption>Whiteboard in Zoom</figcaption>
</figure>

Windows では、[Facerig](https://store.steampowered.com/app/274920/FaceRig/?l=japanese)というアプリで簡単に構築できるみたいです。

これを Mac で構築する方法を紹介しようと思います。
Mac + Bootcamp → Windows10 + Facering でもできると思いますが、動作不安定になる可能性があったため、極力避けようと思い、却下しました。

# 構成

私は、次のような構成になりました。

<figure title="バ美肉's structure">
<img alt="バ美肉's structure" src="https://res.cloudinary.com/silverbirder/image/upload/v1614428221/silver-birder.github.io/blog/virtual_beautiful_girl_structure.png" />
<figcaption>バ美肉's structure</figcaption>
</figure>

音声と動画の 2 つに分かれます。
また、ビデオ会議ツールと連携するため、仮想デバイス(Soundflower, CamTwist)が必要になります。

# 音声

## Voice Changer: Gachikoe

野太い声じゃなくて、かわいい声が聞きたいですよね。そうですよね。はい。

[Gachikoe](https://booth.pm/ja/items/1236505)を使いました。

Gachikoe は、次のような設定にしました。

<figure title="Gachikoe">
<img alt="Gachikoe" src="https://res.cloudinary.com/silverbirder/image/upload/v1614428254/silver-birder.github.io/blog/gachikoe.png" />
<figcaption>Gachikoe</figcaption>
</figure>

<figure title="Gachikoe settings">
<img alt="Gachikoe settings" src="https://res.cloudinary.com/silverbirder/image/upload/v1614428287/silver-birder.github.io/blog/gachikoe_settings.png" />
<figcaption>Gachikoe settings</figcaption>
</figure>

Output を soundflower (2ch)にしています。

## 仮想マイク

仮想マイクは、Soundflower を使います。
https://github.com/mattingalls/Soundflower/tags

音声出力のルーティングを制御するために、LadioCast も使いました。
https://apps.apple.com/jp/app/ladiocast/id411213048?mt=12

LadioCast は、次のような設定にしました。

<figure title="LadioCast">
<img alt="LadioCast" src="https://res.cloudinary.com/silverbirder/image/upload/v1614428329/silver-birder.github.io/blog/ladio_cast.png" />
<figcaption>LadioCast</figcaption>
</figure>

Input を soundflower (2ch)とし、Output を soundflower (64ch)としています。

# 動画

## Application for VTuber

### Desktop: 3tene

デスクトップで動かす場合は、3tene(ミテネ)を使いました。

https://3tene.com/

3tene は、特に設定は必要ありません。
撮影前には、Web カメラとリップシンク(口の動きの同期)を起動しておきましょう。

<figure title="3tene">
<img alt="3tene" src="https://res.cloudinary.com/silverbirder/image/upload/v1614428380/silver-birder.github.io/blog/3tene.png" />
<figcaption>3tene</figcaption>
</figure>

#### Asserts

肝心のキャラクターですが、3tene は VRM 形式でなければならないそうです。(よくわかっていません)  
私は、次のサイトでダウンロードしました。

https://hub.vroid.com/

https://3d.nicovideo.jp/

### Mobile: Reality

モバイルで動かす場合は、Reality を使いました。

https://apps.apple.com/jp/app/reality-%E3%83%90%E3%83%BC%E3%83%81%E3%83%A3%E3%83%AB%E3%83%A9%E3%82%A4%E3%83%96%E9%85%8D%E4%BF%A1%E3%82%A2%E3%83%97%E3%83%AA/id1404176564

Reality は、特に設定は必要ありません。
好みのキャラクターをカスタマイズして簡単に作れます。

私は、これです。

<figure title="reality me">
<img alt="reality me" src="https://res.cloudinary.com/silverbirder/image/upload/v1614428417/silver-birder.github.io/blog/reality_me.jpg" />
<figcaption><a href="https://reality.wrightflyer.net/profile/443e9213">reality me</a></figcaption>
</figure>

iPhone で撮影している画面を Mac に反映する必要があります。
Mac と iPhone を接続し、QuickTime Player へ出力します。こんな感じです。

<figure title="iPhone To QuickTime Player">
<img alt="iPhone To QuickTime Player" src="https://res.cloudinary.com/silverbirder/image/upload/v1614428459/silver-birder.github.io/blog/iPhone_to_quick_time_player.png" />
<figcaption>iPhone To QuickTime Player</figcaption>
</figure>

none は、私の iPhone デバイス名です。

## 仮想カメラ

CamTwist という仮想カメラを使いました。
http://camtwiststudio.com/download/

CamTwist は、次のような設定にしました。

<figure title="CamTwist">
<img alt="CamTwist" src="https://res.cloudinary.com/silverbirder/image/upload/v1614428498/silver-birder.github.io/blog/cam_twist.png" />
<figcaption>CamTwist</figcaption>
</figure>

例では、QuickTime Player のアプリケーションを選択しています。3tene の場合は、3tene の選択肢を選択すれば良いです。

# 使い方 (Zoom)

今まで説明したものを起動した状態で、Zoom を起動します。
Zoom は、次のような設定にしました。

<figure title="Zoom > Settings > Video">
<img alt="Zoom > Settings > Video" src="https://res.cloudinary.com/silverbirder/image/upload/v1614428582/silver-birder.github.io/blog/zoom_settings_video.png" />
<figcaption>Zoom > Settings > Video</figcaption>
</figure>

動画は、CamTwist から取得するようにします。

<figure title="Zoom > Settings > Audio">
<img alt="Zoom > Settings > Audio" src="https://res.cloudinary.com/silverbirder/image/upload/v1614428625/silver-birder.github.io/blog/zoom_settings_audio.png" />
<figcaption>Zoom > Settings > Audio</figcaption>
</figure>

音声は、Soundeflower (64ch)から取得するようにします。

これで、<b>Mac で バ美肉 することができました！</b>

# 終わりに

テレビ会議で、こういった "リアルな姿を出さず、異なる人物を出す" のは、実際役立つものなのでしょうか。
テレビ会議ツール、例えば Zoom では、音声や動画を隠せる機能はあります。
"リアルな姿を隠したい"要求は、すでに解決できています。

今回のような"バ美肉"って、どういうメリットがあるのか、んーってなりました。
ネタ的には『可愛い女の子と会話すると、生産性があがる』なのですが...脳が震える。

# 参考リンク

https://kumak1.hatenablog.com/entry/2018/09/27/234203

http://kuroyam.hatenablog.com/entry/2020/02/27/204246

https://mzyy94.com/blog/2020/02/25/virtual-bishoujo-meeting/

https://www.excite.co.jp/news/article/MoguraVR_voice-changer-pickup5/

https://www.cg-method.com/entry/gachikoe/#Gachikoe

https://vtuberkaibougaku.site/2019/01/31/post-3176/
