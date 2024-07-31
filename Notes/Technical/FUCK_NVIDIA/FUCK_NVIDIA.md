# 安装Nvidia显卡驱动

这次要跑一些cuRobo的程序，需要用到显卡。之前一直用服务器，本地的环境一直没有配过，不多说了，从配显卡驱动开始吧。

先使用`nvidia-smi`查看显卡状态。OK，`command not found`，说明本地环境并没有安装nvidia显卡驱动。

安装显卡驱动有下面两种方法，我在尝试第一种方法失败之后使用第二种方法成功安装了显卡驱动。

## 利用Ubuntu提供的驱动安装方法

Software & Updates $\rightarrow$ Additional Drivers

![[Nvidia_fig1.png]]

选择合适的驱动（何为合适？）即可（吗？）

## 从Nvidia官网下载驱动并安装

在[手动搜索驱动页面](https://www.nvidia.cn/drivers/lookup/)输入自己的系统类型和显卡型号，下载对应的驱动。

进入tty模式（快捷键`Ctrl Alt Fx`或终端输入`telinit x`，`x`是数字，比如3），并以root用户的身份运行刚才下载好的脚本就可以按照指示安装驱动了。

## 遇到的问题

1. `nvidia-smi`报错：NVIDIA-SMI has failed because it couldn't communicate with the NVIDIA driver.

这说明nvidia-smi无法与驱动程序通信，可是我们已经安装了驱动程序，这是怎么回事呢？

下面这篇博客和我遇到的问题一模一样，我完全按照博主的提示敲了一遍命令就解决了问题：[问题解决](https://blog.csdn.net/very_big_house/article/details/135626122?spm=1001.2014.3001.5501)

~~所以其实可能只是单纯没有重启而已？~~

2. `lspci | grep VGA`找不到nvidia显卡，只找到集显

这是一个很弱智的问题`lspci | grep VGA`的意思是“列出连接到计算机的 PCI 总线上的所有 VGA 兼容视频卡。”（from chatglm），有没有可能你的卡不是VGA？`lspci | grep Nvidia`就可以找到了。

3. `nvidia-smi`报错No devices were found

不知道是什么原因，也许是驱动版本与显卡不匹配？最后我通过从Nvidia官网手动搜索驱动并下载安装解决了这个问题。

# 安装cuda

什么是cuda？

>CUDA（Compute Unified Device Architecture）是由NVIDIA公司开发的一个并行计算平台和编程模型。它允许软件开发人员和研究人员利用NVIDIA的图形处理单元（GPU）进行通用计算，即不仅仅用于图形渲染，还能用于处理复杂的计算任务。(from chatglm）

我按照[nvidia官网教程](https://developer.nvidia.com/cuda-11-8-0-download-archive)安装cuda，出现了下面的错误：

```bash
Errors were encountered while processing:
 nvidia-dkms-520
 cuda-drivers-520
 cuda-drivers
 nvidia-driver-520
 cuda-runtime-11-8
 cuda-11-8
 cuda-demo-suite-11-8
 cuda
E: Sub-process /usr/bin/dpkg returned an error code (1)
```

使用`nvcc -V`命令，发现并没有安装成功。

使用`nvidia-smi`，出现了下面的报错：

```bash
...
```

我按照[]()的说法重启，再次使用`nvidia-smi`命令，又一次出现了之前遇到的Nvidia-smi无法与驱动程序通信的问题：

![[Nvidia_fig2.png]]

然后我参考[上面提到的那篇博客](https://blog.csdn.net/very_big_house/article/details/135626122?spm=1001.2014.3001.5501)进行问题的排查，这次在执行`sudo modprobe nvidia`命令时出现了和博主不一样的结果：

![[Nvidia_fig3.png]]

于是我又去参考[这篇回答](https://askubuntu.com/questions/1413512/syslog-error-modprobe-fatal-module-nvidia-not-found-in-directory-lib-module)，并按照下图回答的指示进行修复：

![[Nvidia_fig4.png]]

但是我们需要知道nvidia驱动的版本，现在`nvidia-smi`显然是无法给我们答案了，可以输入命令`sudo dpkg --list | grep nvidia`

![[Nvidia_fig5.png]]

可以看到我们的nvidia driver版本为520（啊？不是535？）

使用`uname -r`查到kenel版本：

![[Nvidia_fig6.png]]

按照上面的方法，输入`sudo apt install linux-modules-nvidia-520-5.15.0-117-generic`

这下坏了
![[Nvidia_fig7.png]]

OK，大概是驱动版本和核心版本不匹配吧，那我们重新安装一下.

输入`ubuntu-drivers devices`，如下图

![[Nvidia_fig8.png]]

我们安装推荐的`535`版本（之前我从官网下载的是550，也许是安cuda的时候给我改成520了？）

使用`sudo apt install nvidia-driver-535`，结果出现了依赖问题~~（没完了是吧？）~~

![[Nvidia_fig9.png]]

OK，我拿这东西没有办法了，先把所有驱动卸载掉，重新安装一遍之前在官网下载的驱动：`sudo apt-get --purge remove "*nvidia*"`

额，这次连官网的驱动我都装不上了，报错如下：

```bash
ERROR: Unable to load the kernel module 'nvidia.ko'.  This happens most
   frequently when this kernel module was built against the wrong or
   improperly configured kernel sources, with a version of gcc that differs
   from the one used to build the target kernel, or if a driver such as
   rivafb/nvidiafb is present and prevents the NVIDIA kernel module from
   obtaining ownership of the NVIDIA graphics device(s), or NVIDIA GPU
   installed in this system is not supported by this NVIDIA Linux graphics
   driver release.
```

原因似乎是没有禁用nouveau？

https://blog.csdn.net/ksws0292756/article/details/79160742

仍然失败

emmm……我确实搞不懂了，问题的起源是我安装cuda和安装的nvidia驱动产生了矛盾，我现在把之前安的东西都卸载掉重新安装一遍cuda试一试吧……再不行就得摇人了.

还是之前的问题，下面是完整的报错信息：

```
INFO:Enable nvidia
DEBUG:Parsing /usr/share/ubuntu-drivers-common/quirks/dell_latitude
DEBUG:Parsing /usr/share/ubuntu-drivers-common/quirks/lenovo_thinkpad
DEBUG:Parsing /usr/share/ubuntu-drivers-common/quirks/put_your_quirks_here
Loading new nvidia-520.61.05 DKMS files...
Building for 5.15.0-117-generic
Building for architecture x86_64
Building initial module for 5.15.0-117-generic
ERROR: Cannot create report: [Errno 17] File exists: '/var/crash/nvidia-kernel-source-520.0.crash'
Error! Bad return status for module build on kernel: 5.15.0-117-generic (x86_64)
Consult /var/lib/dkms/nvidia/520.61.05/build/make.log for more information.
dpkg: error processing package nvidia-dkms-520 (--configure):
 installed nvidia-dkms-520 package post-installation script subprocess returned error exit status 10
Setting up cuda-nvprof-11-8 (11.8.87-1) ...
Setting up libdrm-amdgpu1:i386 (2.4.107-8ubuntu1~20.04.2) ...
Setting up nsight-compute-2022.3.0 (2022.3.0.22-1) ...
Setting up libwayland-client0:i386 (1.18.0-1ubuntu0.1) ...
Setting up nsight-systems-2022.4.2 (2022.4.2.1-df9881f) ...
update-alternatives: using /opt/nvidia/nsight-systems/2022.4.2/target-linux-x64/nsys to provide /usr/local/bin/nsys (nsys) in auto mode
update-alternatives: using /opt/nvidia/nsight-systems/2022.4.2/host-linux-x64/nsys-ui to provide /usr/local/bin/nsys-ui (nsys-ui) in auto mode
Setting up mesa-vdpau-drivers:amd64 (21.2.6-0ubuntu0.1~20.04.2) ...
Setting up libwayland-server0:i386 (1.18.0-1ubuntu0.1) ...
Setting up libnvidia-decode-520:amd64 (520.61.05-0ubuntu1) ...
Setting up libxdmcp6:i386 (1:1.1.3-0ubuntu1) ...
Setting up libdrm-nouveau2:i386 (2.4.107-8ubuntu1~20.04.2) ...
Setting up libxcb1:i386 (1.14-2) ...
Setting up libxcb-xfixes0:i386 (1.14-2) ...
Setting up libcusparse-11-8 (11.7.5.86-1) ...
Setting up libgbm1:i386 (21.2.6-0ubuntu0.1~20.04.2) ...
Setting up libcufft-11-8 (10.9.0.58-1) ...
Setting up cuda-cupti-dev-11-8 (11.8.87-1) ...
Setting up libdrm-radeon1:i386 (2.4.107-8ubuntu1~20.04.2) ...
Setting up libcufft-dev-11-8 (10.9.0.58-1) ...
Setting up cuda-cudart-dev-11-8 (11.8.89-1) ...
Setting up libnpp-11-8 (11.8.0.86-1) ...
Setting up libcusolver-dev-11-8 (11.4.1.48-1) ...
dpkg: dependency problems prevent configuration of cuda-drivers-520:
 cuda-drivers-520 depends on nvidia-dkms-520 (>= 520.61.05); however:
  Package nvidia-dkms-520 is not configured yet.

dpkg: error processing package cuda-drivers-520 (--configure):
 dependency problems - leaving unconfigured
Setting up libxcb-glx0:i386 (1.14-2) ...
No apport report written because the error message indicates its a followup error from a previous failure.
                          Setting up libedit2:i386 (3.1-20191231-1) ...
Setting up libdrm-intel1:i386 (2.4.107-8ubuntu1~20.04.2) ...
Setting up libxcb-shm0:i386 (1.14-2) ...
Setting up xserver-xorg-video-nvidia-520 (520.61.05-0ubuntu1) ...
Setting up libxcb-present0:i386 (1.14-2) ...
Setting up libnvidia-encode-520:amd64 (520.61.05-0ubuntu1) ...
Setting up cuda-nsight-systems-11-8 (11.8.0-1) ...
Setting up cuda-command-line-tools-11-8 (11.8.0-1) ...
Setting up libcusparse-dev-11-8 (11.7.5.86-1) ...
Setting up libcurand-11-8 (10.3.0.86-1) ...
Setting up libxcb-sync1:i386 (1.14-2) ...
Setting up libcufile-11-8 (1.4.0.31-1) ...
Setting alternatives
update-alternatives: using /usr/local/cuda-11.8/gds/cufile.json to provide /etc/cufile.json (cufile.json) in auto mode
Setting up libcublas-11-8 (11.11.3.6-1) ...
Setting up libllvm12:i386 (1:12.0.0-3ubuntu1~20.04.5) ...
Setting up libnpp-dev-11-8 (11.8.0.86-1) ...
Setting up cuda-libraries-11-8 (11.8.0-1) ...
dpkg: dependency problems prevent configuration of cuda-drivers:
 cuda-drivers depends on cuda-drivers-520 (= 520.61.05-1); however:
  Package cuda-drivers-520 is not configured yet.

dpkg: error processing package cuda-drivers (--configure):
 dependency problems - leaving unconfigured
Setting up cuda-nsight-compute-11-8 (11.8.0-1) ...
No apport report written because the error message indicates its a followup error from a previous failure.
                          Setting up libxcb-dri2-0:i386 (1.14-2) ...
Setting up vdpau-driver-all:amd64 (1.3-1ubuntu2) ...
Setting up libxcb-randr0:i386 (1.14-2) ...
Setting up libx11-6:i386 (2:1.6.9-2ubuntu1.6) ...
Setting up libnvjpeg-dev-11-8 (11.9.0.86-1) ...
Setting up cuda-nvcc-11-8 (11.8.89-1) ...
dpkg: dependency problems prevent configuration of nvidia-driver-520:
 nvidia-driver-520 depends on nvidia-dkms-520 (= 520.61.05-0ubuntu1); however:
  Package nvidia-dkms-520 is not configured yet.

dpkg: error processing package nvidia-driver-520 (--configure):
 dependency problems - leaving unconfigured
No apport report written because MaxReports is reached already
                                                              Setting up libxcb-dri3-0:i386 (1.14-2) ...
Setting up mesa-vulkan-drivers:i386 (21.2.6-0ubuntu0.1~20.04.2) ...
Setting up libgl1-mesa-dri:i386 (21.2.6-0ubuntu0.1~20.04.2) ...
Setting up libxext6:i386 (2:1.3.4-0ubuntu1) ...
Setting up libxxf86vm1:i386 (1:1.1.4-1build1) ...
Setting up libcublas-dev-11-8 (11.11.3.6-1) ...
Setting up libcurand-dev-11-8 (10.3.0.86-1) ...
Setting up libcufile-dev-11-8 (1.4.0.31-1) ...
Setting up libegl-mesa0:i386 (21.2.6-0ubuntu0.1~20.04.2) ...
dpkg: dependency problems prevent configuration of cuda-runtime-11-8:
 cuda-runtime-11-8 depends on cuda-drivers (>= 520.61.05); however:
  Package cuda-drivers is not configured yet.

dpkg: error processing package cuda-runtime-11-8 (--configure):
 dependency problems - leaving unconfigured
Setting up libxfixes3:i386 (1:5.0.3-2) ...
No apport report written because MaxReports is reached already
                                                              Setting up cuda-compiler-11-8 (11.8.0-1) ...
Setting up libegl1:i386 (1.3.2-1~ubuntu0.20.04.2) ...
dpkg: dependency problems prevent configuration of cuda-11-8:
 cuda-11-8 depends on cuda-runtime-11-8 (>= 11.8.0); however:
  Package cuda-runtime-11-8 is not configured yet.

dpkg: error processing package cuda-11-8 (--configure):
 dependency problems - leaving unconfigured
Setting up libnvidia-decode-520:i386 (520.61.05-0ubuntu1) ...
No apport report written because MaxReports is reached already
                                                              dpkg: dependency problems prevent configuration of cuda-demo-suite-11-8:
 cuda-demo-suite-11-8 depends on cuda-runtime-11-8; however:
  Package cuda-runtime-11-8 is not configured yet.

dpkg: error processing package cuda-demo-suite-11-8 (--configure):
 dependency problems - leaving unconfigured
Setting up libglx-mesa0:i386 (21.2.6-0ubuntu0.1~20.04.2) ...
No apport report written because MaxReports is reached already
                                                              Setting up libglx0:i386 (1.3.2-1~ubuntu0.20.04.2) ...
dpkg: dependency problems prevent configuration of cuda:
 cuda depends on cuda-11-8 (>= 11.8.0); however:
  Package cuda-11-8 is not configured yet.

dpkg: error processing package cuda (--configure):
 dependency problems - leaving unconfigured
Setting up cuda-libraries-dev-11-8 (11.8.0-1) ...
No apport report written because MaxReports is reached already
                                                              Setting up libnvidia-encode-520:i386 (520.61.05-0ubuntu1) ...
Setting up libgl1:i386 (1.3.2-1~ubuntu0.20.04.2) ...
Setting up cuda-visual-tools-11-8 (11.8.0-1) ...
Setting up libnvidia-gl-520:i386 (520.61.05-0ubuntu1) ...
Setting up cuda-tools-11-8 (11.8.0-1) ...
Setting up libnvidia-fbc1-520:i386 (520.61.05-0ubuntu1) ...
Setting up cuda-toolkit-11-8 (11.8.0-1) ...
Setting alternatives
Processing triggers for mime-support (3.64ubuntu1) ...
Processing triggers for gnome-menus (3.36.0-1ubuntu1) ...
Processing triggers for libc-bin (2.31-0ubuntu9.16) ...
Processing triggers for man-db (2.9.1-1) ...
Processing triggers for dbus (1.12.16-2ubuntu2.3) ...
Processing triggers for desktop-file-utils (0.24-1ubuntu3) ...
Processing triggers for initramfs-tools (0.136ubuntu6.7) ...
update-initramfs: Generating /boot/initrd.img-5.15.0-117-generic
Errors were encountered while processing:
 nvidia-dkms-520
 cuda-drivers-520
 cuda-drivers
 nvidia-driver-520
 cuda-runtime-11-8
 cuda-11-8
 cuda-demo-suite-11-8
 cuda
E: Sub-process /usr/bin/dpkg returned an error code (1)
```


https://blog.csdn.net/sdbyp/article/details/139853774
重启之后按照这个来！感觉要成功了

![[Nvidia_fig10.png]]

牛眼泪了.
