# Install go lang using gvm

由於在ubuntu上直接```apt-get install go-lang```並不是最新版本，所以用gvm來安裝，將來要更新也方便。

然而gvm在安裝go1.5以上時，是用go本身來compile，所以要先灌go1.4才能灌更高的版本，而gvm本身並沒有自帶go1.4，所以

```
$ gvm install go1.4
Installing go1.4...
 * Compiling...
ERROR: Failed to compile. Check the logs at /Users/cage/.gvm/logs/go-go1.4-compile.log
ERROR: Failed to use installed version
```

直接安裝go1.4，會採用compile源碼方式安裝，結果報錯，shit。改用binary安裝

```
$ gvm install go1.4 -B   // 用binary方式安裝，省心
$ gvm use go1.4
```

安裝其他版本

```
$ gvm install go1.9
$ gvm use go1.9
$ go version
```

安裝完後gvm會幫你把GOPATH, GOROOT什麼鬼的都設定好

```
$ go env

GOARCH="amd64"
GOBIN=""
GOEXE=""
GOHOSTARCH="amd64"
GOHOSTOS="linux"
GOOS="linux"
GOPATH="/home/alston/.gvm/pkgsets/go1.9/global"
GORACE=""
GOROOT="/home/alston/.gvm/gos/go1.9"
GOTOOLDIR="/home/alston/.gvm/gos/go1.9/pkg/tool/linux_amd64"
GCCGO="gccgo"
CC="gcc"
GOGCCFLAGS="-fPIC -m64 -pthread -fmessage-length=0 -fdebug-prefix-map=/tmp/go-build336894381=/tmp/go-build -gno-record-gcc-switches"
CXX="g++"
CGO_ENABLED="1"
CGO_CFLAGS="-g -O2"
CGO_CPPFLAGS=""
CGO_CXXFLAGS="-g -O2"
CGO_FFLAGS="-g -O2"
CGO_LDFLAGS="-g -O2"
PKG_CONFIG="pkg-config"
```

但是一旦新開terminal，又找不到go指令了，設為default解決

```
gvm use go1.9 --default
```
