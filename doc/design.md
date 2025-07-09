# 装修工作室Web应用原型架构设计

## 1. 项目概述

本文档描述了装修工作室Web应用原型的架构设计，该应用旨在提供一站式装修服务平台，包括需求收集、价格计算、智能设计分析等功能，重点关注快速原型开发与展示。

### 1.1 核心功能

**基本特性：**
- 需求收集表单（风格/材料清单/特殊需求等）
- 可视化价格计算器（根据面积/复杂度自动报价）
- 报价对比（不同方案成本分析）

**智能设计：**
- 在线户型诊断（上传户型图获取分析）
- AI风格测试（问卷生成偏好报告）
- AR空间预览（手机扫描房间实时渲染效果）

### 1.2 技术目标

- 现代化Web框架实现、部署快速简便
- 简洁架构（表示层、业务逻辑层、数据层）
- 支持接入大模型API
- 支持Docker一键部署
- 快速原型开发与展示

## 2. 系统架构

### 2.1 整体架构

采用简化的前后端分离架构设计：

```mermaid
flowchart TD
    Client["客户端层\n(Web浏览器/移动设备)"]
    
    subgraph "前端应用层"
        UI["UI组件"]
        State["状态管理"]
        API_Client["API客户端"]
    end
    
    subgraph "后端服务层"
        API["API路由"]
        Services["业务服务"]
        AI_Bridge["AI服务桥接"]
    end
    
    subgraph "数据层"
        DB[(数据库)]
        AI_Services["AI服务\n(第三方API)"]
    end
    
    Client <--> UI
    UI <--> State
    State <--> API_Client
    API_Client <--> API
    API <--> Services
    Services <--> DB
    Services <--> AI_Bridge
    AI_Bridge <--> AI_Services
```

### 2.2 技术栈选择

#### 前端技术栈
- **框架**: React.js
- **UI库**: Material-UI / Ant Design
- **状态管理**: Redux Toolkit
- **路由**: React Router
- **构建工具**: Vite
- **AR实现**: AR.js / Three.js

#### 后端技术栈
- **框架**: Node.js + Express.js
- **数据库**: MongoDB (快速原型阶段)
- **AI集成**: OpenAI API / 其他大模型API适配器

#### DevOps
- **容器化**: Docker
- **配置管理**: Docker Compose

## 3. 详细设计

### 3.1 前端架构

```mermaid
flowchart TD
    subgraph "前端应用"
        Router["路由管理"]
        
        subgraph "页面组件"
            Home["首页"]
            RequirementForm["需求收集表单"]
            PriceCalculator["价格计算器"]
            ComparisonTool["方案对比工具"]
            FloorplanAnalysis["户型诊断"]
            StyleTest["风格测试"]
            ARPreview["AR预览"]
        end
        
        subgraph "共享组件"
            UIKit["UI组件库"]
            Forms["表单组件"]
            Visualizations["可视化组件"]
            ARComponents["AR组件"]
        end
        
        subgraph "状态管理"
            Store["Redux Store"]
            Actions["Actions"]
            Reducers["Reducers"]
        end
        
        subgraph "服务"
            APIService["API服务"]
        end
    end
    
    Router --> Home & RequirementForm & PriceCalculator & ComparisonTool & FloorplanAnalysis & StyleTest & ARPreview
    Home --> UIKit
    RequirementForm --> Forms
    PriceCalculator --> Visualizations
    ComparisonTool --> Visualizations
    FloorplanAnalysis --> Visualizations
    StyleTest --> Forms
    ARPreview --> ARComponents
    
    Home & RequirementForm & PriceCalculator & ComparisonTool & FloorplanAnalysis & StyleTest & ARPreview --> Store
    Store --> APIService
```

### 3.2 后端架构

