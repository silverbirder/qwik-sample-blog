---
title: 一足遅れて Kubernetes を学び始める - 06. workloads その2 -
published: true
date: 2019-05-05
description: 前回 一足遅れて Kubernetes を学び始める - 05. workloads その1 -では、Pod,ReplicaSet,Deploymentの３つを学習しました。今回はDaemonSet,StatefulSet(一部)を学びます。
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

[一足遅れて Kubernetes を学び始める - 05. workloads その 1 -](../start_the_learning_kubernetes_05/index.md)では、Pod,ReplicaSet,Deployment の３つを学習しました。今回は DaemonSet,StatefulSet(一部)を学びます。

# DaemonSet

ReplicaSet とほぼ同じ機能のリソース。
ReplicaSet との違いは、各ノードに 1 つずつ配置するのが DaemonSet,バラバラなのが ReplicaSet。
用途として、モニタリングツールやログ収集の Pod に使うそうです。

さっそく、試してみます。

```yaml
# sample-ds.yaml
apiVersion: apps/v1
kind: DaemonSet
metadata:
  name: sample-ds
spec:
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
          ports:
            - containerPort: 80
```

```shell
pi@raspi001:~/tmp $ k apply -f . --all --prune
daemonset.apps/sample-ds created
pi@raspi001:~/tmp $ k get all -o=wide
NAME                  READY   STATUS    RESTARTS   AGE   IP            NODE       NOMINATED NODE   READINESS GATES
pod/sample-ds-wxzbw   1/1     Running   0          60s   10.244.2.24   raspi003   <none>           <none>
pod/sample-ds-xjjtp   1/1     Running   0          60s   10.244.1.37   raspi002   <none>           <none>

NAME                 TYPE        CLUSTER-IP   EXTERNAL-IP   PORT(S)   AGE    SELECTOR
service/kubernetes   ClusterIP   10.96.0.1    <none>        443/TCP   6d1h   <none>

NAME                       DESIRED   CURRENT   READY   UP-TO-DATE   AVAILABLE   NODE SELECTOR   AGE   CONTAINERS        IMAGES       SELECTOR
daemonset.apps/sample-ds   2         2         2       2            2           <none>          60s   nginx-container   nginx:1.12   app=sample-app
```

ReplicaSet と大きく違いはありません。
また、各ノードに対して pod が作られていることがわかります。

Deployment と似ているアップデート戦略があり、OnDelete と RollingUpdate(デフォルト)があります。前者は、pod を明示的に削除した(`k delete`)際に更新する戦略です。DaemonSet は、死活監視やログ収集に使うので、手動でのタイミングが効く OnDelete が好まれます。後者は、Deployment と同じ動きで、即時更新していく戦略です。

ReplicaSet と似ているようで、機能的には Deployment に近い感じですね。ReplicaSet は pod が削除されたら複製されますけど、アップデートされません。DaemonSet は pod が削除されたら複製するし、アップデートもされます。試してみます。

```yaml
# sample-ds.yaml
apiVersion: apps/v1
kind: DaemonSet
metadata:
  name: sample-ds
spec:
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
          image: nginx:1.13
          ports:
            - containerPort: 80
```

nginx のバージョンを 1.12 から 1.13 に変更しました。

```shell
pi@raspi001:~/tmp $ k apply -f . --all --prune
daemonset.apps/sample-ds configured
pi@raspi001:~/tmp $ k get all -o=wide
NAME                  READY   STATUS              RESTARTS   AGE   IP            NODE       NOMINATED NODE   READINESS GATES
pod/sample-ds-sx4mv   0/1     ContainerCreating   0          5s    <none>        raspi003   <none>           <none>
pod/sample-ds-xjjtp   1/1     Running             0          12m   10.244.1.37   raspi002   <none>           <none>

NAME                 TYPE        CLUSTER-IP   EXTERNAL-IP   PORT(S)   AGE    SELECTOR
service/kubernetes   ClusterIP   10.96.0.1    <none>        443/TCP   6d2h   <none>

NAME                       DESIRED   CURRENT   READY   UP-TO-DATE   AVAILABLE   NODE SELECTOR   AGE   CONTAINERS        IMAGES       SELECTOR
daemonset.apps/sample-ds   2         2         1       1            1           <none>          12m   nginx-container   nginx:1.13   app=sample-app
```

