# 用户数据 API 接口文档

## 概述

用户数据API提供了完整的用户自定义数据管理功能，支持JSON格式的大数据存储。用户可以通过这些接口创建、查询、更新和删除自己的数据记录。

**基础URL**: `http://localhost:3000/api/user-data`

**版本**: v1.0.0

**最后更新**: 2025-01-15

## 认证说明

所有接口都需要JWT Token认证。请在请求头中包含Authorization字段：

```
Authorization: Bearer <your-jwt-token>
```

### 如何获取Token

通过登录接口获取JWT Token：

```javascript
// 登录获取Token
const response = await fetch('http://localhost:3000/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    username: 'your-username',
    password: 'your-password'
  })
});

const result = await response.json();
const token = result.data.token;
```

## 通用响应格式

所有接口返回统一的JSON格式：

```typescript
interface ApiResponse<T = any> {
  success: boolean;           // 操作是否成功
  message?: string;          // 响应消息
  data?: T;                  // 响应数据
  error?: string;            // 错误信息
  total?: number;            // 数据总数（列表接口）
}
```

## 状态码说明

| 状态码 | 说明 |
|--------|------|
| 200 | 请求成功 |
| 201 | 创建成功 |
| 400 | 请求参数错误 |
| 401 | 未授权（Token无效或过期） |
| 404 | 资源不存在 |
| 409 | 资源冲突（如字段名重复） |
| 500 | 服务器内部错误 |

## 数据模型

### UserData 数据记录

```typescript
interface UserData {
  id: string;                   // 记录唯一标识（前端传递的key值）
  user_id: number;              // 用户ID（自动填充）
  field_name: string;           // 字段名称（最大100字符）
  data: any;                    // JSON数据内容
  created_at: string;           // 创建时间
  updated_at: string;           // 更新时间
}
```

### 统计信息

```typescript
interface UserDataStats {
  totalRecords: number;         // 总记录数
  uniqueFields: number;         // 唯一字段数
  userId: number;               // 用户ID
}
```

## API 接口详情

### 1. 获取用户所有数据

获取当前登录用户的所有数据记录。

**接口信息**
- **URL**: `GET /api/user-data`
- **认证**: 需要JWT Token

**响应示例**

```json
{
  "success": true,
  "data": [
    {
      "id": "chat_config_001",
      "field_name": "用户配置",
      "data": {
        "theme": "dark",
        "language": "zh-CN",
        "notifications": true
      },
      "created_at": "2025-01-15T10:30:00.000Z",
      "updated_at": "2025-01-15T10:30:00.000Z"
    },
    {
      "id": "shopping_cart_456",
      "field_name": "购物车",
      "data": {
        "items": [
          {"productId": 123, "quantity": 2},
          {"productId": 456, "quantity": 1}
        ],
        "totalAmount": 299.99
      },
      "created_at": "2025-01-15T11:00:00.000Z",
      "updated_at": "2025-01-15T11:15:00.000Z"
    }
  ],
  "total": 2
}
```

**请求示例**

```bash
# cURL
curl -X GET "http://localhost:3000/api/user-data" \
  -H "Authorization: Bearer your-jwt-token"
```

```javascript
// JavaScript
const response = await fetch('http://localhost:3000/api/user-data', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});

const result = await response.json();
if (result.success) {
  console.log('用户数据:', result.data);
  console.log('总数:', result.total);
}
```

### 2. 获取数据统计信息

获取当前用户的数据统计信息。

**接口信息**
- **URL**: `GET /api/user-data/stats`
- **认证**: 需要JWT Token

**响应示例**

```json
{
  "success": true,
  "data": {
    "totalRecords": 5,
    "uniqueFields": 3,
    "userId": 123
  }
}
```

**请求示例**

```bash
# cURL
curl -X GET "http://localhost:3000/api/user-data/stats" \
  -H "Authorization: Bearer your-jwt-token"
```

```javascript
// JavaScript
const response = await fetch('http://localhost:3000/api/user-data/stats', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

const result = await response.json();
if (result.success) {
  console.log(`用户共有 ${result.data.totalRecords} 条记录`);
}
```

### 3. 获取特定数据记录

根据记录ID获取特定的数据记录。

**接口信息**
- **URL**: `GET /api/user-data/:id`
- **认证**: 需要JWT Token

**路径参数**
- `id` (string): 数据记录的唯一标识（前端传递的key值）

**响应示例**

```json
{
  "success": true,
  "data": {
    "id": "chat_config_001",
    "field_name": "用户配置",
    "data": {
      "theme": "dark",
      "language": "zh-CN"
    },
    "created_at": "2025-01-15T10:30:00.000Z",
    "updated_at": "2025-01-15T10:30:00.000Z"
  }
}
```

