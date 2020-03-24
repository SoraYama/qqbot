# cqbot

自用 QQ 群机器人, 基于 [CQWebsocket](https://github.com/momocow/node-cq-websocket/blob/master/docs/api/CQWebSocket.md) 的 API

## 功能

- 一些自定的沙雕功能
- 复读
- 砍口垒相关
  - 每日改修 (感谢[大波胡数据库](https://github.com/Diablohu/WhoCallsTheFleet-DB#readme))
  - 官推头像转发 (感谢[Kcwiki API](http://api.kcwiki.moe/))
  - 时报 (同上)
- 喂宠物
- 迷你砍口垒(大建模拟)

## 更新

### 1.4.0

- 加入一键解体功能
- 加入资源管理后台

### 1.3.0

- 加入大建模拟的日志收集
- 重构 `User` 数据模块, 利用 `mobx` 的 `reaction` 完成自动同步
