---
title: 一足遅れて Kubernetes を学び始める - 12. リソース制限 -
published: true
date: 2019-05-29
description: 前回 一足遅れて Kubernetes を学び始める - 11. config&storage その2 -では、storageについて学習しました。今回は、リソース制限について学習します。
tags: ["Kubernetes", "Story", "Beginner"]
cover_image: https://res.cloudinary.com/silverbirder/image/upload/v1611128736/silver-birder.github.io/assets/logo.png
socialMediaImage: https://res.cloudinary.com/silverbirder/image/upload/v1611128736/silver-birder.github.io/assets/logo.png
---

# ストーリー

1. [一足遅れて Kubernetes を学び始める - 01. 環境選択編 -](../start_the_learning_kubernetes_01/index.md)
1. [一足遅れて Kubernetes を学び始める - 02. Docker For Mac -](../start_the_learning_kubernetes_02/index.md)
1. [一足遅れて Kubernetes を学び始める - 03. Raspberry Pi -](../start_the_learning_kubernetes_03/index.md)
1. [一足遅れて Kubernetes を学び始める - 04. kubectl -](../start_the_learning_kubernetes_04/index.md)
1. [一足遅れて Kubernetes を学び始める - 05. workloads その 1 -](../start_the_learning_kubernetes_05/index.md)
1. [一足遅れて Kubernetes を学び始める - 06. workloads その 2 -](../start_the_learning_kubernetes_06/index.md)
1. [一足遅れて Kubernetes を学び始める - 07. workloads その 3 -](../start_the_learning_kubernetes_07/index.md)
1. [一足遅れて Kubernetes を学び始める - 08. discovery&LB その 1 -](../start_the_learning_kubernetes_08/index.md)
1. [一足遅れて Kubernetes を学び始める - 09. discovery&LB その 2 -](../start_the_learning_kubernetes_09/index.md)
1. [一足遅れて Kubernetes を学び始める - 10. config&storage その 1 -](../start_the_learning_kubernetes_10/index.md)
1. [一足遅れて Kubernetes を学び始める - 11. config&storage その 2 -](../start_the_learning_kubernetes_11/index.md)
1. [一足遅れて Kubernetes を学び始める - 12. リソース制限 -](../start_the_learning_kubernetes_12/index.md)
1. [一足遅れて Kubernetes を学び始める - 13. ヘルスチェックとコンテナライフサイクル -](../start_the_learning_kubernetes_13/index.md)
1. [一足遅れて Kubernetes を学び始める - 14. スケジューリング -](../start_the_learning_kubernetes_14/index.md)
1. [一足遅れて Kubernetes を学び始める - 15. セキュリティ -](../start_the_learning_kubernetes_15/index.md)
1. [一足遅れて Kubernetes を学び始める - 16. コンポーネント -](../start_the_learning_kubernetes_16/index.md)

# 前回

[一足遅れて Kubernetes を学び始める - 11. config&storage その 2 -](../start_the_learning_kubernetes_11/index.md)では、storage について学習しました。
今回は、リソース制限について学習します。

※ リソースの種類から、次は「Metadata」だったのですが、kubernetes 完全ガイドによると直接説明するのではなく、内容ベースで説明されていましたので、それに準拠します。

# リソース制限

kubernetes で管理するコンテナに対して、リソース制限をかけることができます。主に CPU やメモリに対して制限をかけることができますが、Device Plugins を使うことで GPU にも制限をかけることもできます。

※ CPU の指定方法は、1vCPU を 1000millicores(m)とする単位となります。

# requests と limits

request は、使用するリソースの下限値です。
limits は、使用するリソースの上限値です。

request は、空きノードに指定するリソースがなければスケジューリングされませんが、limits は、関係なくスケジューリングされます。

とにもかくにも、試してみましょう。

まず、現状確認です。

```shell
pi@raspi001:~/tmp $ k get node
NAME       STATUS   ROLES    AGE   VERSION
raspi001   Ready    master   31d   v1.14.1
raspi002   Ready    worker   31d   v1.14.1
raspi003   Ready    worker   30d   v1.14.1
pi@raspi001:~/tmp $ k get nodes -o jsonpath='{.items[?(@.metadata.name!="raspi001")].status.allocatable.memory}'
847048Ki 847048Ki
pi@raspi001:~/tmp $ k get nodes -o jsonpath='{.items[?(@.metadata.name!="raspi001")].status.allocatable.cpu}'
4 4
pi@raspi001:~/tmp $ k get nodes -o jsonpath='{.items[?(@.metadata.name!="raspi001")].status.capacity.memory}'
949448Ki 949448Ki
pi@raspi001:~/tmp $ k get nodes -o jsonpath='{.items[?(@.metadata.name!="raspi001")].status.capacity.cpu}'
4 4

```