**错误响应示例**

```json
{
  "success": false,
  "message": "找不到ID为chat_config_999的数据记录"
}
```

**请求示例**

```bash
# cURL
curl -X GET "http://localhost:3000/api/user-data/chat_config_001" \
  -H "Authorization: Bearer your-jwt-token"
```

```javascript
// JavaScript
const dataId = "chat_config_001";
const response = await fetch(`http://localhost:3000/api/user-data/${dataId}`, {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

const result = await response.json();
if (result.success) {
  console.log('数据记录:', result.data);
} else {
  console.error('获取失败:', result.message);
}
```

### 4. 创建新数据记录

为当前用户创建新的数据记录。

**接口信息**
- **URL**: `POST /api/user-data`
- **认证**: 需要JWT Token

**请求体参数**

```typescript
interface CreateUserDataRequest {
  key: string;                 // 数据记录唯一标识（必填，最大255字符）
  field_name: string;          // 字段名称（必填，最大100字符）
  data: any;                   // JSON数据内容（必填）
}
```

**响应示例**

```json
{
  "success": true,
  "message": "数据记录创建成功",
  "data": {
    "id": "shopping_pref_789",
    "field_name": "购物偏好"
  }
}
```

**错误响应示例**

```json
{
  "success": false,
  "message": "ID \"shopping_pref_789\" 已存在，请使用不同的key值"
}
```

**请求示例**

```bash
# cURL - 创建包含数据的记录
curl -X POST "http://localhost:3000/api/user-data" \
  -H "Authorization: Bearer your-jwt-token" \
  -H "Content-Type: application/json" \
  -d '{
    "key": "shopping_pref_789",
    "field_name": "购物偏好",
    "data": {
      "categories": ["电子产品", "图书"],
      "priceRange": {"min": 50, "max": 1000}
    }
  }'

# cURL - 创建空数据记录
curl -X POST "http://localhost:3000/api/user-data" \
  -H "Authorization: Bearer your-jwt-token" \
  -H "Content-Type: application/json" \
  -d '{
    "key": "empty_config_001",
    "field_name": "待配置项",
    "data": {}
  }'
```

```javascript
// JavaScript - 创建包含数据的记录
const newData = {
  key: "shopping_pref_789",
  field_name: "购物偏好",
  data: {
    categories: ["电子产品", "图书"],
    priceRange: { min: 50, max: 1000 }
  }
};

const response = await fetch('http://localhost:3000/api/user-data', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(newData)
});

const result = await response.json();
if (result.success) {
  console.log('创建成功，ID:', result.data.id);
} else {
  console.error('创建失败:', result.message);
}

// JavaScript - 创建空数据记录
const emptyData = {
  key: "empty_config_001",
  field_name: "待配置项",
  data: {} // 空对象是允许的
};

const response2 = await fetch('http://localhost:3000/api/user-data', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(emptyData)
});
```

### 5. 更新数据记录

更新指定的数据记录。

**接口信息**
- **URL**: `PUT /api/user-data/:id`
- **认证**: 需要JWT Token

**路径参数**
- `id` (string): 数据记录的唯一标识（前端传递的key值）

**请求体参数**

```typescript
interface UpdateUserDataRequest {
  field_name?: string;          // 字段名称（可选）
  data?: any;                  // JSON数据内容（可选）
}
```

**响应示例**

```json
{
  "success": true,
  "message": "数据记录更新成功"
}
```

**请求示例**

```bash
# cURL - 只更新数据内容
curl -X PUT "http://localhost:3000/api/user-data/chat_config_001" \
  -H "Authorization: Bearer your-jwt-token" \
  -H "Content-Type: application/json" \
  -d '{
    "data": {
      "theme": "light",
      "language": "en-US",
      "notifications": false
    }
  }'
```

```javascript
// JavaScript - 更新字段名和数据
const dataId = "chat_config_001";
const updateData = {
  field_name: "用户设置",
  data: {
    theme: "light",
    language: "en-US"
  }
};

const response = await fetch(`http://localhost:3000/api/user-data/${dataId}`, {
  method: 'PUT',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(updateData)
});

const result = await response.json();
if (result.success) {
  console.log('更新成功');
} else {
  console.error('更新失败:', result.message);
}
```

### 6. 删除特定数据记录

删除指定的数据记录。

**接口信息**
- **URL**: `DELETE /api/user-data/:id`
- **认证**: 需要JWT Token

**路径参数**
- `id` (string): 数据记录的唯一标识（前端传递的key值）

**响应示例**

```json
{
  "success": true,
  "message": "数据记录删除成功"
}
```

**请求示例**

```bash
# cURL
curl -X DELETE "http://localhost:3000/api/user-data/chat_config_001" \
  -H "Authorization: Bearer your-jwt-token"
