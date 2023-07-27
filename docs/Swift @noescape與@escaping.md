# Swift @noescape與@escaping

Swift 1.2之後，就推出了@noescape語法，用來修飾閉包參數。但我想或許有些人跟我一樣，直到換了Swift 3.0後才知道有這東西存在。事實上，在Swift 3之後，所有的函式參數，只要是閉包都預設為`@noescape`。如果你的閉包會「逃離」，你必須顯示地加上`@escaping`修飾詞，否則編譯就會出錯。

那麼，到底是在逃離些什麼？什麼又是`@noescape`，`@escaping`呢？

這裡有一篇很棒的[參考](http://nshint.io/blog/2015/10/23/noescape-attribute/)，推薦大家閱讀

> 作為一個傳入參數，若該閉包在函式返回後才被執行的話，則該閉包就是在逃離函式。(A closure is said to escape a function when the closure is passed as an argument to the function, but is called after the function returns.) - [蘋果官方文件 ](https://developer.apple.com/library/content/documentation/Swift/Conceptual/Swift_Programming_Language/Closures.html)

白話一點，當一個closure作為參數傳入函式，若該closure的生命週期在該函式返回時也跟著結束，就不算逃離。

##@noescape

```swift
func doSomething(callback:()->Void) {
    callback()
}
let onComplete:()->Void = { debugPrint("executed") }
doSomething(callback: onComplete) // executed
```

這個範例中，函式返回的當下，`callback`參數的生命週期就結束了。所以並沒有逃離函式。但如果這個closure被函式外部retain，或者捲入asyn dispatch queue，就他的生命週期就會超出函式，也就是「逃離」該函式，因此被叫做逃離閉包。例如

##@escaping

```swift
class SomeClass {
    var callback:(()->Void)?
    func doSomething(callback:()->Void) { 
        self.callback = callback  // error: 閉包逃離該函式
    }
}
let someObj = SomeClass()
someObj.doSomething(callback : onComplete) 
```

上面這例子在swift 3裡無法通過編譯，因為閉包`onComepete`逃離了函式`doSomething`，被`someObj`retain，有可能在函式結束後才被呼叫，所以必須明確標出「這是個會逃離的閉包參數」才行

```swift
class SomeClass {
    var callback:(()->Void)?
    func doSomething(callback:@escaping ()->Void) { // 加上逃離修飾詞
        self.callback = callback  
    }
}
let someObj = SomeClass()
someObj.doSomething(callback: onComplete) 
```

同理，如果閉包被放進async dispatch queue，則該閉包也會被queue retain，同樣可能在函式結束後才被執行，因此也算是「逃離」。

## @noescape有什麼限制

1. 不能在函式外儲存
2. 不能進async dispatch queue
3. 不能丟進其他non-`@noescape`參數

提醒一下，把`@noescape`閉包傳到其他`@noescape`參數是可以的，一連串不會逃離的傳值，最終還是不會逃離

```swift
func foo(@noescape code:(() -> String)) -> String {
    return bar(code)
}
func bar(@noescape code:(() -> String)) -> String {
    return code()
}
```

## 為什麼Swift 3要這樣設計，有何好處？

很多時候，閉包被當做參數傳入函式，但是往往我們並不曉得該閉包會如何被使用、以至於無從得知它的生命週期。閉包作為Swift的一等市民，使用頻率之高、範圍之廣，皆不在話下。若整個project充斥著不知其生命週期的閉包，到處流竄，那恐怕會是一場災難。因為閉包可以「捕獲」外部變數，如果閉包的生命週期無法預料，那同樣也無法預料這些被捕獲變數的生命週期，就很可能導致memory leak。

舉個例子，假設swift 2.2

```swift
let user = User()
anotherUser.follow(user, onCompletion: { _ in
    user.followerCount = user.followerCount + 1
})
```

`onCompletion`閉包執行完後，`user`被release了嗎？

根本無從得知，因為你無從得知`onCompletion`閉包的生命週期，它很可能在`follow`函式裡被他人retain，所以你也無從得知`user`的生命週期。即便看起來好像閉包一執行完，`user`就該被release。

如果compiler可以清楚知道傳入的閉包，不會「逃離」傳入函式，compiler就能預期它的生命週期，因此能做出很多優化，例如放進stack管理。

此外，一個不會逃離的閉包，必定也不會導致循環引用。所以不需在閉包內明確寫出`self`，當然也就更不需要`[weak self]`。

## 但是

此時swift 3.0.1 compiler在編譯時，在函式內部儲存closure也會構成逃離條件：

```swift
func doSomething(callback:()->Void) {
    let c = callback // error: non-escaping parameter 'callback' may only be called
    c()
}
```

此例中，變數`c`並不會在函式返回後被執行，`callback`生命週期也從未脫離函式本身，理論上完全滿足「不逃離」的基本條件。但compiler還是給錯誤，從錯誤訊息來看，很顯然Swift 3的compiler設計團隊，僅僅檢查閉包的reference count，而不是衍伸的生命週期，所以這根本是一種偷懶。從設計語言的角度思考，這樣的限制顯得多餘，或許在將來會得到改善。

## 結論

總而言之，閉包的生命週期至關重要，因為閉包可以捕獲外部變數，又是Swift裡的一等公民，而`@ escaping `強迫開發者在設計的當下，清楚思考閉包的生命週期，進而防止不必要的內存泄露，我覺得是好設計！
