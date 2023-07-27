# Ubuntu 滾輪速度

http://askubuntu.com/questions/285689/increase-mouse-wheel-scroll-speed

## 安裝imwheel

新增檔案`~/.imwheelrc`

```
".*"
None,       Up,     Up,     3
None,       Down,   Down,   3
```

### 啟動imwheel

`imwheel`

記得別啟動imwheel兩次，會有bug

殺死killall imwheel
`killall imwheel`
