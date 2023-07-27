# MySQL 調教

### 查看Query Performance

```
SET PROFILING=1;
SHOW PROFILES;
SHOW PROFILE CPU FOR QUERY 2;
```

[參考](https://dev.mysql.com/doc/refman/5.7/en/show-profile.html)

### 觀看即時process

```
SHOW FULL PROCESSLIST;
```

### Buffer Size

如果MySQL使用的CPU過高，加大buffer可能有幫助，以下是innodb引擎的調教方式

查看當前buffer size

```
SHOW VARIABLES LIKE 'innodb_buffer_pool_size';
```

查看建議buffer size，參考[神回答](https://dba.stackexchange.com/questions/27328/how-large-should-be-mysql-innodb-buffer-pool-size)

```
SELECT CEILING(Total_InnoDB_Bytes*1.6/POWER(1024,3)) RIBPS FROM
(SELECT SUM(data_length+index_length) Total_InnoDB_Bytes
FROM information_schema.tables WHERE engine='InnoDB') A;
```

如果出現數字1，表示建議buffer size 1GB，可在`/etc/mysql/conf.d/my.cnf`設定

```
[mysqld]
innodb_buffer_pool_size = 1G
```

`[mysql]`跟`[mysqld]`的差別：前者是mysql command line client套用的設定，後者是mysql server。詳情[見此](https://stackoverflow.com/questions/22132780/difference-between-mysql-mysqladmin-mysqld)。

重啟mysql server後，再次查看buffer size確認無誤。

### Query Cache

另外可以再加兩項，`query_cache_size`是所有query的cache大小，`query_cache_limit`是單個query所佔的極限。

```
query_cache_size=518M
query_cache_limit=10M
```

### Example

```
select SQL_NO_CACHE P.* from product P left join 
  (
    select distinct product_id, sort  from product_type_relation where type_id in (16)
  ) AS A 
ON P.id=A.product_id
ORDER BY A.sort, P.id desc
LIMIT 0,28;

=> 耗時0.1
```

```
SELECT SQL_NO_CACHE distinct P.id, P.*
FROM product_type_relation A
LEFT JOIN product P ON A.product_id=P.id
WHERE A.type_id in (16) 
ORDER BY A.sort asc, P.id desc
LIMIT 0, 28;

=> 耗時0.04
```

```
SELECT SQL_NO_CACHE P.*
FROM product P 
LEFT JOIN product_type_relation A ON A.product_id=P.id
WHERE P.id in 
  (
     select distinct product_id from product_type_relation where type_id in (16)
  ) 
ORDER BY A.sort
LIMIT 0,28;

=> 耗時0.022
```

### 參考

* [Tuning-Primer](https://github.com/RootService/tuning-primer/blob/master/tuning-primer.sh)

* [slow query log](https://dev.mysql.com/doc/refman/5.7/en/slow-query-log.html)

* [Tuning Script(better)](https://github.com/major/MySQLTuner-perl)

* [MySQL官方show profile指令範例](https://dev.mysql.com/doc/refman/5.7/en/show-profile.html)

* [善用sub-query to improve performance](https://www.pigo.idv.tw/archives/390)
