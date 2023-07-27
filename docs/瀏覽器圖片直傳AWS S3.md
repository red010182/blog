# 瀏覽器圖片直傳AWS S3

都2016年了，從browser上傳個圖片到S3還這麼折騰...真想罵聲暗
折騰原因：

- s3 bucket: cors
- s3 credentials
  - upload to s3 from server
  - upload to s3 from browser
  - cognito/IAM
    - ajax: signature from backend
    - aws-sdk

#### 前端

resize原圖或縮圖都要利用canvas產生縮圖，image再轉成blob (類似檔案的物件)，而後才能上傳

#### aws

https://github.com/aws/aws-sdk-js
以下必讀:
![Screen Shot 2016-11-16 at 11.57.17 PM.png](http://upload-images.jianshu.io/upload_images/2918954-583a4f10403885f9.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

https://github.com/minio/minio-js
http://blog.tcs.de/post-file-to-s3-using-node/
https://blog.fineuploader.com/2013/08/16/fine-uploader-s3-upload-directly-to-amazon-s3-from-your-browser/#what-is-this
https://github.com/SwingDev/s3-browser-direct-upload

cognito/IAM

image resize:
https://github.com/rossturner/HTML5-ImageUploader
http://stackoverflow.com/questions/23945494/use-html5-to-resize-an-image-before-upload
https://hacks.mozilla.org/2011/01/how-to-develop-a-html5-image-uploader/
https://github.com/nodeca/pica

canvas to blob
http://stackoverflow.com/questions/4998908/convert-data-uri-to-file-then-append-to-formdata
http://stackoverflow.com/questions/13990673/upload-canvas-data-to-s3
https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toBlob
http://stackoverflow.com/questions/19032406/convert-html5-canvas-into-file-to-be-uploaded

aws s3 debug tool
http://s3.amazonaws.com/doc/s3-example-code/post/post_sample.html
