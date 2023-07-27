# google workspace send mail

### SMTP

透過SMTP用程式寄google workspace郵件

1. 使用者登入並開兩步驗證
   ![Screen Shot 2020-11-20 at 11.56.40.png](https://upload-images.jianshu.io/upload_images/2918954-98b756e639a9e2ac.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

2. 新增應用程式密碼
   
   ```
   host: 'smtp.gmail.com',
   port: 587,
   username: 'username@your-domain.com',
   password: '應用程式密碼',
   from: 'admin@domain.com'
   ```

### SMTP轉發

透過google寄任意寄件地址，類似google版的SES。Google workspace => Application => Gmail => Advanced Settings => SMTP Relay

 ![Screen Shot 2020-11-20 at 11.52.24.png](https://upload-images.jianshu.io/upload_images/2918954-f1b151371800f535.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

允許的寄件位置：

1. 僅限我的網域中已註冊的Apps使用者(google workspace user)
   
   ```
   host: 'smtp-relay.gmail.com',
   port: 587,
   username: 'admin@domain.com',
   password: 'password',
   from: 'some-exist-username@your-domain.com'
   ```

2. 僅限我的網域中的位置(同網域即可)
   
   ```
   host: 'smtp-relay.gmail.com',
   port: 587,
   username: 'admin@domain.com',
   password: 'password',
   from: 'non-exist-username@your-domain.com'
   ```

3. 不限位置(寄件地址隨你key)
   
   ```
   host: 'smtp-relay.gmail.com',
   port: 587,
   username: 'admin@domain.com',
   password: 'password',
   from: 'non-exist-username@whatever-domain.com'
   ```
