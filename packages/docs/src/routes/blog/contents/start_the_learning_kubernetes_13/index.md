---
title: 一足遅れて Kubernetes を学び始める - 13. ヘルスチェックとコンテナライフサイクル -
published: true
date: 2019-05-30
description: 前回 一足遅れて Kubernetes を学び始める - 12. リソース制限 -では、requestsやlimitなどのリソース制限について学習しました。今回は、ヘルスチェックとコンテナライフサイクルについて学習します。
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

[一足遅れて Kubernetes を学び始める - 12. リソース制限 -](../start_the_learning_kubernetes_12/index.md)では、requests や limit などのリソース制限について学習しました。今回は、ヘルスチェックとコンテナライフサイクルについて学習します。

# ヘルスチェック

Kubernetes では、Pod の正常生判断のためのヘルスチェックが 2 種類用意されています。

- Liveness Probe
  - Pod が正常か判断。異常だった場合、Pod を再起動。
- Readiness Probe
  - Pod がサービスインする準備ができているか判断。準備できていなかったら、トラフィックを流さない。

たとえば、Pod 内でメモリリークが発生し応答しなくなった場合に有効です。
LoadBalancer のサービスは、ICMP による簡易ヘルスチェックがデフォルトで用意されています。

また、Liveness、Readiness どちらにも３つの方式があります。

- exec
  - コマンドを実行し、終了コードが 0 でなければ失敗
- httpGet
  - HTTP GET リクエストを実行し、statusCode が 200~399 でなければ失敗
- tcpSocket
  - TCP セッションが確立できなければ失敗

では、試してみましょう。

```yaml
# sample-healthcheck.yaml
apiVersion: v1
kind: Pod
metadata:
  name: sample-healthcheck
  labels:
    app: sample-app
spec:
  containers:
    - name: nginx-container
      image: nginx:1.12
      ports:
        - containerPort: 80
      livenessProbe:
        httpGet:
          path: /index.html
          port: 80
          scheme: HTTP
        timeoutSeconds: 1
        successThreshold: 1
        failureThreshold: 2
        initialDelaySeconds: 5
        periodSeconds: 3
      readinessProbe:
        exec:
          command: ["ls", "/usr/share/nginx/html/50x.html"]
        timeoutSeconds: 1
        successThreshold: 2
        failureThreshold: 1
        initialDelaySeconds: 5
        periodSeconds: 3
```

- timeoutSeconds
  - タイムアウトまでの秒数
- successThreshold
  - 成功と判断するまでのチェック回数
- failureThreshold
  - 失敗と判断するまでのチェック回数
- initialDelaySeconds
  - 初回ヘルスチェック開始までの遅延
- periodSeconds
  - ヘルスチェックの間隔

```shell
pi@raspi001:~/tmp $ k apply -f sample-healthcheck.yaml
pi@raspi001:~/tmp $ k describe pod sample-healthcheck | egrep "Liveness|Readiness"
    Liveness:       http-get http://:80/index.html delay=5s timeout=1s period=3s #success=1 #failure=2
    Readiness:      exec [ls /usr/share/nginx/html/50x.html] delay=5s timeout=1s period=3s #success=2 #failure=1
```

設定どおりに動作していますね。では、失敗させましょう。

liveness を失敗させるには index.html を削除すれば良いですね。

```shell
pi@raspi001:~/tmp $ k exec -it sample-healthcheck rm /usr/share/nginx/html/index.html
pi@raspi001:~/tmp $ k get pods --watch
NAME                                      READY   STATUS    RESTARTS   AGE
sample-healthcheck                        1/1     Running   1          9m54s
sample-healthcheck                        0/1     Running   2          10m
sample-healthcheck                        1/1     Running   2          10m
```

一度削除されて、再起動しましたね。
今度は、readiness を失敗させましょう。こちらは 50x.html を削除すれば良いですね。

```shell
pi@raspi001:~/tmp $ k exec -it sample-healthcheck rm /usr/share/nginx/html/50x.html
pi@raspi001:~/tmp $ k get pods --watch
NAME                                      READY   STATUS    RESTARTS   AGE
sample-healthcheck                        1/1     Running   2          16m
sample-healthcheck                        0/1     Running   2          16m
pi@raspi001:~/tmp $ k exec -it sample-healthcheck touch /usr/share/nginx/html/50x.html
pi@raspi001:~/tmp $ k get pods --watch
NAME                                      READY   STATUS    RESTARTS   AGE
sample-healthcheck                        0/1     Running   2          17m
sample-healthcheck                        1/1     Running   2          17m
```

期待通り、50x.html を削除すると、READY から外れて、追加すると READY に戻りました。

# コンテナの再起動

コンテナのプロセスが停止、またはヘルスチェックの失敗によってコンテナを再起動するかどうかは、spec.restartPolicy によって決まります。
種類は下記３つです。

- Always
  - 常に Pod を再起動させる