apply してみると、一台ずつ update されています(containerCreating)。Deployment と違うのは、最大 pod 数が１のために、一時的に pod が機能しなくなるタイミングが生まれます(超過分の設定不可)。

```shell
pi@raspi001:~/tmp $ k delete pod sample-ds-sx4mv
pod "sample-ds-sx4mv" deleted
pi@raspi001:~/tmp $ k get all -o=wide
NAME                  READY   STATUS              RESTARTS   AGE     IP            NODE       NOMINATED NODE   READINESS GATES
pod/sample-ds-hgvtv   0/1     ContainerCreating   0          6s      <none>        raspi003   <none>           <none>
pod/sample-ds-k8cfx   1/1     Running             0          4m38s   10.244.1.38   raspi002   <none>           <none>

NAME                 TYPE        CLUSTER-IP   EXTERNAL-IP   PORT(S)   AGE    SELECTOR
service/kubernetes   ClusterIP   10.96.0.1    <none>        443/TCP   6d2h   <none>

NAME                       DESIRED   CURRENT   READY   UP-TO-DATE   AVAILABLE   NODE SELECTOR   AGE   CONTAINERS        IMAGES       SELECTOR
daemonset.apps/sample-ds   2         2         1       2            1           <none>          17m   nginx-container   nginx:1.13   app=sample-app
```

pod を削除しても、セルフヒーリングで復活します。

# StatefulSet

ステートレスな pod ではなく、DB のようなステートフルな pod 向けのリソース。
pod を削除しても、データを永続的に保存する仕組みが存在。
動作自体は、replicaSet と似ています。

さっそく、試してみます。

```yaml
# sample-statefulset.yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: sample-statefulset
spec:
  serviceName: sample-statefulset
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
          ports:
            - containerPort: 80
          volumeMounts:
            - name: www
              mountPath: /usr/share/nginx/html
  volumeClaimTemplates:
    - metadata:
        name: www
      spec:
        accessModes:
          - ReadWriteOnce
        resources:
          requests:
            storage: 1G
```

mountPath で指定したマウントしたいパスを、volumeClaimTemplates でマウントしてくれます。 どこに？
Storage に関しては別で学習することにします。
ひとまず、apply します。

```shell
pi@raspi001:~/tmp $ k apply -f . --all --prune
daemonset.apps/sample-ds unchanged
statefulset.apps/sample-statefulset created
pi@raspi001:~/tmp $ k get pod
NAME                   READY   STATUS    RESTARTS   AGE
sample-ds-hgvtv        1/1     Running   0          54m
sample-ds-k8cfx        1/1     Running   0          58m
sample-statefulset-0   0/1     Pending   0          5m19s
pi@raspi001:~/tmp $ k describe pod sample-statefulset-0
...
Events:
  Type     Reason            Age                  From               Message
  ----     ------            ----                 ----               -------
  Warning  FailedScheduling  70s (x3 over 2m28s)  default-scheduler  pod has unbound immediate PersistentVolumeClaims (repeated 2 times)
```

おや、Pending になってしまいました。 `pod has unbound immediate PersistentVolumeClaims`

## PersistentVolume と PersistentVolumeClaims

PersistentVolume(永続的ボリューム)は、名前の通りで、データを永続的に保存しておく場所のリソースです。
マネージドサービスを利用すると、デフォルトで PresistentVolume が用意されているそうです。
私の環境は、マネージドサービスではなく、自作環境であるので、PresistentVolume を用意する必要があります。

PersistentVolumeClaims(永続的ボリューム要求)は、これも名前の通りで、「PresistentVolume を使わせて」というリソースです。
このリソースで、PresistentVolume の name を指定し、apply することで、初めてマウントができます。
例えば、Pod から PersistentVolumeClaims の名前を指定してあげると、その Pod は Claim した PersistentVolume をマウントすることができます。
volumeClaimTemplates というのは、「わざわざ PersistentVolumeClaims を定義しなくてもテンプレートに沿って書けば Claims できるよ」というものです。

## で、何が問題だったの？

`pod has unbound immediate PersistentVolumeClaims`のとおりで、「PersistentVolume の要求をしたけど、Volume 割当できなかったよ」とのことです。

