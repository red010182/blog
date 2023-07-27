# Opencv 3.2.0 with CUDA 8.0 on tensorflow docker

假設你灌好了nvidia driver, CUDA 8.0, CUDNN 5.1, docker, nvidia-docker

先啟動官方的[tensorflow docker](https://github.com/tensorflow/tensorflow/tree/master/tensorflow/tools/docker)背景執行，切記tag很重要，後面加上`:latest-gpu`才能正確使用GPU，否則預設會用`:latest`，也就是CPU版本。

```
sudo nvidia-docker run -d -p 8888:8888 gcr.io/tensorflow/tensorflow:latest-gpu
```

進到container

```
sudo nvidia-docker exec -it {container ID} bash
```

檢查一下GPU

```
nvidia-smi
```

沒意外的話可以看到GPU的資訊

接著安裝openCV，一行搞定

```
bash <(curl -s https://gist.githubusercontent.com/red010182/cb8133c1bd4daf41c82803d819ce1784/raw/9dd46c6b9f248ea6a311c6f1c42ef703eac63c04/install_opencv.sh)
```

[gist](https://gist.github.com/red010182/cb8133c1bd4daf41c82803d819ce1784)在此，關於script內容，請參考[Opencv 3.2.0 with CUDA 8.0 on Ubuntu 16.04](http://www.jianshu.com/p/ba6eaa8ecea3)
