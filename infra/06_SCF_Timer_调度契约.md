# 06 SCF Timer 调度契约

这份契约定义中国版提醒发送任务如何被定时触发。它只描述调度入口，不描述页面行为。

## 触发目标
- 触发路径：`/api/reminders/send`
- 触发方式：SCF Timer Trigger
- 默认时区：`Asia/Shanghai`
- 默认时段：每天 `19:00`

## 请求约定
调度请求可以使用以下任一方式通过鉴权：

- 请求头：`x-three-moves-dispatch-secret`
- 查询参数：`secret`

如果配置了 `REMINDER_DISPATCH_SECRET` 或 `SCF_TIMER_SECRET`，请求必须携带匹配的密钥。

## 允许的方法
- `GET`
- `POST`

这两个方法在当前代码里都等价于“执行一次提醒发送”。

## 返回约定
成功时返回：

```json
{
  "ok": true,
  "results": []
}
```

失败时返回：

```json
{
  "ok": false,
  "error": "提醒发送失败"
}
```

## 适配原则
- 调度器只负责触发，不负责业务判断
- 业务判断仍在提醒发送 route 内完成
- 如果后续更换 Timer Trigger 提供方，只替换触发层，不改提醒页面或订阅模型

## 验收要点
- 没有密钥时可以在本地调试
- 配置密钥后只允许授权触发
- 同一日多次触发不会改变产品页面
- 触发结果只影响提醒发送，不影响 Today / History 数据
