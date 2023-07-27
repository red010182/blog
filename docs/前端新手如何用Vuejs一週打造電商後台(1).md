# 前端新手如何用Vuejs一週打造電商後台(1)

##序
最近因工作需要，必須打造一個web-based的電商後台，具體功能包括 
商品發佈、圖片壓縮上傳、使用者登入、分頁管理、出貨管理...等等。

由於小弟並非前端程序猿，不常寫js，更是第一次寫ES6，然站在巨人們的肩膀上，最終也只用一週多的時間完成任務，一路上學到很多，體驗到學前端的樂趣，同時也走過一些坑，僅此紀錄，幫助自己也希望幫助別人。

先上結果

![商品列表](http://upload-images.jianshu.io/upload_images/2918954-dc59fb802ae2b448.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

![新增/編輯](http://upload-images.jianshu.io/upload_images/2918954-599e4b92c8de13b7.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

整個project技術棧為：

- 前端: Vuejs + Vue-Router + eleme UI + ES6(with Babel) + Webpack
- 後端: Nodejs + Express + MySQL + Coffeescript

### 功能描述

1. 商品列表可在列表狀態下直接編輯分類欄位
2. 新增/修改商品：應用modal/selector/switch/text/tooltip等基本UI元件，在不轉跳頁面情況下編輯商品內容。
3. 瀏覽器直接上傳圖片至s3，無需經過backend server，並自動產生縮圖。以及實現排序/刪除。
4. 登入/登出/記得我等功能。

#####能學到什麼？

- 從實作商品列表學到async request撈資料、處理分頁、深度使用table。
- 新增/修改商品學到form的各種填入、validation、以及更多的UI元件。
- 圖片處理學到如何用canvas產生縮圖、理解亞馬遜的各種機制包括IAM、Cognito、s3 CORS、endpoint、certificate等各種設定，並使用aws-sdk從瀏覽器直接上傳圖片。**這部分是最頭痛也最難搞的！**
- 登入/登出系統學到基本加密傳輸、server端驗證、埋token，自動登入用到瀏覽器端local storage...等等。

### 選擇前端框架： Vuejs vs React

框架的選擇上，只考慮[ReactJS](https://github.com/facebook/react)跟[Vuejs](https://github.com/vuejs/vue)，Angular 2.0不考慮。理由是ReactJS能透過ReactNative跨到移動端，而Vuejs同樣可能透過[Weex](https://github.com/alibaba/weex)跨到原生移動端，光這點就足以淘汰Angular了。即使目前我只需要web後台，但考慮到未來的延展性，React跟Vue遠勝Angular。

至於React跟Vue到底該怎麼選？網路上已有許多討論，兩者同樣都是優秀的前端框架，React在github上5.4萬顆星，vuejs則是3.4萬顆星，考慮到vuejs比較晚發展，這成績可以說是旗鼓相當。兩者的社群都非常活躍，開源組件目皆不暇給，例如Vue的[Element](https://github.com/ElemeFE/element)(PC端)、[Mint UI](https://github.com/ElemeFE/mint-ui)(移動端)，以及[Vux](https://github.com/airyland/vux)(類微信)，以及更多在[Awesome Vue Projects](https://github.com/vuejs/awesome-vue)。

兩者都是focus在view層面的處理，不一樣的是，Vue擁抱HTML，而React則擁抱Javascript。這話該怎麼理解呢？以iOS來譬喻的話，就是頃向於用xib或storyboard來刻view，邏輯才用code來實作；以Android來比喻的話，就是用xml來刻view，邏輯才用code來實作。不管是iOS的xib還是Android的xml，都是**view模板**的概念，Vuejs正是基於此概念。

而React更偏向全都用js code來寫view，如果你喜歡用code生成view的話，或許React會是更好的選擇。最佳使用React的方式是寫jsx，一種模板內嵌的js。由於js原來就不是設計來寫view模板的，為了讓js更方便寫view，還因此搞了一個jsx的語法。

在mobile端，我個人喜歡用模板的方式去寫view，iOS跟Android都是。這樣程式碼更乾淨，也能夠更直觀地展現view。所以在前端，我依循此邏輯，最終選擇了vue。另一部分也因為它結構似乎更優雅，而我對優雅的事物是沒什麼抵抗力的。值得注意的是，用模板的方式寫view，不代表不能用code處理view，事實上vue也支援用jsx刻view，但我從沒用過。

於是就開啟了我的Vue學習之路。

附帶一提，Vue作為快速崛起的後起之秀，甚至獲得阿里團隊的青睞，他們基於vue之上打造weex框架，試圖一次coding搞定web+原生iOS/Android。不過這不是今天的重點，就不展開了。

這麼強大的Vue，如果有人說他比jQuery還好學，[你相信嗎](https://medium.com/js-dojo/vue-js-is-easier-to-learn-than-jquery-abbbb9c12cf8#.lchd22n71)？根據我自己這一兩週的體驗，確實不困難，相較於iOS/Android簡單多了。

### 選擇後端框架

後端我就直接採用了熟悉的Nodejs+Express+MySQL+Coffeescript，由於本文主要討論前端學習過程，這部分就不展開了。

##基礎篇

所有學習資料中，最重要的兩份文檔，莫過於官方的[指南](https://cn.vuejs.org/v2/guide/components.html)以及[Vue-Router](http://router.vuejs.org/zh-cn/)，這兩個連結請直接打開並放在瀏覽器前兩分頁，估計你一週內都不會關閉它們。

建議先從頭到尾瀏覽過一次[指南](https://cn.vuejs.org/v2/guide/components.html)，前面的概念都很容易懂，其中[Vue實例](https://cn.vuejs.org/v2/guide/instance.html)、[組件](https://cn.vuejs.org/v2/guide/components.html)與[單文件組件](https://cn.vuejs.org/v2/guide/single-file-components.html)必須詳看。這份指南寫得很棒，但有一個小問題，文件裡面的範例，幾乎都是用js生成Vue實例，然而真正在開發專案時幾乎都是用.vue檔(單文件組件)去生成Vue實例，而.vue檔的語法跟js有些微不同，老實說我也不知道為何要如此設計，對於剛入門的新手可能會覺得有點卡，但這其實兩者是同一回事，需要小心語法差異。

讀完了基礎文件之後，務必看兩個真實project。其一為[Vue.js+LeanCloud单页面博客](https://github.com/jiangjiu/vue-leancloud-blog)，僅用兩個組件，不到一兩百行的核心代碼就實現了Single Page Blog，非常經典。其二是[Hackernews Clone](https://github.com/vuejs/vue-hackernews)，看看如何用Vue輕鬆山寨hackernews。比較需要注意的是，Hackernews Clone用的是vue1.x的版本，有些語法或config會不太一樣，但是整體的架構還是可以學習的。務必把這兩個範例，從github上拉下來，整份讀，不一定要run起來，但是要試圖去理解文件的架構，尤其是各種config檔，這些細節指南是不會告訴你的。

以上資料，大約會花你一至兩天時間。

看完這些文件後，對於資料綁定、路由、組件、asyn操作相信都有了基礎的認識。準備好跨出第一步吧！

### webpack, babel, eslint

且慢！在你踏進去第一步之前，必須先大致搞懂這三個名詞，有點複雜我知道，但相信我，這時間值得你投資。

我簡單說明一下：

- webpack: 將開發時所用到的許多檔案(HTML, css, sass, scss, .vue, .coffee, jade...等等)，包括套件的相依引用，通通打包成一個檔案。最後輸出成一個檔案例如build.js，只需要載入這一個就搞定了。有點像是C++ compile程式碼，最後變成一個執行檔的概念。
- Babel: 讓看不懂ES6的瀏覽器讀懂你寫的ES6。其實就是一個轉譯。
- ESLint: 由於JS本身語法設計上的問題，容易寫出bug。這工具就是在幫你檢查由coding style可能產生潛在bug。

**什麼時候需要用webpack? **

如果你用.vue寫component，
如果你想用sass, scss等高階css框架
如果你想用jade

所以，基本上你會發現大家都用webpack，既然如此必須要特別留意`webpack.config.js`，裡面詳細描述了各種文檔需用什麼工具去轉譯。如果用vue-cli啟動project的話，會自動幫你件好一個基礎的webpack設定，大多時候你不太需要更動它。但有許多npm套件需要轉譯.json檔，如果你會用到的話，記得告訴webpack

```
// ps. 有些舊版webpack的loader名稱，後綴不加"-loader"
rules: [
  ...
  {
    test: /\.json$/, 
    loader: "json-loader"
    // exclude: /node_modules/
  }
]

//package.json
"json-loader": "^0.5.4"
```

### vue-cli

啟動project前，請先去安裝[vue-cli](https://github.com/vuejs/vue-cli)，先用別人的best practice搭建一個框架，暫時先在框架內學習基本套路。vue-cli是vuejs作者開發的一套工具，他發現許多新手的vue問題根本就不是vue問題，而是把webpack、vue、babel、各種loader等阿哩阿雜工具「串起來」的設定問題。於是開發了一套小工具，迅速幫你搭好一個可立即運行的框架，以便新手跳坑。vue-cli能幫你搭建許多種框架，有非常完整的，也有非常簡單的，建議先搭建一個最簡單的版本開始，完整版的框架對新手而言(例如我)非常複雜，令人一開始就會陷入為了要寫個小project得先學會A、B、C、D、E、F...等前置知識，直接死在起跑點。

### 啟動

未完待續
