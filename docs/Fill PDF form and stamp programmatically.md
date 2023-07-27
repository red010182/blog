# Fill PDF form and stamp programmatically

** 方法一：利用HTML自行創建PDF **

HTML製作表單很容易，HTML畫面轉PDF也很容易，但是當你要轉出的PDF內容格式很複雜時，刻HTML卻不那麼容易

例如這種

![Pizza-Hut-Job-Application-Form-550x4942-550x494.png](http://upload-images.jianshu.io/upload_images/2918954-a40deff0e73d4d44.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

或這種
![Casual-Employee-Contract-Form.jpg](http://upload-images.jianshu.io/upload_images/2918954-daf100e42fb1d562.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

這種表格很明顯是為手寫而設計的，真的電子化的表單，根本不需要這麼複雜。而很不幸地，正式場合常常會遇到這種情況，而且對方也不太可能改變他們慣用的表單格式。這種複雜的表格要用HTML去刻真是挺累，刻完後轉換時格式會不會跑掉也是個大問題，總之看上去是條荊棘之路，再找找有沒有別的辦法。

** 方法二：解析PDF檔，再用PDF語法填入資料 **
有些工具可以幫你解析出PDF檔的內容，包括欄位、頁面尺寸、頁數...等等，例如

```
pdftk file.pdf dump_data
```

但不幸的是，很多時候會拿不到，或許因為該PDF是掃瞄而來，又或者是其他，反正我試了幾個總有些PDF拿不到表格欄位，也只能暫時先放棄這條路了。

### 方法三：合成PDF檔

這是最土炮的做法，但目前是最有效的。就是創造一個全新的PDF檔案，然後跟原本的底稿合成一個新的PDF檔，有點像兩張圖片疊起來變成第三張圖片。

優點是不用管底稿的格式，表格再複雜也無所謂，壓文字、圖片都沒問題，缺點也很明顯，只能透過x, y座標決定位置，像編輯圖片那樣。

##### 安裝pdftk

Install `pdftk` first.

##### 找到x, y座標

有了底稿，還必須知道要把文字或圖片壓在哪個位置，目前我找不到任何PDF閱讀器有提供座標的，所以有點hack

先用`pdftk file.pdf dump_data`找到頁面的長寬

安裝gimp，用gimp打開檔案，然後輸入頁面長寬，然後左下方就會顯示PDF頁面裡滑鼠的x,y座標。

##### 用程式創建PDF檔

以nodejs為例，利用`pdfkit`套件，請自行google一下教學。

這邊的重點是，必須指定中文字體，才能夠正確產生中文，否則會是亂碼。不管是自己去download還是用系統內建的都行，建議用.ttf格式，官方說明有支援.ttc但我試不出來，用.ttf簡單一些。

ps. ttc是許多ttf檔的collection，為字型家族的集合(light, medium, bold....等等)，使用ttc時，還必須額外指定明確的font名稱，但就是這個font名稱我根本不知道怎麼取得，用OSX的font book裡的名稱或是cmd+i裡顯示的font name也沒用，總之讓事情簡單一點，直接載一個中文ttf檔比較快。

[懷源黑體](https://github.com/minjiex/kaigen-gothic)不錯

app.js

```
const fs = require('fs')
const PDFDocument = require('pdfkit')
const pageOption = {
    size: [595.32, 842.04],
    margins: {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
    }
}
const doc = new PDFDocument(pageOption)
doc.pipe(fs.createWriteStream('text.pdf'))

doc.font('./KaiGenGothicTW-Medium.ttf') // 選個中文字體
    .fontSize(12)
    .text('劉德華', 148, 182)
    .text('A122000999', 476, 184, {width: 80})
    .text('0982333888', 148, 207)
    .text('75', 475, 207)
    .text('06', 504, 207)
    .text('05', 531, 207)
    .text('台北市中正區天堂路100巷82號', 148, 232)
doc.image('./stamp.png', 520, 150, { fit: [50, 50] })
    .rect(520, 150, 50, 50)

doc.end()
```

run

```
node app.js 
pdftk background.pdf multistamp text.pdf output merge.pdf;
```

#### 注意

`pdfkit`有個bug，如果文字過長被自動wrap而此時剛好又在margin邊上要在wrap一次，就會進入無窮迴圈，建議把margin都設為0。

### Nice Reference

##### PDFNetJS

https://blog.pdftron.com/2015/11/10/pdfnetjs-html5-pdf-viewer-and-editor/
showcase(also iOS, Android): https://www.xodo.com/#

##### adobe solution

https://forums.adobe.com/thread/741050

##### iText

http://itextpdf.com/
https://www.codeproject.com/Tips/679606/Filling-PDF-Form-using-iText-PDF-Library

Programatically Filling Out PDFs in Java
http://www.daedtech.com/programatically-filling-out-pdfs-in-java/

##### pdftk

https://superuser.com/questions/540388/how-can-i-stamp-every-page-of-a-pdf-except-the-first-one
*more in detail*: https://mitcho.com/blog/how-to/stamp-pdfs/
doc: https://www.pdflabs.com/tools/pdftk-server/
https://www.pdflabs.com/docs/pdftk-man-page/#dest-op-dump-data-fields-utf8

##### pdf-filler

server written by ruby, under the hood using `pdftk`
https://github.com/GSA/pdf-filler

##### stackoverflow

- https://stackoverflow.com/questions/2803331/how-to-edit-pdfs-in-javascript  
- https://stackoverflow.com/questions/31892361/how-to-edit-and-update-the-pdf-file
- https://stackoverflow.com/questions/3108704/how-to-fill-out-a-pdf-file-programatically  
- https://stackoverflow.com/questions/30508966/saving-xfdf-as-pdf

##### add stamp to pdf

C#
-http://www.debenu.com/kb/programmatically-add-watermark-stamp-pdf/

php
https://stackoverflow.com/questions/9705009/how-to-add-an-overlay-stamp-to-a-pdf-file-in-php
