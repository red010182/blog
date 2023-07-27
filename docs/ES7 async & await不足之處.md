# ES7 async & await不足之處

從iced-coffeescript跳槽ES7後，用了一陣子ES7的async/await，發覺還是比不上iced-coffeescript的好用。直接看code吧！

假設場景一：欲發送10萬個http request，一個做完才能做下一個。

```
let urls = ["url_1","url_2", ....... ]; //假設有10萬個url
```

ES7 async/await的做法：

```
async function scene1() {  //宣告async以便用await
  try {
    for(let url of urls) {  // 注意for-of跟for-in的差別
      let result = await request.get(url); // 假設request.get返回promise
    }
  }
  catch(e) {
    console.log(e);
  }
}
```

場景二：然後你發現一個一個打實在太慢了，於是分成1000組，每組100個request，同組之內的所有request異步併發，全部做完才能做下一組。

ES7 async/await的做法：

```
let urlChunks = [              // 共1000組
  ["url_1",..."url_100"],      //每組100個url
  ["url_101",..."url_200"],
  ...
];
async function scene2() {
  try {
    for(let chunk of urlChunks) {
      let results = await Promise.all(chunk.map(c => request.get(c)));
    }
  }
  catch(e) {
    console.log(e);
  }
}
```
