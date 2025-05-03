# Hướng dẫn
### 1. chạy lệnh run project
```shell
npm run dev -- -H 0.0.0.0
```
### 2. Tìm ip máy
```shell
ipconfig
```
Kết quả trả về:
```text
Windows IP Configuration
Ethernet adapter Ethernet:
   Media State . . . . . . . . . . . : Media disconnected
   Connection-specific DNS Suffix  . :
   .................................................
   .................................................
Wireless LAN adapter Wi-Fi:
   Connection-specific DNS Suffix  . :
   Link-local IPv6 Address . . . . . : fe80::8a94:4c6d:25e6:7dc0%4
   IPv4 Address. . . . . . . . . . . : 192.168.1.5
   Subnet Mask . . . . . . . . . . . : 255.255.255.0
   Default Gateway . . . . . . . . . : 192.168.1.1

ip để sử dụng là dòng: IPv4 Address. . . . . . . . . . . : 192.168.1.5 
truy cập 192.168.1.5:{port} thay vì localhost:{port}. Ví dụ 192.168.1.5:3000
```