# 装修工作室 Web 应用原型

这是一个装修工作室的 Web 应用原型，提供需求收集、价格计算、风格测试、户型分析等功能。

## 功能特性

### 第一阶段功能（基础功能）
- 需求收集表单（风格/材料清单/特殊需求等）
- 可视化价格计算器（根据面积/复杂度自动报价）
- 现代化 UI 设计

### 第二阶段功能（增强功能）
- AI 风格测试（通过问卷分析用户装修风格偏好）
- 户型图分析（上传户型图获取空间布局建议）
- 价格对比功能（比较不同装修方案的价格差异）

## 技术栈

### 前端
- React.js
- Material-UI
- Redux Toolkit
- React Router
- Vite
- Recharts (数据可视化)

### 后端
- Node.js + Express.js
- MongoDB (演示模式下使用内存存储)
- RESTful API
- OpenAI API (AI 分析功能)

### DevOps
- Docker
- Docker Compose
- Nginx

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

1. 确保已安装 Node.js
2. 进入 backend 目录
3. 安装依赖：

```bash
cd backend
npm install
```

4. 配置环境变量（可选，用于 AI 功能）：
   - 创建 `.env` 文件
   - 添加 `OPENAI_API_KEY=your_api_key_here`

5. 运行开发服务器：

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

3. 配置环境变量：
   - 创建 `.env` 文件
   - 添加 `VITE_API_URL=http://localhost:3000`

4. 运行开发服务器：

```bash
npm run dev
```

5. 访问 http://localhost:5173 即可使用应用

## 项目结构

```
.
├── backend/                # 后端代码
│   ├── models/             # 数据模型
│   ├── routes/             # API 路由
│   ├── services/           # 服务层（AI服务、上传服务等）
│   ├── uploads/            # 上传文件目录
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
├── nginx.conf              # Nginx 配置
└── README.md               # 项目说明
```

## 开发计划与进度

### 第一阶段（基础功能）
- [x] 项目初始化
- [x] 前后端框架搭建
- [x] 数据库设计
- [x] 需求收集表单
- [x] 价格计算器
- [x] 基础 UI 实现
- [x] Docker 部署配置

### 第二阶段（增强功能）
- [x] AI 风格测试问卷
- [x] 户型图上传与分析
- [x] 价格对比功能
- [x] 数据可视化展示
- [x] AI 服务集成
- [x] 文件上传服务
- [x] 历史记录功能

### 第三阶段（高级功能，规划中）
- [ ] AR 空间预览
- [ ] 智能推荐系统
- [ ] 用户认证与权限管理
- [ ] 真实数据库存储
- [ ] 移动端适配优化

## 使用说明

### AI 风格测试
1. 访问"风格测试"页面
2. 回答问卷中的问题
3. 获取个性化风格分析报告
4. 查看历史测试结果

### 户型分析
1. 访问"户型诊断"页面
2. 上传户型图（支持拖拽上传）
3. 点击"开始分析"按钮
4. 获取空间布局分析和改进建议

### 价格计算与对比
1. 访问"需求收集"页面填写装修需求
2. 系统自动生成报价
3. 访问"价格对比"页面比较不同方案 