# MySQL JSON type Export & Import

MySQL 5.7之後便支援JSON格式，然而在import/export資料時卻有一些問題，如果export SQL檔案的話，JSON欄位的值會變成binary表示，例如這樣

```
X'7B22666565223A20302C202264617465223A20'
```

若import到別的database會出現錯誤：

```
import cannot create a JSON value from a string with CHARACTER SET 'binary'
```

解法為：

```
搜尋 (X'[^,\)]*')
取代 CONVERT($1 using utf8mb4)
```

===================

另外，若有些欄位是JSON generated，直接export SQL然後import到別的database一樣會出錯，解法是把tabe跟data分開處理，export table成sql，data則用csv輸出。import data時，忽略所有JSON generated fields。

ref: [MySQL 5.7.12 import cannot create a JSON value from a string with CHARACTER SET 'binary'](https://stackoverflow.com/questions/38078119/mysql-5-7-12-import-cannot-create-a-json-value-from-a-string-with-character-set)
