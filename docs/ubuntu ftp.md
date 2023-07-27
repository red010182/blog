# ubuntu ftp

```
sudo apt-get install vsftp
```

### Add FTP login to current user

`vim /etc/vsftpd.conf`

```
anonymous_enable=NO
local_enable=YES
write_enable=YES
chroot_local_user=YES
userlist_enable=YES
userlist_file=/etc/vsftpd.userlist
userlist_deny=NO
allow_writeable_chroot=YES

# pasv_promiscuous=YES 
```

more about unsafe passive mode [here](https://superuser.com/questions/1074801/whats-the-real-security-risk-in-vsftpd-of-pasv-promiscuous-yes)

Edit `/etc/vsftpd.userlist`

```
username
```
