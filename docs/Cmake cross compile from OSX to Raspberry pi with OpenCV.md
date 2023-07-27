# Cmake cross compile from OSX to Raspberry pi with OpenCV

Cross compile means that you write, compile and build code on once machine, while run the program on another machine even if its OS and CPU architecture are different.

### Why cross compile for RPi?

1. RPi is too slow to build large project. Makes continuously testing and debugging impossible.
2. Memory and virtual memory exhausted. Like [this](https://www.google.com.tw/search?client=safari&rls=en&q=raspberrypi+compile+virtual+memory+exhausted&ie=UTF-8&oe=UTF-8&gfe_rd=cr&ei=3MScWKfwGLT48Aeto7jACA). It could easily happens when you enable neon optimisation in gcc/g++.

You have no choice but to cross compile. So let's start it!

### Environment

**Compile Machine**
OSX: 10.11.6
cmake: 3.7.2
cross compiler: linaro-arm-linux-gnueabihf-raspbian

** Target Device **
RPi: Model 3 B, Jessie Rasparian
OpenCV v2.4.9 (installed via `apt-get`)

### On RPi

First of all, get your pi 3 wifi working by editing `/etc/network/interfaces`

```
auto wlan0
allow-hotplug wlan0
iface wlan0 inet dhcp
wpa-ssid "YOUR_SSID"
wpa-psk "YOUR_PASSWORD"
# wpa-conf /etc/wpa_supplicant/wpa_supplicant.conf
```

Remember to comment out `wpa-conf ...`, that is just wasting your time, then `sudo reboot`. By the way, `sudo iwlist wlan0 scan | grep ESSID` is a nice tool.

Install everything you need.

```
apt-get install build-essential git libopencv-dev # and other libs you need
```

### On Compile Machine

Install cmake and [linaro](https://www.linaro.org) g++ compiler on your OSX, the default installation location is `/usr/local/linaro/arm-linux-gnueabihf-raspbian/`, we need to tell cmake to use this compiler later.

Then copy everything of `/lib`, `/usr`, `/opt` from RPi to your compile machine. You could just copy from pi's SD card or use, or the other way, use `rsync`. I personally recommend to use `rsync`, because you can't copy from SD card every time when your pi get's updated or upgrade or installed something new, that's pretty annoying.

So let's copy pi's environment to your OSX. Suppose you can ssh to your pi via `ssh pi3`

```
mkdir ~/pi3 && cd ~/pi3
mkdir root && cd root # put your pi files here
rsync -rl pi3:/lib . 
rsync -rl pi3:/usr .
rsync -rl pi3:/opt .
```

Note that `rsync` takes long time when first time execute. 

Now you have the nessassary environment that compiler needs to build your code. Not that you may want to sync every time your pi gets updated or upgraded.

Before you can cross compile, you need a toolchain file to tell cmake to switch build environment.

In `~/pi3/Toolchain-RaspberryPi.cmake`

```
SET(CMAKE_SYSTEM_NAME Linux) # important for cross compile
SET(CMAKE_SYSTEM_VERSION 1) # not so important

SET(TOOLROOT /usr/local/linaro/arm-linux-gnueabihf-raspbian)
SET(PIROOT $ENV{HOME}/work/pi3/root)

# Specify the cross compiler
SET(CMAKE_C_COMPILER   ${TOOLROOT}/bin/arm-linux-gnueabihf-gcc)
SET(CMAKE_CXX_COMPILER ${TOOLROOT}/bin/arm-linux-gnueabihf-g++)


# Where is the target environment
SET(CMAKE_FIND_ROOT_PATH ${PIROOT})

# Search for programs only in the build host directories
SET(CMAKE_FIND_ROOT_PATH_MODE_PROGRAM NEVER)

# Search for libraries and headers only in the target directories
SET(CMAKE_FIND_ROOT_PATH_MODE_LIBRARY ONLY)
SET(CMAKE_FIND_ROOT_PATH_MODE_INCLUDE ONLY)
```

The toolchain file is per environment so you don't need to have a copy of it in every project. 

So far we copied pi3 environment to our OSX, create the toolchain file and setup proper flags in it. Now we'd like to start compile and build our codes.

CMakeLists.txt

```
cmake_minimum_required(VERSION 3.1)
project( TestProject )

set(CMAKE_CXX_STANDARD 11)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
message(STATUS "Using C++11")

include_directories( 
    ${PIROOT}/usr/include/arm-linux-gnueabihf
    ${PIROOT}/usr/include
    ${PIROOT}/usr/local/include
    ${PIROOT}/opt/vc/include 
    ${PIROOT}/opt/vc/include/interface/vcos/pthreads 
    ${PIROOT}/opt/vc/include/interface/vmcs_host/linux 
)
link_directories( 
    ${PIROOT}/lib/arm-linux-gnueabihf 
    ${PIROOT}/lib
    ${PIROOT}/usr/lib/arm-linux-gnueabihf 
    ${PIROOT}/usr/lib
    ${PIROOT}/usr/local/lib
    ${PIROOT}/opt/vc/lib 
)

find_package(OpenCV REQUIRED)

add_executable(${PROJECT_NAME} main.cpp)

# link libs after add_executable
target_link_libraries(${PROJECT_NAME} ${OpenCV_LIBS} )
```

### Build

```
mkdir build && cd build
cmake -DCMAKE_BUILD_TYPE=Release -DCMAKE_TOOLCHAIN_FILE=~/pi3/Toolchain-RaspberryPi.cmake .. && make -j
```

You can use `make VERBOSE=1` for debug.

### Troubleshooting

If linker error happens on `libc.so` or `libpthread.so`. Edit them by delete the absolute path. 

Note that it's not the ones in your OSX system directory, but the ones that you've copied from RPi. [Reference](https://www.raspberrypi.org/forums/viewtopic.php?f=33&t=37658).

For example, open `~/pi3/root/usr/lib/arm-linux-gnueabihf/libc.so` with text editor on your OSX

```
OUTPUT_FORMAT(elf32-littlearm)
GROUP ( libc.so.6 libc_nonshared.a  AS_NEEDED ( ld-linux-armhf.so.3 ) )
```

for `libpthread.so`

```
OUTPUT_FORMAT(elf32-littlearm)
GROUP ( libpthread.so.0 libpthread_nonshared.a )
```

You may have to re-edit them every time after you use `rsync`.

### Optional: Use Raspberry Pi Camera in C++

If you want to use pi-cam in your python code, that's as easy as `apt-get install`, however, if you want to use it in c++, you have to build for yourself, I don't know why there're no pre-built binary out there. Of course you can now cross compile it but I recommend just simply compile on your RPi,  because it just take few seconds. You can find the detail steps [here](http://www.uco.es/investiga/grupos/ava/node/40). 

Again, remember to sync these libs and headers to your OSX after installation.

### Useful links that help you learn

* Must Read: http://www.vtk.org/Wiki/CMake_Cross_Compiling
* 必讀: https://www.raspberrypi.com.tw/405/using-a-cross-compiler-for-raspberry-pi/#comments
* Recommended: http://www.welzels.de/blog/en/arm-cross-compiling-with-mac-os-x/
* Recommended: https://solderspot.wordpress.com/2016/02/04/cross-compiling-for-raspberry-pi-part-ii/

##### cross compile

* http://stackoverflow.com/questions/24141486/cmake-cross-compilation-fails-during-linking-stage-on-host-target-is-raspberry
* https://cmake.org/Wiki/CMake:How_To_Find_Libraries
* http://stackoverflow.com/questions/33276917/cross-compiling-to-raspberry-pi-using-qt-and-opencv
* http://stackoverflow.com/questions/22255975/cross-compile-opencv-project-on-ubuntu-for-raspberry-pi
* http://amgaera.github.io/blog/2014/04/10/cross-compiling-for-raspberry-pi-on-64-bit-linux/
* http://stackoverflow.com/questions/22255975/cross-compile-opencv-project-on-ubuntu-for-raspberry-pi/35326945#35326945
* http://stackoverflow.com/questions/33276917/cross-compiling-to-raspberry-pi-using-qt-and-opencv?rq=1
* http://stackoverflow.com/questions/19624460/how-to-cross-compile-raspberry-pi-project-on-x86-64-missing-so-due-to-invali
* https://www.raspberrypi.org/forums/viewtopic.php?t=57666&p=441492
* https://blog.kitware.com/cross-compiling-for-raspberry-pi/
* http://stackoverflow.com/questions/12844772/how-to-cross-compile-cmake-for-arm-with-cmake
* 中文: http://www.cnblogs.com/rickyk/p/3875334.html

##### RPi and OpenCV

* http://pklab.net/?id=392&lang=EN
* http://www.srccodes.com/p/article/56/uninstall-remove-opencv-raspberry-pi-jessie-debain-make-uninstall-open-source-computer-vision-opencvlib
* https://blog.gtwang.org/iot/raspberry-pi-install-opencv/
* [pi camera tutorial](http://www.uco.es/investiga/grupos/ava/node/40)

##### ARM

* https://community.arm.com/cn/b/blog/posts/arm-cortex-a-gcc-985543018
* https://community.arm.com/tools/b/blog/posts/arm-cortex-a-processors-and-gcc-command-lines
* http://raspberrypi.stackexchange.com/questions/2046/which-cpu-flags-are-suitable-for-gcc-on-raspberry-pi
* http://andy-thomason.github.io/lecture_notes/agp/agp_simd_programming.html
* https://gcc.gnu.org/bugzilla/show_bug.cgi?id=72736
