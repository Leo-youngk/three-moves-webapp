# 05 CloudBase 提醒存储契约

这份契约定义中国版提醒订阅数据的存储方式。它只描述后端存储，不描述页面逻辑。

## 存储对象
存储对象仍然是 `ReminderSubscriptionIndex`，顶层结构保持：

- `version: 1`
- `subscriptions: Record<string, ReminderSubscriptionRecord>`

其中 `ReminderSubscriptionRecord` 保持这些字段：
- `installId`
- `slotId`
- `timezone`
- `endpoint`
- `keys.p256dh`
- `keys.auth`
- `expirationTime`
- `createdAt`
- `updatedAt`
- `revokedAt`
- `lastSentDateKey`

## CloudBase 存储约定
中国版第一版不再使用独立的订阅索引 HTTP 接口，而是由服务端直接通过 CloudBase Node SDK 读写 CloudBase 数据库。

### 数据库形态
- 集合名：`tm_reminder_subs`
- 文档 ID：`current`
- 服务端会在首次读写前尝试自动创建集合
- 服务端会在第一次保存前自动创建 `current` 文档

### 读写行为
- `doc("current").get()` 用于读取当前索引
- `doc("current").set(index)` 用于覆盖写入当前索引
- 首次保存时会自动补齐文档，不需要手动新建 `current`

### 索引示例
```json
{
  "version": 1,
  "subscriptions": []
}
```

## 鉴权
- 服务端通过 CloudBase SDK 直连
- 运行时需要 `CLOUDBASE_ENV_ID`
- 运行时需要 `CLOUDBASE_APIKEY`

## 适配原则
- 页面不直接知道 CloudBase 的存储实现
- 存储适配层只负责读写索引
- 订阅记录的字段和含义不变
- 如果后续替换国内后端，只替换存储适配层，不改提醒路由和页面

## 验收要点
- 同一个 installId 的订阅能被覆盖更新
- 订阅撤销后不会再被推送命中
- 索引结构能被正常读回
- 产品层不需要知道底层是不是 CloudBase
