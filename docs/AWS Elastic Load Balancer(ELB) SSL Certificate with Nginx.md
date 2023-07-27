# AWS Elastic Load Balancer(ELB) SSL Certificate with Nginx

### Elastic Load Balancer (ELB)

負載平衡器(Load Balancer, LB)專門用來分散流量，讓每台server平均分擔工作。AWS的LB稱作Elastic Load Balancer(ELB)，分成三種ELB：

1. Web ELB：專門用在http/https。
2. TCP ELB：可自訂port。
3. Classic ELB：如果你的EC2還跑在Classic Network，而不是Virtual Private Network，就要用這種。這種是舊款的設計我們不討論。

Web ELB的好處在於，若你用https的話它會自動免費送你一個certificate(透過Amazon Certificate Manager, ACM)，我原本以為這樣一來我自己的web server就不用安裝SSL certificate，但我不知道Nginx該怎麼設定監聽https without SSL certificate，所以目前我還是在自己的web server裝買來的certificate。

#### 創建 ELB

創建Web ELB時，若你選擇監聽https，第二步他就會要求你上傳憑證，或者透過ACM幫你發一個憑證，記得新發一個憑證需要等待幾分鐘。或是你也可以上傳自己創或買的憑證。建議是直接跟ACM拿憑證，他還會自動幫你刷新憑證，而且還免費。

注意這個憑證是黏著ELB的，你是無法下載的，也無法裝在你自己的EC2裡面。ACM發的憑證只能給AWS少數的PaaS服務使用，像是ELB或Elastic Beanstalk等，ACM講白了就是服務Amazon自家的PaaS產品，你無權拿這些憑證去做壞事，喜歡搗鼓的用IaaS產品像是EC2自己去搞憑證，想省事的PaaS讓你省心到底，這不得不說真的是很高明的做法。

#### ELB的設定方式

![示意圖，注意我們是用ELB取代Nginx Load Balancer](http://upload-images.jianshu.io/upload_images/2918954-f75b57118ec7eb13.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

根據這個digital ocean的[說明](https://www.digitalocean.com/community/tutorials/how-to-set-up-nginx-load-balancing-with-ssl-termination)，理論上LB之後的連線已經不需要https了，因為自己的私網域是不會被hack的，所以我們只需要一台ELB對外https，內部自家人用http即可。

以Web ELB為例，我在ELB上掛上兩個監聽器，分別監聽80/443，將流量通通導到某個group，裡面註冊兩台80 port EC2。

就完成了上圖的config

#### Sticky Session

Session是web server為了追蹤client狀態，而在server端儲存的小資訊，與其對應的，cookie則是存在client端，兩者的目的是雷同的。通常一些比較敏感的資料會放在session而非cookie，這就導致一個問題：LB會把流量分散到多台機器，那session怎麼同步？這問題有兩個解法：

1. 用類似Redis的memory cache server方式存session。
2. 將同一個session導流到同一台機器，我們叫做Sticky Session。

第二個做法是大部份LB會用的技巧，LB會在cookie存一個mapping資訊，將session ID mapping到機器去。但ELB預設是關閉的，如果要打開這功能，必須到

```
到EC2後台的 Target Groups -> Attributes -> Edit Attributes
-> 打勾 Enable load balancer generated cookie stickiness
```

### 指向ELB: A record without IP

當一切準備就緒，準備將DNS指向load balancer，這時候你會發現ELB沒有IP，只有對外網址，而DNS的A record通常只能指定IP，那該怎麼辦？兩招

1. 如果你的DNS provider支援CNAME flattering功能：root DNS直接CNAME指向ELB public DNS。
2. 否則：root DNS forwarding至www subdomain，然後www subdomain CNAME指向ELB public DNS。[了解更多](http://qnimate.com/pointing-domain-to-aws-elastic-load-balancing/)

舉體操作因各家DNS provider的支援程度而異，如果你是用cloudflare的話(支援CNAME flattering)，用第一種方式分分鐘搞定。

至此，我們設定了ELB, SSL, 內網連接多台EC2，DNS也正確指向load balancer(注意別直接指到EC2，否則就失去導流意義了，也沒SSL)。

### FAQ

1. 如果我的EC2有公開的public IP，是否有影響？無。
2. Auto scaling呢？不要碰，很可怕，它會自動把你的EC2 terminate。真的自動開了新機器，裡面也是「全新」的EC2，而不是copy，要你何用？