PersistentVolume(pv)があるのか確認してみます。

```shell
pi@raspi001:~/tmp $ k get pv
No resources found.
```

たしかにないです。PersistentVolume を用意しないといけないのですが、どうしましょう。
解決手段として考えたのは 3 点です。

1. GCP や AWS,Azure のサービスを使う
1. LocalVolume を使う
1. NFS を使う

※ [types-of-persistent-volumes](https://kubernetes.io/docs/concepts/storage/persistent-volumes/#types-of-persistent-volumes)

1 は、書いておいてなんですが、却下です。理由は、せっかく raspberryPi で構築したのでクラウドサービスを利用したくないからです。

2 は、[Kubernetes: Local Volume の検証](https://qiita.com/ysakashita/items/67a452e76260b1211920)の参考にして**試した**のですが、 記事にも書いてあるとおり「Local Volume は他の Pod から共有で利用することができない」ため、statefulset が`replica:1`でなければ動きません。それはそれで動くので学習になり良いのですが、せっかくなら replica の制限なしにしたいです(ReadWriteMany にしたい)。

3 は、もう一台 raspberryPi を用意して、それを NFS と見立てて PersistentVolume にしてみる方法です。

3 を進めようと思います。

## NFS 導入

### サーバ設定

NFS 用の新たな raspberryPi を用意します。設定手順は[こちら](../start_the_learning_kubernetes_03/index.md)を参考にしました。
その後の続きは下記です。

NFS のホスト名は`nfspi`とします。

```shell
~ $ slogin pi@nfspi.local
pi@nfspi:~ $ sudo apt-get install nfs-kernel-server
pi@nfspi:~ $ sudo vim /etc/exports
```

```shell
/home/data/ 192.168.3.0/255.255.255.0(rw,sync,no_subtree_check,fsid=0)
```

意味としては、「指定範囲の IP アドレスからのマウントを許可する」。オプションは、[こちら](https://linuxjm.osdn.jp/html/nfs-utils/man5/exports.5.html)を参照。

| host             | ip           |
| ---------------- | ------------ |
| iMac             | 192.168.3.3  |
| raspi001(master) | 192.168.3.32 |
| raspi002(worker) | 192.168.3.33 |
| raspi003(worker) | 192.168.3.34 |
| nfspi(NFS)       | 192.168.3.35 |

```shell
pi@nfspi:~ $ sudo mkdir -p /home/data
pi@nfspi:~ $ sudo chmod 755 /home/data
pi@nfspi:~ $ sudo chown pi:pi /home/data
pi@nfspi:~ $ sudo /etc/init.d/nfs-kernel-server restart
pi@nfspi:~ $ service rpcbind status
pi@nfspi:~ $ systemctl status nfs-server.service
```

正しく設定されたか、iMac から確認してみます。

```shell
~ $ mkdir share
~ $ sudo mount_nfs -P nfspi.local:/home/data ./share/
~ $ sudo umount share
```

OK

### クライアント設定

各ノードに対して下記を実行します。

```shell
pi@raspi001:~ $ sudo apt-get install nfs-common
```

## nfs-client 導入

raspberryPi 環境では、真っ白な状態なので、一から PersistentVolume を用意する必要があります。それには Volume となる Storage の型を用意する必要もあるのですが、[Storage Classes](https://kubernetes.io/docs/concepts/storage/storage-classes/#provisioner)を見る限り、NFS 用の型は標準で存在しません。そこで、[nfs-client](https://github.com/kubernetes-incubator/external-storage/tree/master/nfs-client)を使って NFS 用の StorageClass を作成します。

```shell
pi@raspi001:~ $ git clone https://github.com/kubernetes-incubator/external-storage.git && cd cd external-storage/nfs-client/
pi@raspi001:~/external-storage/nfs-client $ NS=$(kubectl config get-contexts|grep -e "^\*" |awk '{print $5}')
pi@raspi001:~/external-storage/nfs-client $ NAMESPACE=${NS:-default}
pi@raspi001:~/external-storage/nfs-client $ sed -i'' "s/namespace:.*/namespace: $NAMESPACE/g" ./deploy/rbac.yaml
pi@raspi001:~/external-storage/nfs-client $ k apply -f deploy/rbac.yaml
```

rbac.yaml にある namespace を現在動かしている環境の namespace に置換して、apply しています。

```shell
pi@raspi001:~/external-storage/nfs-client $ k apply -f deploy/deployment-arm.yaml
pi@raspi001:~/external-storage/nfs-client $ k apply -f deploy/class.yaml
```

deployment-arm.yaml では、NFS サーバの IP アドレス(192.168.3.35)とマウントパス(/home/data)を設定しました。
class.yaml が、今回欲していた NFS の storageClass(managed-nfs-storage)になります。

※ raspberryPi のイメージは Raspbian を使っているので、arm 用の deployment-arm.yaml を使います。[Wiki](https://ja.wikipedia.org/wiki/Raspbian)
これに随分とハマってしまいました...

```shell
pi@raspi001:~/external-storage/nfs-client $ k apply -f deploy/test-claim.yaml -f deploy/test-pod.yaml
```

試しにマウント先にファイルが作成できているのかテストしています。確認します。

nfspi に移動

```shell
pi@nfspi:~ $ ls /home/data
```

あれば成功です。あれば、下記で片付けます。

```shell
pi@raspi001:~/external-storage/nfs-client $ k delete -f deploy/test-pod.yaml -f deploy/test-claim.yaml
```

## statefulset をリトライ

以上で、StorageClass を用意できました。よって後は、PersistentVolume 作って、PersistentVolumeClaim 作って...となる予定でした。
しかし、[nfs-client](https://github.com/kubernetes-incubator/external-storage/tree/master/nfs-client)には、**dynamic provisioning**という機能が備わっており、PersistentVolume を作らなくても、PersistentVolumeClaim するだけで良くなります。この件については、storage を学習する際に書きます。

raspi001 に移動して、sample-statefulset.yaml をもう一度 apply します。
(storageClassName: managed-nfs-storage を追加, ReadWriteOnce→ReadWriteMany に変更)

```yaml
# sample-statefulset.yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: sample-statefulset
spec:
  serviceName: sample-statefulset
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
          ports:
            - containerPort: 80
          volumeMounts:
            - name: www
              mountPath: /usr/share/nginx/html
  volumeClaimTemplates:
    - metadata:
        name: www
      spec:
        accessModes:
          - ReadWriteMany
        storageClassName: managed-nfs-storage
        resources:
          requests:
            storage: 1Gi
```

```shell
pi@raspi001:~/tmp $ k apply -f sample-statefulset.yaml
```

nfapi に移動して、あるか確認。

```shell
pi@nfspi:~ $ ls -la /home/data
total 20
drwxrwxrwx 5 pi     pi      4096 May  5 17:18 .
drwxr-xr-x 4 root   root    4096 May  4 15:50 ..
drwxrwxrwx 2 nobody nogroup 4096 May  5 17:17 default-www-sample-statefulset-0-pvc-5911505b-6f51-11e9-bb47-b827eb8ccd80
drwxrwxrwx 2 nobody nogroup 4096 May  5 17:18 default-www-sample-statefulset-1-pvc-5f2fd68e-6f51-11e9-bb47-b827eb8ccd80
drwxrwxrwx 2 nobody nogroup 4096 May  5 17:18 default-www-sample-statefulset-2-pvc-69bee568-6f51-11e9-bb47-b827eb8ccd80
```

ありました！ マウントできています！

# お片付け

`--prune`でも良いのですが、下記のほうが使いやすかったです。

```shell
pi@raspi001:~/tmp $ k delete -f sample-ds.yaml -f sample-statefulset.yaml
pi@raspi001:~/tmp $ k delete pvc www-sample-statefulset-{0,1,2}
```

※ `k get pv`と`k get pvc`を試して頂き、今回作ったリソースがありましたら削除お願いします。

# おわりに

StatefulSet を使える状態にするまでに記事が大きくなってしまいました。次回に詳しく学んでいこうと思います。笑
あと、[nfs-client](https://github.com/kubernetes-incubator/external-storage/tree/master/nfs-client)を見て思ったのが、kubernetes のパッケージマネージャである helm を導入した方が、遥かに便利だと思いつつ、手動設定しました。。。
次回は、[こちら](../start_the_learning_kubernetes_07/index.md)です。