- OnFailure
  - 終了コード 0 以外の予期せぬ停止の場合、Pod を再起動させる
- Never
  - 再起動させない

試してみましょう。

```yaml
# sample-restart-always.yaml
apiVersion: v1
kind: Pod
metadata:
  name: sample-restart-always
spec:
  restartPolicy: Always
  containers:
    - name: nginx-container
      image: nginx:1.12
      command: ["sh", "-c", "exit 0"] # 成功の場合
#      command: ["sh", "-c", "exit 1"] # 失敗の場合
```

```shell
pi@raspi001:~/tmp $ k apply -f sample-restart-always.yaml
# 成功の場合
pi@raspi001:~/tmp $ k get pods sample-restart-always --watch
NAME                    READY   STATUS              RESTARTS   AGE
sample-restart-always   0/1     ContainerCreating   0          13s
sample-restart-always   0/1     Completed           0          19s
sample-restart-always   0/1     Completed           1          27s
sample-restart-always   0/1     CrashLoopBackOff    1          28s
sample-restart-always   0/1     Completed           2          37s
# 失敗の場合
pi@raspi001:~/tmp $ k get pods sample-restart-always --watch
NAME                    READY   STATUS              RESTARTS   AGE
sample-restart-always   0/1     ContainerCreating   0          7s
sample-restart-always   0/1     Error               0          12s
sample-restart-always   0/1     Error               1          17s
sample-restart-always   0/1     CrashLoopBackOff    1          18s
sample-restart-always   0/1     Error               2          37s
```

成功、失敗どちらも再起動していることがわかります。

```yaml
# sample-restart-onfailure.yaml
apiVersion: v1
kind: Pod
metadata:
  name: sample-restart-onfailure
spec:
  restartPolicy: OnFailure
  containers:
    - name: nginx-container
      image: nginx:1.12
      command: ["sh", "-c", "exit 0"] # 成功の場合
#      command: ["sh", "-c", "exit 1"] # 失敗の場合
```

```shell
pi@raspi001:~/tmp $ k apply -f sample-restart-onfailure.yaml
# 成功の場合
pi@raspi001:~/tmp $ k get pods sample-restart-onfailure --watch
NAME                       READY   STATUS              RESTARTS   AGE
sample-restart-onfailure   0/1     ContainerCreating   0          3s
sample-restart-onfailure   0/1     Completed           0          15s
# 失敗の場合
pi@raspi001:~/tmp $ k get pods sample-restart-onfailure --watch
NAME                       READY   STATUS              RESTARTS   AGE
sample-restart-onfailure   0/1     ContainerCreating   0          4s
sample-restart-onfailure   0/1     Error               0          22s
sample-restart-onfailure   0/1     Error               1          28s
sample-restart-onfailure   0/1     CrashLoopBackOff    1          29s
sample-restart-onfailure   0/1     Error               2          50s
```

成功時は、Completed の終了していますね。CrashLoopBackOff していません。失敗時は、Error となり、CrashLoopBackOff しています。
期待通りですね。

# initContainers

Pod のメインとなるコンテナを起動する前に別のコンテナを起動させるための機能です。
spec.containers がもともとありますが、こちらは同時並列で起動するので、順序が必要な場合には向いていません。
initContainers は、spec.initContainers で設定でき、複数指定できます。複数の場合は上から順に起動します。

試してみましょう。

```yaml
# sample-initcontainer.yaml
apiVersion: v1
kind: Pod
metadata:
  name: sample-initcontainer
spec:
  initContainers:
    - name: output-1
      image: nginx:1.12
      command:
        ["sh", "-c", "sleep 20; echo 1st > /usr/share/nginx/html/index.html"]
      volumeMounts:
        - name: html-volume
          mountPath: /usr/share/nginx/html/
    - name: output-2
      image: nginx:1.12
      command:
        ["sh", "-c", "sleep 10; echo 2nd >> /usr/share/nginx/html/index.html"]
      volumeMounts:
        - name: html-volume
          mountPath: /usr/share/nginx/html/
  containers:
    - name: nginx-container
      image: nginx:1.12
      volumeMounts:
        - name: html-volume
          mountPath: /usr/share/nginx/html/
  volumes:
    - name: html-volume
      emptyDir: {}
```

```shell
pi@raspi001:~/tmp $ k get pod sample-initcontainer --watch
NAME                   READY   STATUS     RESTARTS   AGE
sample-initcontainer   0/1     Init:0/2   0          3s
sample-initcontainer   0/1     Init:0/2   0          9s
sample-initcontainer   0/1     Init:1/2   0          30s
sample-initcontainer   0/1     Init:1/2   0          38s
sample-initcontainer   0/1     PodInitializing   0          51s
sample-initcontainer   1/1     Running           0          59s
pi@raspi001:~/tmp $ k exec -it sample-initcontainer cat /usr/share/nginx/html/index.html
1st
2nd
```

確かに、initContainers が順序通り起動できています。ふむふむ。