```

```javascript
// JavaScript
const dataId = "chat_config_001";
const response = await fetch(`http://localhost:3000/api/user-data/${dataId}`, {
  method: 'DELETE',
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

const result = await response.json();
if (result.success) {
  console.log('删除成功');
} else {
  console.error('删除失败:', result.message);
}
```

### 7. 删除所有数据记录

删除当前用户的所有数据记录。

**接口信息**
- **URL**: `DELETE /api/user-data`
- **认证**: 需要JWT Token

**响应示例**

```json
{
  "success": true,
  "message": "成功删除3条数据记录",
  "data": {
    "deletedCount": 3
  }
}
```

**请求示例**

```bash
# cURL
curl -X DELETE "http://localhost:3000/api/user-data" \
  -H "Authorization: Bearer your-jwt-token"
```

```javascript
// JavaScript
const response = await fetch('http://localhost:3000/api/user-data', {
  method: 'DELETE',
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

const result = await response.json();
if (result.success) {
  console.log(`已删除 ${result.data.deletedCount} 条记录`);
}
```

## 错误处理

### 常见错误示例

**1. Token未提供或无效**

```json
{
  "success": false,
  "message": "未提供认证token"
}
```

**2. 参数验证失败**

```json
{
  "success": false,
  "message": "字段名称和数据内容为必填项"
}
```

**3. 资源不存在**

```json
{
  "success": false,
  "message": "找不到ID为999的数据记录"
}
```

**4. 字段名重复**

```json
{
  "success": false,
  "message": "用户已存在字段名为 \"配置信息\" 的数据记录"
}
```

### 错误处理最佳实践

```javascript
async function handleApiRequest(url, options) {
  try {
    const response = await fetch(url, options);
    const result = await response.json();
    
    if (!result.success) {
      // 处理业务错误
      switch (response.status) {
        case 401:
          // Token过期，重新登录
          redirectToLogin();
          break;
        case 400:
          // 参数错误，显示具体错误信息
          showError(result.message);
          break;
        case 404:
          // 资源不存在
          showError('数据不存在或已被删除');
          break;
        default:
          showError(result.message || '操作失败');
      }
      return null;
    }
    
    return result.data;
  } catch (error) {
    // 处理网络错误
    console.error('网络请求失败:', error);
    showError('网络连接失败，请检查网络设置');
    return null;
  }
}
```

## 使用场景示例

### 场景1：用户配置管理

```javascript
// 保存用户配置
async function saveUserConfig(config) {
  const response = await fetch('http://localhost:3000/api/user-data', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      field_name: '用户配置',
      data: config
    })
  });
  
  return await response.json();
}

// 加载用户配置
async function loadUserConfig() {
  const response = await fetch('http://localhost:3000/api/user-data', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  
  const result = await response.json();
  if (result.success) {
    const configRecord = result.data.find(item => item.field_name === '用户配置');
    return configRecord ? configRecord.data : null;
  }
  return null;
}
```

### 场景2：购物车管理

```javascript
// 添加商品到购物车
async function addToCart(productId, quantity) {
  // 先获取现有购物车
  const cart = await getCartData() || { items: [] };
  
  // 更新购物车数据
  const existingItem = cart.items.find(item => item.productId === productId);
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.items.push({ productId, quantity });
  }
  
  // 保存购物车
  return await saveCartData(cart);
}

async function saveCartData(cartData) {
  // 检查是否已存在购物车记录
  const existing = await findDataByFieldName('购物车');
  
  if (existing) {
    // 更新现有记录
    return await updateUserData(existing.id, { data: cartData });
  } else {
    // 创建新记录
    return await createUserData('购物车', cartData);
  }
}
```

## 注意事项

1. **数据隔离**: 用户只能访问自己创建的数据记录
2. **Key值唯一性**: 每个key值在全局范围内必须唯一（跨所有用户）
3. **字段名灵活性**: 同一用户可以创建多个相同field_name的记录
4. **Key值格式**: key必须是非空字符串，长度不超过255个字符
5. **JSON格式**: 数据内容必须是有效的JSON格式，支持空对象{}、空数组[]等
6. **Token过期**: 建议实现Token自动刷新机制
7. **错误处理**: 前端应妥善处理各种错误情况
8. **数据大小**: 建议单个JSON数据不超过1MB
9. **Key值管理**: 前端应确保生成的key值具有唯一性，建议使用UUID或时间戳等方式

## 更新日志

- **v1.0.0** (2025-01-15): 初始版本，包含完整的CRUD功能

---

如有疑问或需要支持，请联系开发团队。 