jsonpath の使い方は、[こちら](https://kubernetes.io/docs/reference/kubectl/jsonpath/)にあります。

allocatable が Pod に配置できるリソース量で、capacity は Node 全体での配置できるリソース量です。
これだけだと、現在使っているリソース量が不明なので個別に調べます。

```shell
pi@raspi001:~/tmp $ k describe node raspi002
...
Allocated resources:
  (Total limits may be over 100 percent, i.e., overcommitted.)
  Resource           Requests     Limits
  --------           --------     ------
  cpu                200m (5%)    200m (5%)
  memory             150Mi (18%)  150Mi (18%)
  ephemeral-storage  0 (0%)       0 (0%)
...
pi@raspi001:~/tmp $ k describe node raspi003
...
Allocated resources:
  (Total limits may be over 100 percent, i.e., overcommitted.)
  Resource           Requests     Limits
  --------           --------     ------
  cpu                400m (10%)   300m (7%)
  memory             320Mi (38%)  420Mi (50%)
  ephemeral-storage  0 (0%)       0 (0%)
...
```

現状のリソース状況を表にすると下記のとおりです。

| node     | allocatable<br />(memory/cpu) | capacity<br />(memory/cpu) | used<br />(memory/cpu) | remain<br />(memory/cpu) |
| -------- | ----------------------------- | -------------------------- | ---------------------- | ------------------------ |
| raspi002 | 847,048Ki/4000m               | 949,448Ki/4000m            | 150,000Ki/200m         | 697,048Ki/3800m          |
| raspi003 | 847,048Ki/4000m               | 949,448Ki/4000m            | 320,000Ki/400m         | 527,048Ki/3600m          |

では、リソース制限を試してみましょう。

```yaml
# sample-resource.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: sample-resource
spec:
  replicas: 3
  selector:
    matchLabels:
      app: sample-app
  template:
    metadata:
      labels:
        app: sample-app
    spec:
      containers:
        - name: nginx-container
          image: nginx:1.12
          resources:
            requests:
              memory: "128Mi"
              cpu: "300m"
            limits:
              memory: "256Mi"
              cpu: "600m"
```

apply する pod で要求する memory の下限合計は 384Mi(128Mi×3),cpu は 900m(300m×3)です。
これだと、pod が run するはずです。

```shell
pi@raspi001:~/tmp $ k apply -f sample-resource.yaml
pi@raspi001:~/tmp $ k get pods
NAME                                      READY   STATUS    RESTARTS   AGE
sample-resource-785cd54844-7n89t          1/1     Running   0          108s
sample-resource-785cd54844-9b5f9          1/1     Running   0          108s
sample-resource-785cd54844-whj7x          1/1     Running   0          108s
```

期待通りですね。
今度はリソース制限になる状態を試してみます。

全 WorkerNode の memory 下限合計は 1,224Mi(697,048Ki+527,048Ki)です。
これを超えるように先程のマニフェストを更新します。
replica 数を 3 にしましたが、10 にすれば良いですね（1,280Mi)

期待動作として、9 個(128Mi\*9=1,152Mi)は Running で、1 個(128Mi)は Pending になるはずです。

sample-resource.yaml の replica を 10 に変更したあと ↓

```shell
pi@raspi001:~/tmp $ k apply -f sample-resource.yaml
pi@raspi001:~/tmp $ k get pods
NAME                                      READY   STATUS    RESTARTS   AGE
sample-resource-785cd54844-7n89t          1/1     Running   0          6m19s
sample-resource-785cd54844-9b5f9          1/1     Running   0          6m19s
sample-resource-785cd54844-dffsd          1/1     Running   0          61s
sample-resource-785cd54844-jmkv6          1/1     Running   0          61s
sample-resource-785cd54844-k9vcb          1/1     Running   0          61s
sample-resource-785cd54844-l4smf          0/1     Pending   0          60s
sample-resource-785cd54844-n4hl7          1/1     Running   0          60s
sample-resource-785cd54844-th4bp          0/1     Pending   0          60s
sample-resource-785cd54844-whj7x          1/1     Running   0          6m19s
sample-resource-785cd54844-xclsk          1/1     Running   0          60s
```

あれ、2 つ Pending になっていますね。もしかして、Node の空きリソースが中途半端にないからですかね。
確認してみましょう。

```shell
pi@raspi001:~/tmp $ k describe node raspi002
...
Allocated resources:
  (Total limits may be over 100 percent, i.e., overcommitted.)
  Resource           Requests     Limits
  --------           --------     ------
  cpu                1700m (42%)  3200m (80%)
  memory             790Mi (95%)  1430Mi (172%)
  ephemeral-storage  0 (0%)       0 (0%)
...
pi@raspi001:~/tmp $ k describe node raspi003
...
Allocated resources:
  (Total limits may be over 100 percent, i.e., overcommitted.)
  Resource           Requests     Limits
  --------           --------     ------
  cpu                1300m (32%)  2100m (52%)
  memory             704Mi (85%)  1188Mi (143%)
  ephemeral-storage  0 (0%)       0 (0%)
...
```

