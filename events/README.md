# 测试事件文件

本目录包含用于本地测试 Lambda 函数的示例事件文件。

## 使用方法

### 测试单个函数

```bash
# 使用示例事件测试 Lambda 函数
sam local invoke NestJSFunction --event events/api-health.json
```

### 生成新的测试事件

```bash
# 生成 HTTP API 代理事件
sam local generate-event apigateway http-api-proxy > events/custom-event.json

# 生成 REST API 事件
sam local generate-event apigateway aws-proxy > events/rest-api-event.json
```

## 可用的事件文件

- `api-health.json`: GET /api/health 健康检查请求

## 自定义事件

你可以根据需要修改这些事件文件来测试不同的场景:

- 修改 `rawPath` 和 `routeKey` 来测试不同的路由
- 修改 `http.method` 来测试不同的 HTTP 方法
- 添加 `body` 字段来测试 POST/PUT 请求
- 修改 `headers` 来测试不同的请求头

## 示例: POST 请求事件

```json
{
  "version": "2.0",
  "routeKey": "POST /api/users",
  "rawPath": "/api/users",
  "rawQueryString": "",
  "headers": {
    "content-type": "application/json"
  },
  "body": "{\"name\":\"John Doe\",\"email\":\"john@example.com\"}",
  "isBase64Encoded": false,
  "requestContext": {
    "http": {
      "method": "POST",
      "path": "/api/users"
    }
  }
}
```