# 起動時と終了時のコマンド実行(postStart,preStop)

コンテナ起動後に実行するコマンドを postStart,
コンテナ終了前に実行するコマンドを preStop という機能で実現できます。

```yaml
# sample-lifecycle.yaml
apiVersion: v1
kind: Pod
metadata:
  name: sample-lifecycle
spec:
  containers:
    - name: nginx-container
      image: nginx:1.12
      command: ["/bin/sh", "-c", "touch /tmp/started; sleep 3600"]
      lifecycle:
        postStart:
          exec:
            command: ["/bin/sh", "-c", "sleep 20; touch /tmp/poststart"]
        preStop:
          exec:
            command: ["/bin/sh", "-c", "touch /tmp/prestop; sleep 20"]
```

```shell
pi@raspi001:~/tmp $  k apply -f sample-lifecycle.yaml
pi@raspi001:~/tmp $  k exec -it sample-lifecycle ls /tmp
started
# 数秒後
pi@raspi001:~/tmp $  $ k exec -it sample-lifecycle ls /tmp
poststart  started
pi@raspi001:~/tmp $ k delete -f sample-lifecycle.yaml
# すぐ!
pi@raspi001:~/tmp $ k exec -it sample-lifecycle ls /tmp
poststart  prestop  started
```

たしかに、postStart, preStop が動いています。
注意しないといけないのが、postStart は、spec.containers[].command の実行とほぼ同じだそうです。（非同期)

# Pod の安全な停止とタイミング

terminationGracePeriodSeconds に指定した秒数は、pod が削除開始時からの猶予です。
デフォルトで 30 秒となっています。30 秒の間に preStop+SIGTERM の処理が終わらなければ、
強制的に SIGKILL されて停止されます。ただし、preStop が終わっていなくて 30 秒たった場合、
SIGTERM 処理を 2 秒だけ実施できます。
terminationGracePeriodSeconds の値は、prePost を必ず終える秒数に設定しましょう。

# Node をスケジューリング対象から外す

Node を kubernetes のスケジューリング対象から外す cordon というコマンドがあります。
Node の状態には、SchedulingEnabled と SchedulingDisabled があり、後者の状態になると、
kubernetes からのスケジューリング対象外となり、たとえば ReplicaSet の更新などが機能しなくなります。

cordon コマンドを使うと、指定する Node が SchedulingDisabled になります。(uncordon は逆)
ただし、現在動作している Pod はスケジューリング対象になったままで、新たに追加するものが
スケジューリング対象外になります。現在動作しているものも対象にしたい場合は、drain コマンド
を使います。
実際に試してみます。

```shell
pi@raspi001:~/tmp $ k get nodes
NAME       STATUS   ROLES    AGE   VERSION
raspi001   Ready    master   33d   v1.14.1
raspi002   Ready    worker   33d   v1.14.1
raspi003   Ready    worker   32d   v1.14.1
pi@raspi001:~/tmp $ k cordon raspi002
pi@raspi001:~/tmp $ k get nodes
NAME       STATUS                     ROLES    AGE   VERSION
raspi001   Ready                      master   33d   v1.14.1
raspi002   Ready,SchedulingDisabled   worker   33d   v1.14.1
raspi003   Ready                      worker   32d   v1.14.1
pi@raspi001:~/tmp $ k uncordon raspi002
pi@raspi001:~/tmp $ k get nodes
NAME       STATUS   ROLES    AGE   VERSION
raspi001   Ready    master   33d   v1.14.1
raspi002   Ready    worker   33d   v1.14.1
raspi003   Ready    worker   32d   v1.14.1
pi@raspi001:~/tmp $ k drain raspi002
node/raspi002 cordoned
error: unable to drain node "raspi002", aborting command...

There are pending nodes to be drained:
 raspi002
error: cannot delete DaemonSet-managed Pods (use --ignore-daemonsets to ignore): kube-system/kube-flannel-ds-arm-7nnbj, kube-system/kube-proxy-wgjdq, metallb-system/speaker-tsxdk
```

drain すると、ReplicaSet のように管理した Pod であれば、別 Node に作成されるので良いのですが、
単体 Pod など管理されていないものは、削除されてしまいます。上記の警告は、DaemonSet で管理されている Pod は、
削除するしかないけど、良いですか？というものです。
そのため、drain をすると、いくつか警告されます。警告内容に従って適宜操作する必要があります。

# お片付け

```shell
pi@raspi001:~/tmp $ k delete -f sample-healthcheck.yaml -f sample-restart-always.yaml -f sample-restart-onfailure.yaml -f sample-initcontainer.yaml -f sample-lifecycle.yaml
```

# 最後に

今回は、ヘルスチェックの動作と、コンテナを停止するまでのステップを学習しました。
わざわざヘルスチェックの処理をアプリケーションに用意せずとも、kubernetes に機能として
存在することに、驚きました。次回は、[こちら](../start_the_learning_kubernetes_14/index.md)です。
