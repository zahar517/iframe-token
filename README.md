# Test main window/iframe interaction with token based authorization

### Prerequisites
- node >= 14
- npm >= 6.14

### Build
Clone repo:
```
git clone git@github.com:zahar517/iframe-token.git
```
In project directory run follow command to install required dependencies:
```
npm i
```

### Run project
Edit ```/etc/hosts``` file to emulate different hosts.
Add following records:
```
127.0.0.1 server1
127.0.0.1 server2
127.0.0.1 auth
```

Run project:
```
npm run start
```