```mermaid
flowchart TD
    subgraph "API路由层"
        Routes["路由"]
        Middleware["中间件\n(日志/错误处理)"]
        Validation["输入验证"]
    end
    
    subgraph "业务逻辑层"
        RequirementService["需求服务"]
        PricingService["报价服务"]
        DesignService["设计服务"]
        AIBridgeService["AI桥接服务"]
    end
    
    subgraph "数据访问层"
        Models["数据模型"]
        Repositories["数据仓库"]
    end
    
    subgraph "外部服务"
        DB[(MongoDB)]
        AIProviders["AI服务提供商"]
    end
    
    Routes --> RequirementService & PricingService & DesignService
    Middleware --> Routes
    Validation --> Routes
    
    RequirementService & PricingService & DesignService --> Models & Repositories
    AIBridgeService --> AIProviders
    
    Models & Repositories --> DB
```

### 3.3 数据模型

```mermaid
erDiagram
    PROJECT {
        string id PK
        string name
        string description
        date createdAt
    }
    
    REQUIREMENT {
        string id PK
        string projectId FK
        json stylePreferences
        json materialList
        string specialRequirements
        number area
        date createdAt
    }
    
    QUOTATION {
        string id PK
        string projectId FK
        string name
        number totalPrice
        json itemizedCosts
        date createdAt
    }
    
    DESIGN_ANALYSIS {
        string id PK
        string projectId FK
        string floorplanUrl
        json analysisResults
        date createdAt
    }
    
    STYLE_REPORT {
        string id PK
        json questionnaireResponses
        json stylePreferences
        json recommendations
        date createdAt
    }
    
    AR_MODEL {
        string id PK
        string projectId FK
        string modelUrl
        string textureUrl
        json metadata
        date createdAt
    }
    
    PROJECT ||--o| REQUIREMENT : "has"
    PROJECT ||--o{ QUOTATION : "has"
    PROJECT ||--o| DESIGN_ANALYSIS : "has"
    PROJECT ||--o{ AR_MODEL : "has"
```

## 4. 功能模块设计

### 4.1 需求收集表单

**功能描述**：用户填写装修需求的表单，包括风格偏好、材料选择、特殊需求等。

**表单结构**：
1. **基本信息**
   - 房屋面积（平方米）
   - 房型（几室几厅）
   - 装修预算范围
   - 期望完工时间

2. **风格偏好**
   - 装修风格选择（现代简约、北欧、中式、美式、工业风等）
   - 色彩倾向（冷色调、暖色调、中性色调）
   - 参考图片上传（用户可上传喜欢的装修效果图）

3. **材料选择**
   - 地面材料（木地板、瓷砖、大理石等）
   - 墙面材料（乳胶漆、壁纸、硅藻泥等）
   - 厨卫材料（橱柜台面、洁具等）
   - 门窗材料（实木门、复合门等）

4. **功能需求**
   - 收纳需求（高/中/低）
   - 照明需求（自然光/人工光偏好）
   - 智能家居需求（智能照明、智能安防等）
   - 特殊功能区（书房、健身区、影音区等）

5. **特殊需求**
   - 老人/儿童适老化设计需求
   - 宠物友好设计需求
   - 环保材料需求
   - 其他特殊要求（文本框自由填写）

**关键组件**：
- 多步骤表单UI（分步引导用户完成）
- 实时表单验证
- 材料选择器（带预览图和简要说明）
- 风格选择器（带图片参考和风格特点说明）
- 预算估算提示（根据已选项目给出预估范围）

**数据流**：
```mermaid
sequenceDiagram
    actor User as 用户
    participant FormComponent as 表单组件
    participant RequirementService as 需求服务
    participant Database as 数据库
    
    User->>FormComponent: 填写需求表单
    FormComponent->>FormComponent: 本地验证
    FormComponent->>RequirementService: 提交需求数据
    RequirementService->>RequirementService: 业务验证
    RequirementService->>Database: 保存需求
    Database-->>RequirementService: 确认保存
    RequirementService-->>FormComponent: 返回结果
    FormComponent-->>User: 显示确认信息
```

