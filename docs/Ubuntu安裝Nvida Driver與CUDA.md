# Ubuntu安裝Nvida Driver與CUDA

#### 關閉UEFI secure boot

現在比較新一點的主板預設可能會用UEFI secure boot，若沒有的話可以忽略這步驟。UEFI secure boot 會讓3rd party driver包括NVidia失效，所以最好關閉它，最簡單的作法就是到bios去設定，具體方式因bios而異。

### NVidia Driver

優先透過apt-get安裝distribution-specific的驅動

```
sudo add-apt-repository ppa:graphics-drivers/ppa
sudo apt-get update
sudo apt-get install build-essential nvidia-375
```

如果行不通，再到官網去下載runfile安裝

驗證：

```
$ nvidia-smi
Mon Dec 19 21:03:02 2016       
+-----------------------------------------------------------------------------+
| NVIDIA-SMI 367.57                 Driver Version: 367.57                    |
|-------------------------------+----------------------+----------------------+
| GPU  Name        Persistence-M| Bus-Id        Disp.A | Volatile Uncorr. ECC |
| Fan  Temp  Perf  Pwr:Usage/Cap|         Memory-Usage | GPU-Util  Compute M. |
|===============================+======================+======================|
|   0  GeForce GTX 1070    Off  | 0000:01:00.0      On |                  N/A |
| 28%   32C    P8     7W / 151W |    312MiB /  8110MiB |      1%      Default |
+-------------------------------+----------------------+----------------------+

+-----------------------------------------------------------------------------+
| Processes:                                                       GPU Memory |
|  GPU       PID  Type  Process name                               Usage      |
|=============================================================================|
|    0      3200    G   /usr/lib/xorg/Xorg                             177MiB |
|    0      3927    G   compiz                                          73MiB |
|    0      4233    G   unity-control-center                             1MiB |
|    0      4336    G   ...onModel/Model0/DataReductionProxyUseQuic/    57MiB |
+-----------------------------------------------------------------------------+
```

### CUDA

[官網](https://developer.nvidia.com/cuda-downloads)提供兩種安裝方法，建議用.deb安裝，因為runfile安裝需要關閉x-server，比較麻煩。

安裝完之後，在`.bashrc`新增

```
export CUDA_HOME=/usr/local/cuda-8.0 
export LD_LIBRARY_PATH=${CUDA_HOME}/lib64 
PATH=${CUDA_HOME}/bin:${PATH} 
export PATH
```

然後重開機

驗證安裝：

```
cd $CUDA_HOME
cd samples/1_Utilities/deviceQuery
sudo make
./deviceQuery
```

結果

```
/usr/local/cuda-8.0/samples/1_Utilities/deviceQuery/deviceQuery Starting...

 CUDA Device Query (Runtime API) version (CUDART static linking)

Detected 1 CUDA Capable device(s)

Device 0: "GeForce GTX 1070"
  CUDA Driver Version / Runtime Version          8.0 / 8.0
  CUDA Capability Major/Minor version number:    6.1
  Total amount of global memory:                 8110 MBytes (8504279040 bytes)
  (15) Multiprocessors, (128) CUDA Cores/MP:     1920 CUDA Cores
  GPU Max Clock rate:                            1772 MHz (1.77 GHz)
  Memory Clock rate:                             4004 Mhz
  Memory Bus Width:                              256-bit
  L2 Cache Size:                                 2097152 bytes
  Maximum Texture Dimension Size (x,y,z)         1D=(131072), 2D=(131072, 65536), 3D=(16384, 16384, 16384)
  Maximum Layered 1D Texture Size, (num) layers  1D=(32768), 2048 layers
  Maximum Layered 2D Texture Size, (num) layers  2D=(32768, 32768), 2048 layers
  Total amount of constant memory:               65536 bytes
  Total amount of shared memory per block:       49152 bytes
  Total number of registers available per block: 65536
  Warp size:                                     32
  Maximum number of threads per multiprocessor:  2048
  Maximum number of threads per block:           1024
  Max dimension size of a thread block (x,y,z): (1024, 1024, 64)
  Max dimension size of a grid size    (x,y,z): (2147483647, 65535, 65535)
  Maximum memory pitch:                          2147483647 bytes
  Texture alignment:                             512 bytes
  Concurrent copy and kernel execution:          Yes with 2 copy engine(s)
  Run time limit on kernels:                     Yes
  Integrated GPU sharing Host Memory:            No
  Support host page-locked memory mapping:       Yes
  Alignment requirement for Surfaces:            Yes
  Device has ECC support:                        Disabled
  Device supports Unified Addressing (UVA):      Yes
  Device PCI Domain ID / Bus ID / location ID:   0 / 1 / 0
  Compute Mode:
     < Default (multiple host threads can use ::cudaSetDevice() with device simultaneously) >

deviceQuery, CUDA Driver = CUDART, CUDA Driver Version = 8.0, CUDA Runtime Version = 8.0, NumDevs = 1, Device0 = GeForce GTX 1070
Result = PASS
```

可以看到CUDA Capability Major是6.1，等等安裝tensorflow會用到。CUDA samples裡面還有許多有趣的範例，建議玩玩看。

參考：http://shamangary.logdown.com/posts/773013-install-torch7-cuda-cudnn-nvidia-driver

### cuDNN

下載[官方cuDNN](https://developer.nvidia.com/rdp/cudnn-download)包，並複製到cuda資料夾

```
(未必正確)
$ cd folder/extracted/contents
$ sudo cp -P include/cudnn.h /usr/include
$ sudo cp -P lib64/libcudnn* /usr/lib/x86_64-linux-gnu/
$ sudo chmod a+r /usr/lib/x86_64-linux-gnu/libcudnn*
```

[參考1](http://askubuntu.com/questions/767269/how-can-i-install-cudnn-on-ubuntu-16-04)
[參考2](https://alliseesolutions.wordpress.com/2016/09/08/install-gpu-tensorflow-from-sources-w-ubuntu-16-04-and-cuda-8-0-rc/)

### 安裝tensorflow

按照[官網](https://github.com/tensorflow/tensorflow/blob/master/tensorflow/g3doc/get_started/os_setup.md#pip-installation)指示，介紹得很詳盡，基本沒啥問題。其中configure時的問與答，enable cuda選y，device compute capability填上剛剛deviceQuery查到的數值，其餘可用預設。

[中文參考1](https://zhuanlan.zhihu.com/p/23042536)
[中文參考2](http://darren1231.pixnet.net/blog/post/331300298-%E5%AE%89%E8%A3%9D-tensorflow-%E6%95%99%E5%AD%B8-gpu%3Anvidia1070(from-source))
[英文參考1](https://alliseesolutions.wordpress.com/2016/09/08/install-gpu-tensorflow-from-sources-w-ubuntu-16-04-and-cuda-8-0-rc/)
[英文參考2](http://textminingonline.com/dive-into-tensorflow-part-iii-gtx-1080-ubuntu16-04-cuda8-0-cudnn5-0-tensorflow)

### 乾貨

[awesome-tensorflow](https://github.com/jtoy/awesome-tensorflow)
