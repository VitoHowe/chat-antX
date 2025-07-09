# 配置文件说明

本目录包含应用程序的配置文件，其中一些包含敏感信息，不应提交到版本控制系统。

## API 配置

### api.example.ts

这是一个示例配置文件，不包含实际的 API 密钥和敏感信息，可以安全地提交到版本控制系统。

### api.ts

这是实际的配置文件，包含真实的 API 密钥和敏感信息，**不应该**被提交到版本控制系统。

## 环境配置

### env.example.ts

这是环境配置的示例文件，包含开发环境和生产环境的基础 URL 配置。

### env.ts

这是实际的环境配置文件，可能包含特定环境的敏感信息，**不应该**被提交到版本控制系统。

## 首次使用

如果你是第一次克隆此项目，请按照以下步骤设置配置：

1. 复制示例配置文件：

   ```bash
   cp src/config/api.example.ts src/config/api.ts
   cp src/config/env.example.ts src/config/env.ts
   ```

2. 编辑 `api.ts` 文件，填入你的实际 API 密钥和其他配置信息。

3. 编辑 `env.ts` 文件，根据你的开发环境调整服务器地址。

## 安全注意事项

- 永远不要将包含真实 API 密钥的 `api.ts` 提交到版本控制系统
- 确保 `.gitignore` 文件中包含 `src/config/api.ts` 和 `src/config/env.ts`
- 如果需要更改配置结构，请同时更新对应的示例文件