### 4.2 价格计算器

**功能描述**：根据用户输入的面积、选择的材料和装修复杂度，自动计算装修预算。

**关键组件**：
- 交互式计算器UI
- 实时价格更新
- 材料价格数据库
- 报价明细生成器

**计算逻辑**：
```mermaid
flowchart TD
    Start(开始) --> InputData(收集输入数据)
    InputData --> CalcBasePrice(计算基础价格<br>面积 × 基础单价)
    CalcBasePrice --> CalcMaterials(计算材料费用)
    CalcMaterials --> CalcComplexity(应用复杂度系数)
    CalcComplexity --> CalcLabor(计算人工费用)
    CalcLabor --> CalcTotal(计算总价)
    CalcTotal --> GenerateQuote(生成详细报价)
    GenerateQuote --> End(结束)
```

### 4.3 户型诊断

**功能描述**：用户上传户型图，系统利用AI分析户型特点并提供优化建议。

**关键组件**：
- 图片上传组件
- 图像处理服务
- AI分析引擎
- 可视化结果展示

**处理流程**：
```mermaid
sequenceDiagram
    actor User as 用户
    participant Frontend as 前端
    participant ImageService as 图像服务
    participant AIBridge as AI桥接
    participant AIProvider as AI提供商
    
    User->>Frontend: 上传户型图
    Frontend->>ImageService: 提交图片
    ImageService->>ImageService: 预处理图片
    ImageService->>AIBridge: 请求分析
    AIBridge->>AIProvider: 调用AI服务
    AIProvider-->>AIBridge: 返回分析结果
    AIBridge-->>ImageService: 处理结果
    ImageService-->>Frontend: 返回分析数据
    Frontend-->>User: 展示诊断结果
```

### 4.4 AI风格测试

**功能描述**：通过问卷形式了解用户偏好，利用AI生成个性化风格报告。

**关键组件**：
- 交互式问卷
- 风格偏好算法
- AI推荐引擎
- 可视化风格报告

**数据处理**：
```mermaid
flowchart TD
    Start(开始) --> CollectAnswers(收集问卷答案)
    CollectAnswers --> ProcessResponses(处理用户回答)
    ProcessResponses --> ExtractPreferences(提取关键偏好)
    ExtractPreferences --> AIAnalysis(AI分析偏好)
    AIAnalysis --> GenerateReport(生成风格报告)
    GenerateReport --> RecommendStyles(推荐设计风格)
    RecommendStyles --> End(结束)
```

### 4.5 AR空间预览

**功能描述**：用户通过手机扫描房间，实时渲染装修效果。

**关键组件**：
- AR.js/Three.js集成
- 3D模型加载器
- 空间识别算法
- 材质渲染引擎

**技术流程**：
```mermaid
sequenceDiagram
    actor User as 用户
    participant ARApp as AR应用
    participant ModelService as 模型服务
    participant RenderEngine as 渲染引擎
    
    User->>ARApp: 扫描房间
    ARApp->>ARApp: 识别空间
    ARApp->>ModelService: 请求3D模型
    ModelService-->>ARApp: 返回模型数据
    ARApp->>RenderEngine: 渲染模型
    RenderEngine-->>ARApp: 返回渲染结果
    ARApp-->>User: 显示AR效果
```

## 5. AI服务集成

### 5.1 AI服务桥接架构

```mermaid
flowchart TD
    subgraph "应用服务"
        Services["业务服务"]
    end
    
    subgraph "AI桥接层"
        AIBridge["AI服务桥接"]
        Adapters["适配器"]
        PromptManager["提示词管理"]
    end
    
    subgraph "AI服务提供商"
        OpenAI["OpenAI API"]
        LocalModel["本地模型"]
        OtherAI["其他AI服务"]
    end
    
    Services --> AIBridge
    AIBridge --> Adapters
    Adapters --> PromptManager
    PromptManager --> OpenAI
    PromptManager --> LocalModel
    PromptManager --> OtherAI
```

