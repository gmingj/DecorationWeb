# 装修工作室 Web 应用原型

这是一个装修工作室的 Web 应用原型，提供需求收集、价格计算等功能。

## 功能特性

- 需求收集表单（风格/材料清单/特殊需求等）
- 可视化价格计算器（根据面积/复杂度自动报价）
- 现代化 UI 设计

## 技术栈

### 前端
- React.js
- Material-UI
- Redux Toolkit
- React Router
- Vite

### 后端
- Node.js + Express.js
- MongoDB
- RESTful API

### DevOps
- Docker
- Docker Compose

## 运行项目

### 使用 Docker Compose（推荐）

1. 确保已安装 Docker 和 Docker Compose
2. 克隆项目到本地
3. 在项目根目录运行：

```bash
docker-compose up
```

4. 访问 http://localhost 即可使用应用

### 本地开发环境

#### 后端

1. 确保已安装 Node.js 和 MongoDB
2. 进入 backend 目录
3. 安装依赖：

```bash
cd backend
npm install
```

4. 运行开发服务器：

```bash
npm run dev
```

#### 前端

1. 进入 frontend 目录
2. 安装依赖：

```bash
cd frontend
npm install
```

3. 运行开发服务器：

```bash
npm run dev
```

4. 访问 http://localhost:5173 即可使用应用

## 项目结构

```
.
├── backend/                # 后端代码
│   ├── models/             # 数据模型
│   ├── routes/             # API 路由
│   ├── index.js            # 入口文件
│   └── package.json        # 后端依赖
├── frontend/               # 前端代码
│   ├── public/             # 静态资源
│   ├── src/                # 源代码
│   │   ├── components/     # 组件
│   │   ├── pages/          # 页面
│   │   ├── store/          # Redux store
│   │   ├── App.jsx         # 主应用组件
│   │   └── main.jsx        # 入口文件
│   ├── index.html          # HTML 模板
│   └── package.json        # 前端依赖
├── doc/                    # 文档
├── docker-compose.yml      # Docker Compose 配置
└── README.md               # 项目说明
```

## 第一阶段开发计划

- [x] 项目初始化
- [x] 前后端框架搭建
- [x] 数据库设计
- [x] 需求收集表单
- [x] 价格计算器
- [x] 基础 UI 实现
- [x] Docker 部署配置 