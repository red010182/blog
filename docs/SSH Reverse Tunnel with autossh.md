# SSH Reverse Tunnel with autossh

You can use ssh with reverse tunnel like this 

```
ssh -fNR 2222:localhost:22 username@domain.com 
```

`-f`: run in background

`-N`: execute no command

`-R`: reverse tunnel

`2222:localhost:22`: mapping `remote_host:2222` to `localhost:22`

##### remote server

connect to remote server via ssh and then type

```
ssh local_machine_username@127.0.0.1 -p 2222
```

Done! It's great! 

### autossh

If you want to keep the tunnel always alive, one way is to use `autossh`. It will automatically spawn a `ssh` command once the link is broken.

##### install

```
sudo apt-get install autossh
```

We're going to run `autossh` in background. However, unlike `ssh`, in autossh, `-f` won't let you type password, so you have to use public/private key to authorize.

##### key

```
ssh-keygen
Generating public/private rsa key pair.
Enter file in which to save the key (/home/user/.ssh/id_rsa): ~/.ssh/some_key
(enter to the end)
```

##### config

Config ssh server for shorter command, in `~/.ssh/config`

```
Host reverse-tunnel
HostName domain.com
User username
ServerAliveInterval 30
ServerAliveCountMax 3
IdentityFile  ~/.ssh/some_key
```

##### Use

First,  copy key to remote server (do only once)

```
ssh-copy-id reverse-tunnel
```

start ssh reverse tunnel with autossh:

```
autossh -M 0 -fNR 2222:localhost:22 reverse-tunnel
```

`-M`: monitoring port, use 0 to disable. It is said by official doc that the better way was to set `ServerAliveInterval` and `ServerAliveCountMax` to do this job rather than open an echo port to monitor.

### Stop ssh tunnel

You need to first stop `autossh` command itself and `ssh` process it has spawned.

##### stop autossh

```
pkill -9 autossh;
```

##### stop ssh

```
ps aux | grep reverse-tunnel
kill {pid}
```

Or in short, add it in `.bashrc`

```
alias killautossh='pkill -9 autossh; ps aux | grep reverse-tunnel'
```

#### References

* http://josephj.com/entry.php?id=312
* https://ez3c.tw/2043 (perfect)
* http://jamyy.us.to/blog/2014/05/6347.html
* https://www.everythingcli.org/ssh-tunnelling-for-fun-and-profit-autossh/