raspi002 は、847Mi 中 790Mi 使っています。１つの Pod を追加するためのリソース（128Mi）はないですね。
raspi003 は、847Mi 中 704Mi 使っています。こちらは空いている気がするのですが、なぜでしょうか。

ここで、memory の`704Mi (85%) `というところに着目すると、100%だった場合は 828Mi ということになります。
確かに、それだと 704Mi+128Mi=832Mi でオーバーしています。

では、allocatable で表示されていた 847Mi との違いは何でしょうか。
allocatable というのは、全ての namespace にある pod も込みのリソース配置可能量だからです。
default だけでなく、kube-system など他の namespace にある pod も、もちろんリソースを消費しています。
828Mi というのは、default で使えるリソース配置可能量ではないでしょうか。（現在の namespace は default)

ちなみに、Limits は、100%を超えていますね...。ひぇ〜...。

# Cluster Autoscaler

需要に応じて Kubernetes Node を自動的に追加されていく機能です。
これが動作するタイミングは、Pod が Pending になったときに動作します。
つまり、先程の例であったように、requests の下限によってスケールします。

そのため、requests が高すぎるために、実際はロードアベレージが低くてもスケールしてしまったり、
requests が低すぎるために、実際は高負荷でもスケールしなくなったりします。
requests は、パフォーマンステストをしつつ最適化していきましょう。

# LimitRange

さっきの例でもあったように、それぞれに対して requests,limit を設定しても良いのですが、
もっと便利なものがあります。それが LimitRange です。
これは、Namespace に対して CPU やメモリのリソースの最小値や最大値を設定できます。
設定可能な制限項目として、下記があります。

- default
  - デフォルトの Limits
- defaultRequest
  - デフォルトの Requests
- max
  - 最大リソース
- min
  - 最小リソース
- maxLimitRequestRatio
  - Limits/Requests の割合

また、制限する対象は、Container,Pod,PersistentVolumeClaim があります。
実運用する際は、きちんと定義しておきましょう。（プロバイダーによってはデフォルトで設定されているものもあるそうです）

# ResourceQuota

ResourceQuota を使うことで、Namespace ごとに「作成可能なリソース数の制限」と「リソース使用量の制限」ができます。
「作成可能なリソース数の制限」を試そうと思います。

```yaml
# sample-resourcequota.yaml
apiVersion: v1
kind: ResourceQuota
metadata:
  name: sample-resourcequota
  namespace: default
spec:
  hard:
    # 作成可能なリソースの数
    count/pods: 5
```

```shell
pi@raspi001:~/tmp $ k delete -f sample-resource.yaml
pi@raspi001:~/tmp $ k apply -f sample-resourcequota.yaml
pi@raspi001:~/tmp $ k apply -f sample-resource.yaml
pi@raspi001:~/tmp $ k get pods
NAME                                      READY   STATUS    RESTARTS   AGE
sample-resource-785cd54844-dll8t          1/1     Running   0          38s
sample-resource-785cd54844-ljr7q          1/1     Running   0          39s
sample-resource-785cd54844-r6txh          1/1     Running   0          38s
sample-resource-785cd54844-sb6sq          1/1     Running   0          38s
sample-resource-785cd54844-3ffeg          1/1     Running   0          38s
```

こうすると、pods が 5 個までしか作成できないので、sample-resource.yaml を適用しても 5 個までしか作成されません。
replica のような場合は、特に警告がなく単純に作られませんでした。
configmap を 5 個までに制限して、1 つずつ configmap を apply すると、警告がでるそうです。

# HorizontalPodAutoscaler(HPA)

HPA は、Deployment,ReplicaSet で管理する Pod の CPU 負荷などに応じて自動的にスケールするリソースです。
30 秒に１回の頻度でスケールするかチェックしています。

必要なレプリカ数は、下記の数式で表します。

- 必要なレプリカ数 = ceil(sum(Pod の現在の CPU 使用率)/targetAverageUtilization)

[Kubernetes の Pod と Node の Auto Scaling について](https://qiita.com/sheepland/items/37ea0b77df9a4b4c9d80)で、

> auto scaling は target value に近づくように pod 数が調整されるということ。

という文がわかりやすかったです。つまり、targetAverageUtilization が 50 なら、全体の CPU 使用率が 50%になるよう調整されます。
今回、試そうと考えたのですが、metrics-server を install していないため、動作確認できませんでした。
また今度 install して試してみようと思います。

# VerticalPodAutoscaler(VPA)

VPA は、コンテナに割り当てる CPU やメモリのリソース割当をスケールさせるリソースです。
これは、HPA のスケールアウトではなく、Pod のスケールアップを行うものです。

# お片付け

```shell
pi@raspi001:~/tmp $ k delete -f sample-resource.yaml -f sample-resourcequota.yaml
```

# 最後に

今回は、Requests や Limits を操作してリソース制限をしてみました。
どれがいくらリソースを消費しているのか確認する術を学び、
ついでに jsonpath の使い方も知りました。
次回は、[こちら](../start_the_learning_kubernetes_13/index.md)です。
