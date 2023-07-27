# Ubuntu交換Ctrl與Alt鍵

OSX用慣了，在Ubuntu還真不習慣ctrl鍵的位置，沒想到交換兩個按鍵竟然如此容易，在`~/.Xmodmap`新增以下設定

```
clear control
clear mod1
keycode 37 = Alt_L Meta_L
keycode 64 = Control_L
add control = Control_L Control_R
add mod1 = Alt_L Meta_L
```

然後執行

```
xmodmap ~/.Xmodmap
```

從此Ubuntu就跟OSX一樣啦！

參考：http://askubuntu.com/questions/93624/how-do-i-swap-left-ctrl-with-left-alt-on-my-keyboard
