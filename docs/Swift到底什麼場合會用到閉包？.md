# Swift到底什麼場合會用到閉包？

一位網友問到：「閉包(Closure)這東西，到底有何用處，在Swift裡我們會在哪些場合用到？」

這問題，著實令我想起初學閉包時的各種疑惑，而且不只我，Stackoverflow上，一個閉包的基礎[問題](http://stackoverflow.com/questions/111102/how-do-javascript-closures-work)竟然有6000多個讚，足見有多少新手被閉包給坑過。

物件導向(Object-Oriented)的思維引領了世界數十年，但人們越來越覺得「純」物件導向在許多應用場合顯得龐大而臃腫，於是有些人開始探索更優雅的方法，像是近年特夯的functional programming。然而，完全放棄OO也是不切實際的作法，大型的工程還是非常需要OO的架構。於是，在黑暗的盡頭，object-oriented結合functional programming的做法似乎隱隱發光。

於是，C++有了lambda，Java 8也有了，新的語言如Swift更是直接把閉包提升至「一等公民」，閉包可以是變數，函數也只是閉包的一種特例。更不用說其他script language，幾乎無一不支持閉包。

關於閉包這東西，已有太多解釋，我不打算再重敘，今天只想聊聊，在真實的iOS開發過程中，有哪些地方應用了閉包。如果你想從理論上更深入了解，[函數式Swift](https://store.objccn.io/products/functional-swift/)是一本好書。

以下是我在真實產品開發過程中的親身案例，以Swift 3.0為例，`map`、`reduce`那些就不提了，這邊只提我自己定義過的閉包。事實上，事情演變到這種田地，沒有閉包我已經不知道該怎麼coding了...。

#### UIButton Action Block

UIButton的標準用法，就是`addTargetAction`，你必須在某一處定義button(無論是code或xib)，然後在別處實作button的行為

```
class SomeClass {
    var button = UIButton()
    func someInitFunc() {
        button.addTarget(target: self, action: #selector(buttonAction:), for: 
.touchUpInside)
    }
    func buttonAction(sender:UIButton) {
        // do something...
    }
}
```

為什麼就不能像Java一樣，在定義button的當下，同時也定義UI觸發行為呢？UIButton的存在難道不是為了執行某幾行程式碼？而你必須還要先定義一個新的函式，然後把button跟函式連接好才能完成。如此簡單的事情為何要搞得複雜？

**既然函式就是閉包，而閉包可以是變數**，那為何不直接定義一個閉包，然後存在button裡，一旦user觸發，就自動執行，事情不就解決了！所以我為UIButton掛了一個extension

```
// UIButton+Block.swift
import UIKit
import ObjectiveC

private var ActionBlockKey: UInt8 = 0
typealias ButtonActionBlock = (_ sender: UIButton) -> Void

private class ActionBlockWrapper : NSObject {
    var block : ButtonActionBlock
    var controlEvent: UIControlEvents
    init(controlEvent:UIControlEvents, block: @escaping ButtonActionBlock) {
        self.controlEvent = controlEvent
        self.block = block
    }
}

extension UIButton {
    func addTouchUpInsideAction(_ block: @escaping ButtonActionBlock) {
        addTargetActionBlock(.touchUpInside, block: block)
    }
    func addTargetActionBlock(_ controlEvent:UIControlEvents, block: @escaping ButtonActionBlock) {
        objc_setAssociatedObject(self, &ActionBlockKey, ActionBlockWrapper(controlEvent: controlEvent, block: block), objc_AssociationPolicy.OBJC_ASSOCIATION_RETAIN_NONATOMIC)
        addTarget(self, action: #selector(actionBlockHandler), for: controlEvent)
    }
    func actionBlockHandler(_ sender:UIButton) {
        if let wrapper = objc_getAssociatedObject(self, &ActionBlockKey) as? ActionBlockWrapper {
            wrapper.block(sender)
        }
    }
}
```

這個extension做兩件事，把touchEvent跟閉包存在button裡，透過`associatedObject`在runtime時動態掛載到button身上。由於Swift的閉包無法直接用`objc_setAssociatedObject `儲存(想想為什麼不行？)，所透過一個wrapper class去包。

有了這個`extension`之後，以後我們就可以這樣寫了

```
func someInitFunc() {
    button.addTargetActionBlock(.touchUpInside) {
        // do something
    }
}
```

甚至更精簡一點

```
button.addTouchUpInsideAction() {
    // do something
}
```

**再也不需要為了一個button的行為去定義一個新function**。程式碼變得更簡潔，邏輯更清晰，因為在button定義的當下你就知道它的行為。然缺點是一次只能儲存一種targetAction，但根據我的經驗，已足以囊括95%的UIButton使用場景。

此外，這個button將會retain該閉包，使用時需小心cyclic reference，務必用`weak/unowned`修飾`self`（如有用到的話）。例如

```
class SomeVC:UIViewController {
    var button = UIButton()
    func viewDidLoad() {
        super.viewDidLoad()
        button.addTouchUpInsideAction() { [weak self] in // 務必使用weak/unowned self
            self?.title = "hello world"
        }
    }
}
```

上例中需避免 `self -> button -> addTouchUpInsideAction closure -> self` 產生的cyclic reference。

#### UITableViewCell Delegate

cell的任何UI響應，常常透過delegate方式回ViewController處理，幾乎每種cell都標準配置一個xxxCellDelegate的protocol，過程非常瑣碎。你想想，在xib或storyboard上畫了一個button，`@IBAction`傳回cell，然後再delegate出去，delegate時還要先定義一個protocol，以確保對方有相對應的方法可呼叫，然後delegate對象要宣稱支持這個protocol，並開一個新function去實作，最後再`cell.delegate = self`。

~~歡迎來到Delegate Oriented Programming~~

**我只不過他媽的點了一個按鈕，想做點什麼卻先要折騰這些，不覺得煩嗎？**

核心問題在於，UI事件的發生地點(Cell)跟處理的地方(通常是ViewController)是不同物件，所以需要定義一個介面才能讓兩者溝通。然而相同的地方在於，UI響應其實就是對應一段函式去執行罷了，那麼為何不直接把閉包丟進去直接執行就好，傳來傳去，有必要嗎？

```
class UserCell: UITableViewCell, UserCellConfigurable {
    @IBOutlet weak var nameLabel:UILabel!
    @IBOutlet weak var followButton:UIButton!
    override func awakeFromNib() {
        followButton.setTitle("Follow", for: .normal)
    }
}
protocol UserCellConfigurable {
    static func config(_ cell:UserCell, user:User, followAction:(()->Void)?)
}
extension UserCellConfigurable {
    static func config(_ cell:UserCell, user:User, followAction:(()->Void)?) {
        cell.nameLabel.text = user.label
        if let followAction = followAction {
            cell.followButton.addTouchupInsideAction(followAction)
        }
    }
}
// ViewController
func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
    let cell = tableView.dequeueReusableCell(withIdentifier: cellID, for: indexPath) as! UserCell
    let user = users[indexPath.row]
    UserCell.config(cell, user) { (user) in
        user.followerCount += 1
    }
    return cell
}
```

這樣的做法簡潔多了，不再需要delegate，也不必讓`cell`持有`user`物件，當定義`followAction`閉包的同時，它已經「捕獲」了外部的`user`變數，所以當`followButton`被點擊時，就可以直接對`user`進行處置，同時解決了delegate與model傳遞的問題。

雖然定義了一個protocol，但這並不是為delegate而生的，而是透過extension直接實作protocol，進一步降低耦合，即便不定義這個protocol依然可行。可以說，任何類別只要宣稱UserCellConfigurable，就有能力去config，而且無需額外實作。當然最適合擔當此角色的人，無疑就是`UserCell`自己了。

另外有種做法是MVVM，我看過Realm有一個[演講](https://realm.io/news/doios-natasha-murashev-protocol-oriented-mvvm/)，深受啟發，推薦大家。雖然概念不錯，但仔細想想，覺得太過over engineering了，除非model有很多狀態而且會連動到view，否則殺雞是不需用牛刀的。一講到MVVM就會有人想到RxSwift，不過這已經超出此文討論範圍了，以後有機會再聊。

未完
