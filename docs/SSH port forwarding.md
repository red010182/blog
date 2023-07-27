# SSH port forwarding

Remote Port Forwarding

```
ssh user@domain -NT -o ServerAliveInterval=30 -R 8000:localhost:8000


-N: execute no command, useful when port forwarding
-T: ?
-n: background mode
```

https://www.calazan.com/how-to-share-your-local-web-server-to-the-internet-using-a-reverse-ssh-tunnel/

http://blog.trackets.com/2014/05/17/ssh-tunnel-local-and-remote-port-forwarding-explained-with-examples.html
