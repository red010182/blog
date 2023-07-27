# cpanel 上使用 NodeJS的坑

很少使用cpanel，最近因為一個項目不得不用，稍微紀錄一下心得
cpanel是一個管理伺服器架站的工具，以前php時代的伺服器主流管理套件，本身也是一個web。

##### cpanel建議的NodeJS安裝教程的問題

1. 沒有pm2
2. 版本不是最新，似乎也不能指定node版本
3. 不確定有沒有cluster功能

##### 安裝nvm、nodejs、pm2

cpanel的背後也是一台linux，我們完全可以繞過cpanel自行安裝這些。

1. 使用cpanel的user ssh登入主機
2. 安裝nvm、nodejs、pm2
3. 啟用app，測試一下`http://domain.com:${port}`

##### Apache反向代理與SSL

nodejs一般來說都使用反向代理，這邊也不例外。我們需要反向代理，也需要SSL，而cpanel有一套類似`let's encrypt`的生成SSL證書功能

cpanel後台 > SSL狀態 > auto run SSL(自動生成)

生成的過程需要認證DNS，所以需要在http://domain.com底下建一個臨時的txt檔以驗證DNS所有權，如果採用反向代理這個驗證肯定會失敗，因為沒法正常拿到txt檔內容。即便暫時關閉反向代理來生成SSL，之後也必須每三個月更新一次，不可能每三個月手動處理一次，所以此路不通。

好在DNS驗證只需要http，不需要透過https驗證，所以真正解決之道是：http採用一般代理，https採用反向代理

具體做法是在以下目錄新增一個設定檔，檔名可以隨意
`vim /etc/apache2/conf.d/userdata/ssl/2_4/${user_name}/${domain}/api.conf`

```
#Apache Reverse Proxy
SSLProxyEngine on

<Location />
ProxyPass http://localhost:3000/
ProxyPassReverse http://localhost:3000/
</Location>
```

cpanel會把以上內容包進`<VirtualHost>`裡面，所以這邊記得別加。注意別再`/etc/apache2/conf.d/userdata/std/2_4/${user_name}/${domain}/`裡面建設定檔，這是http的反向代理設定。