### 5.2 AI功能映射

| 功能模块 | AI服务类型 | 用途 |
|---------|-----------|------|
| 户型诊断 | 计算机视觉 + LLM | 分析户型图，识别空间布局，提供优化建议 |
| 风格测试 | LLM | 分析用户偏好，生成个性化风格报告 |
| 价格计算 | 结构化数据 + LLM | 根据项目参数智能估算成本 |
| AR预览 | 计算机视觉 + 3D渲染 | 空间识别与虚拟家具放置 |

## 6. 部署架构

### 6.1 Docker部署结构

```mermaid
flowchart TD
    subgraph "Docker Compose"
        subgraph "前端容器"
            Nginx["Nginx"]
            ReactApp["React应用"]
        end
        
        subgraph "后端容器"
            NodeApp["Node.js应用"]
            Express["Express服务"]
        end
        
        subgraph "数据库容器"
            MongoDB[(MongoDB)]
        end
    end
    
    Client["客户端"] --> Nginx
    Nginx --> ReactApp
    ReactApp --> NodeApp
    NodeApp --> Express
    Express --> MongoDB
```

### 6.2 部署配置

**docker-compose.yml 结构**：
```yaml
version: '3'
services:
  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - backend
  
  backend:
    build: ./backend
    ports:
      - "3000:3000"
    depends_on:
      - mongodb
    environment:
      - MONGODB_URI=mongodb://mongodb:27017/decoration
      - AI_API_KEY=${AI_API_KEY}
  
  mongodb:
    image: mongo:latest
    volumes:
      - mongo-data:/data/db
    ports:
      - "27017:27017"

volumes:
  mongo-data:
```

## 7. 原型开发计划

### 7.1 优先级划分

1. **第一阶段（核心功能）**
   - 需求收集表单
   - 价格计算器
   - 基础用户界面

2. **第二阶段（增强功能）**
   - 报价对比工具
   - AI风格测试（基础版）
   - 户型诊断（基础版）

3. **第三阶段（高级功能）**
   - AR空间预览
   - 高级AI功能

### 7.2 快速原型开发路线图

```mermaid
gantt
    title 快速原型开发路线图
    dateFormat  YYYY-MM-DD
    section 基础架构
    项目初始化            :a1, 2023-01-01, 3d
    前后端框架搭建        :a2, after a1, 5d
    数据库设计            :a3, after a1, 3d
    
    section 第一阶段
    需求收集表单          :b1, after a3, 7d
    价格计算器            :b2, after b1, 5d
    基础UI实现            :b3, after a2, 7d
    
    section 第二阶段
    报价对比工具          :c1, after b2, 5d
    AI风格测试(基础版)    :c2, after b1, 7d
    户型诊断(基础版)      :c3, after c2, 7d
    
    section 第三阶段
    AR预览基础功能        :d1, after c3, 10d
    高级AI功能            :d2, after c2, 7d
```

## 8. 技术风险与缓解策略

| 风险 | 影响 | 缓解策略 |
|------|------|---------|
| AI API成本高 | 运营成本增加 | 实现本地缓存、批处理请求、设置使用限额 |
| AR兼容性问题 | 用户体验受限 | 提供降级方案，如2D预览模式 |
| 技术复杂度 | 开发延期 | 模块化设计、优先实现核心功能 |

## 9. 总结

本架构设计文档提供了装修工作室Web应用原型的精简设计方案，聚焦于快速原型开发与展示。采用现代化的前后端分离架构，结合AI技术，实现从需求收集到智能设计分析的装修服务平台。

设计重点关注：
1. 核心功能优先实现
2. 简化架构，快速部署
3. AI服务灵活集成
4. 用户体验优先，提供直观的交互界面
5. 快速原型迭代 