# Opencv 3.2.0 with CUDA 8.0 on Ubuntu 16.04

先follow[這篇文章](https://gist.github.com/MarcWang/0547f87cf777b6576275)裝一些必須庫，然後再回來裝v3.2.0

```
git clone https://github.com/opencv/opencv.git
cd opencv
git checkout 3.2.0
cd ..
```

OpenCV把一些還不成熟、尚未完整測試的實做放在另一個opencv_contrib，待成熟且受大眾歡迎後才會收入主要repo。雖說如此，它卻內含許多state-of-art的算法，怎麼能錯過呢？

```
git clone https://github.com/Itseez/opencv_contrib.git
cd opencv_contrib
git checkout 3.2.0
```

```
cd {path_to_opencv}
mkdir build
cd build
cmake -DCUDA_CUDA_LIBRARY=/usr/local/cuda/lib64/stubs/libcuda.so\
      -D CMAKE_BUILD_TYPE=RELEASE \
      -D CMAKE_INSTALL_PREFIX=/usr/local \
      -D INSTALL_C_EXAMPLES=OFF \
      -D INSTALL_PYTHON_EXAMPLES=ON \
      -D OPENCV_EXTRA_MODULES_PATH=../../opencv_contrib/modules \
      -D BUILD_EXAMPLES=ON  ..
make -j8
sudo make install
sudo ldconfig
```

ps. OpenCV 3.1.0與CUDA 8有些相容性問題，建議直接用3.2.0

檢查安裝

```
$ opencv_version
> 3.2.0
```

全部的指令

```
#!/bin/bash
apt-get -y update
apt-get -y upgrade
apt-get -y install build-essential cmake pkg-config git
apt-get -y install libjpeg-dev libtiff5-dev libjasper-dev libpng12-dev
apt-get -y install libavcodec-dev libavformat-dev libswscale-dev libv4l-dev libxvidcore-dev libx264-dev
apt-get -y install libgtk2.0-dev
apt-get -y install libtbb-dev
apt-get -y install libatlas-base-dev gfortran

cd /
git clone https://github.com/Itseez/opencv.git
cd opencv
git checkout 3.2.0

cd /
git clone https://github.com/Itseez/opencv_contrib.git
cd opencv_contrib
git checkout 3.2.0

export CUDA_CUDA_LIBRARY=/usr/local/cuda/lib64/
cd /opencv
mkdir build
cd build
cmake -DCUDA_CUDA_LIBRARY=/usr/local/cuda/lib64/stubs/libcuda.so\
      -D CMAKE_BUILD_TYPE=RELEASE \
      -D CMAKE_INSTALL_PREFIX=/usr/local \
      -D INSTALL_C_EXAMPLES=OFF \
      -D INSTALL_PYTHON_EXAMPLES=ON \
      -D OPENCV_EXTRA_MODULES_PATH=../../opencv_contrib/modules \
      -D BUILD_EXAMPLES=ON  ..
make -j8
make install
ldconfig
```
