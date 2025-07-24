# 菜单保存系统

一个基于 React + TypeScript + IndexedDB 的菜单配置管理系统，用于保存和管理测试环境的菜单配置，方便后续迁移到生产环境。

## 功能特性

### 核心功能

- 📝 **菜单配置管理**：新增、编辑、查看、删除菜单配置
- 🔍 **版本搜索**：支持按迭代版本号搜索和筛选
- 📋 **JSON编辑器**：内置Monaco编辑器，支持JSON语法高亮和格式化
- ✅ **JSON校验**：实时校验JSON格式，确保数据正确性
- 💾 **本地存储**：使用IndexedDB进行本地数据持久化

### 扩展功能

- 📄 **详情查看**：查看完整的菜单配置详情
- 📋 **一键复制**：支持复制JSON配置或完整配置信息
- 📤 **数据导出**：支持导出全部配置为JSON文件
- 🗑️ **批量删除**：支持按版本号批量删除配置

## 技术栈

- **前端框架**: React 18 + TypeScript
- **路由管理**: React Router 6
- **UI组件库**: Ant Design 5
- **数据存储**: IndexedDB (Dexie.js)
- **代码编辑器**: Monaco Editor
- **构建工具**: Vite
- **样式方案**: CSS + Ant Design

## 快速开始

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

### 预览构建结果

```bash
npm run preview
```

## 项目结构

```
src/
├── components/           # React组件
│   ├── MenuList.tsx     # 菜单列表页面
│   ├── MenuForm.tsx     # 菜单保存/编辑页面
│   └── MenuDetail.tsx   # 菜单详情页面
├── types.ts             # TypeScript类型定义
├── db.ts                # IndexedDB数据库配置
├── services.ts          # 数据服务层
├── App.tsx              # 主应用组件
├── App.css              # 全局样式
└── main.tsx             # 应用入口文件
```

## 数据结构

```typescript
interface MenuConfig {
  id?: string; // 配置ID（自动生成）
  version: string; // 迭代版本号
  name: string; // 菜单名称
  jsonConfig: string; // 菜单JSON配置
  createdAt: Date; // 创建时间
  updatedAt: Date; // 更新时间
}
```

## 使用说明

### 1. 新增菜单配置

- 点击"新增菜单"按钮
- 填写迭代版本号和菜单名称
- 在JSON编辑器中输入菜单配置
- 系统会自动校验JSON格式
- 点击"保存配置"完成添加

### 2. 搜索和筛选

- 在搜索框中输入迭代版本号进行搜索
- 支持模糊匹配，会显示所有匹配的配置

### 3. 查看详情

- 点击列表中的"查看"按钮
- 查看完整的配置信息和JSON内容
- 支持一键复制JSON或完整配置

### 4. 编辑配置

- 点击列表中的"编辑"按钮
- 修改配置信息
- 保存后会更新修改时间

### 5. 导出数据

- 点击"导出全部"按钮
- 系统会下载包含所有配置的JSON文件
- 文件名格式：menu-configs-YYYY-MM-DD.json

## 浏览器兼容性

- Chrome 61+
- Firefox 57+
- Safari 10.1+
- Edge 79+

## 开发指南

### 添加新功能

1. 在 `src/types.ts` 中定义新的数据类型
2. 在 `src/services.ts` 中添加相应的数据操作方法
3. 创建新的React组件
4. 在 `src/App.tsx` 中添加路由配置

### 数据库操作

项目使用Dexie.js操作IndexedDB，主要API：

```typescript
// 获取所有配置
await menuService.getAll();

// 根据ID获取配置
await menuService.getById(id);

// 按版本搜索
await menuService.searchByVersion(version);

// 添加配置
await menuService.add(config);

// 更新配置
await menuService.update(id, config);

// 删除配置
await menuService.delete(id);
```

## 贡献指南

1. Fork 项目
2. 创建功能分支
3. 提交更改
4. 推送到分支
5. 创建 Pull Request

## 许可证

MIT License
