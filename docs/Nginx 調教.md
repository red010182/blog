# Nginx 調教

### 壓力測試

```
ab -r -c 1000 -n 10000 http://example.com/
-r: 發生錯誤也不中斷
-c: 併發request數量
-n: 總request數量
```

如果出現too many request錯誤, 查看

```
ulimit -a
```

server就算能負荷，你的local machine還不一定能接收如此多的request，把接收request數量條大一點

```
ulimit -n 10000
```

### 查看cache hit/miss

```
curl -I http://example.com

HTTP/1.1 200 OK
Server: nginx/1.13.5
Date: Thu, 21 Sep 2017 04:07:17 GMT
Content-Type: text/html; charset=UTF-8
Connection: keep-alive
Vary: Accept-Encoding
X-Powered-By: PHP/5.6.31
Expires: Thu, 19 Nov 1981 08:52:00 GMT
Cache-Control: no-store, no-cache, must-revalidate, post-check=0, pre-check=0
Pragma: no-cache
X-Cache: MISS
```

### 參考

* [Digit Ocean調教教學](https://www.digitalocean.com/community/tutorials/how-to-optimize-nginx-configuration)
* [Linode調教教學](https://www.linode.com/docs/web-servers/nginx/configure-nginx-for-optimized-performance)
* [nginx redirect](https://www.bjornjohansen.no/nginx-redirect)
* [多核進程](http://www.1990y.com/nginx-worker-process-affinity/)

以下是PHP Cache
https://www.digitalocean.com/community/tutorials/how-to-setup-fastcgi-caching-with-nginx-on-your-vps

https://serversforhackers.com/c/nginx-caching

http://dirkgroenen.nl/blog/2015-05-28/setup-a-stunning-nginx-php5-fpm-cache-with-fastcgi/

more: https://www.nginx.com/resources/admin-guide/content-caching/

more on docker: https://www.awaimai.com/2120.html
