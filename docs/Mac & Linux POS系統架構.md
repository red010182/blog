# Mac & Linux POS系統架構

### Why Mac/Linux?

相比於單機軟件，client-server的架構更為彈性，例如client可以是iPad, iPhone, Android, 或PC都行。既然是server就不會是windows。
Backend server可以是local或是cloud based。但無論如何，通常店家都會需要打印功能，不管是統一發票、電子發票、或是明細。所以讓server控制打印機(通常是熱感應或針式)是必要功能，因此切割出printing service是個不錯的選擇。

### 為何要有發票？

發票設計的初衷就是讓國稅局知道你有這筆帳，這樣政府才可以抽稅。而商家當然不想繳稅，於是國稅局就用發票獎金誘導客戶向商家索取發票，透過客戶對商家施加壓力，只要發票一開出來，國稅局的大帳本就有店家的營收紀錄，這樣一來便可以依法課稅。

### 二聯式發票

二連發票的本質，就是一式兩份，一份給客戶，一份給國稅局，有點像房屋租賃契約，一份給房東、一份給房客。其中給客戶的叫做「收執聯」，給國稅局的叫做「存根聯」，此為二聯。存根聯通常都是搜集一兩個月，再一次交給國稅局。

在台灣，大多都是使用統一發票作為二聯發票(另一種是複寫紙二聯發票，本質是一樣的)，不管是哪一種發票，都必須先去跟國稅局拿空白發票(雖說是空白但上面已經先印好發票編號了)，拿到發票之後，將存根聯以及收執聯放入發票機，然後就可以開始印了。

ps. 至於三聯發票，就是一式三份：客戶、店家、國稅局各一份。通常到了這個田地，都是用複寫紙打印比較多，因為同樣的東西印三次太麻煩了，當然複寫紙打印也有專用的印表機，這個不在今天的討論範圍內。

### 電子發票

既然目的是要讓國稅局知道這筆帳，送個API不就好了？幹嘛還印一堆，還要搜集實體紙捲交給國稅局，多麻煩？

對沒錯，這就是現在最普遍的電子發票，整個通知的過程，就是一個API搞定，發票號碼什麼的都可以透過API回傳然後再用熱感應機打印出來。其實印不印都無所謂，反正國稅局已經收到帳了，但通常還是會一並將發票號碼與明細印給客戶。

不過這個project因種種因素限制不能使用電子發票，所以今天也先不討論這個。

### 熱感應打印機原理

打印機不需要墨水你相信嗎？對，熱感應打印機讓你永遠都不用換墨水，只要使用特殊的紙張，就可以加熱打印，無需墨水，其原理是紙張表面有一層特殊材料會遇熱顯色。

### 新增印表機

Unix系統內建[CUPS](https://www.cups.org)(Common UNIX Printing System)打印系統，打開`http://localhost:631`即可新增/修改印表機。

### 使用系統指令列印(LP, LPR)

`lp`跟`lpr`都是系統內建的打印指令，建議使用較新的`lp`。

```
lp hello.txt
```

[指令介紹](https://www.computerhope.com/unix/ulp.htm)

### 如何將RS232(serial port)轉成USB？

購買connector，例如[這個](http://24h.pchome.com.tw/prod/DCAX06-A80421348?q=/S/DCAC16)
需要安裝connector驅動程式，安裝完之後會多一個虛擬的device:

```
ls /dev/usb*
> /dev/usbserial
```

之後便可對這個device送指令

### 用NodeJS發送ESC/POS指令控制印表機

安裝[node-serialport](https://github.com/EmergingTechnologyAdvisors/node-serialport)

若打印機支援ESC/POS指令集，就代表你可以透過發送askii character對它下命令，而每一個askii character其實就是一個askii code數字代碼。

例如，以EPSON RPU420打印機為例，以下是部份指令

![Screen Shot 2017-07-09 at 1.29.34 PM.png](http://upload-images.jianshu.io/upload_images/2918954-cfe7cc78ce321206.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

"ESC @"表示印表機初始化，ESC與@的askii code分別為27與64，所以

```
let reset = Buffer.from([27,64]
```

Buffer可以直接接收askii字串，而ESC/POS指令可以串連使用，所以我們把Buffer串起來的話

```
let reset = Buffer.from([27,64])
let contentBuf = Buffer.from("Hello world")
let nextPage = Buffer.from([12])
let buf = Buffer.concat(
  [reset, contentBuf, nextPage], 
  reset.length + contentBuf.length + nextPage.length
);
```

寫入serial port

```
const SerialPort = require('serialport')
let option = { baudRate: 9600, autoOpen: false}
let rpu420 = new SerialPort('/dev/tty.usbserial', option)

rpu420.open(err => {
   rpu420.write(buf), function () {
      // done
   })
})
```

值得注意的是，write函式的callback function觸發時，不代表印表機已經處理完該指令，需用`drain`指令檢查

```
let writeAndDrain = (data, onCompletionCallback) => {
  rpu420.write(data, function () {
    rpu420.drain(onCompletionCallback);
  });
}
```
