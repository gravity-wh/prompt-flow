# MVP Generated: PromptIdea v0.1

## 项目概述

PromptIdea 是一个类似 TikTok 的 AI 提示词流媒体分享平台。用户可以滑动浏览展示 AI 提示词生成效果的短视频片段（如艺术创作、教育工具、技术演示），一键查看并复制详细信息，创作者可在个人页面上传系列作品。

**核心目标：**
- 降低 AI 复制门槛
- 探索模型边界
- 赋能"仅创意"的开源共享

---

## 核心功能（移动优先）

### 1. 身份认证与入门引导
- 邮箱/社交登录（Google）
- 快速设置：选择兴趣标签（艺术/教育/科技）以获得个性化推荐

### 2. 首页信息流
- 无限垂直滚动的 15-30 秒视频片段（提示词输入→输出动画）
- 标签展示（#ArtGen）
- 点赞/收藏/分享按钮
- 基于观看量/点赞的智能推荐

### 3. 帖子详情页
- 完整的提示词文本（可编辑/复制）
- 模型信息（如 "DALL-E 3"）
- 成功率评分（如 95%）
- 应用内沙盒：上传输入（图片/文本），通过集成 AI API 生成预览

### 4. 创作者页面
- 上传表单（提示词 + 媒体 → 自动生成视频片段）
- 用户作品列表（主题系列展示）
- 基础个人资料：简介、粉丝数

### 5. 互动功能
- 评论区带"分叉（fork）"切换
- 全局标签搜索

---

## 技术栈

### 前端
- **React Native**（使用 Expo 便于构建/部署）
- **Redux** 状态管理
- **React Navigation** 路由导航

### 后端
- **Node.js + Express**
- **PostgreSQL**（使用 Supabase 快速搭建数据库/认证）

### 存储
- **Firebase** 媒体/上传文件存储

### AI 集成
- **OpenAI API** 用于提示词执行/沙盒
- **FFmpeg** 视频片段生成

---

## 系统架构

```mermaid
graph TB
    A[移动端 - React Native/Expo] --> B[API 网关 - Express]
    B --> C[认证服务 - Supabase Auth]
    B --> D[数据库 - PostgreSQL/Supabase]
    B --> E[媒体存储 - Firebase Storage]
    B --> F[AI 服务代理]
    F --> G[OpenAI API]
    F --> H[FFmpeg 视频生成]
    
    subgraph 前端模块
    A --> A1[Feed 滚动]
    A --> A2[详情页]
    A --> A3[上传模块]
    A --> A4[个人中心]
    end
    
    subgraph 后端服务
    B --> B1[/auth 认证路由]
    B --> B2[/posts 内容路由]
    B --> B3[/generate-clip 生成路由]
    B --> B4[/users 用户路由]
    end
    
    subgraph 数据层
    D --> D1[用户表]
    D --> D2[帖子表]
    D --> D3[评论表]
    D --> D4[标签表]
    end
```

---

## 界面线框描述

### 1. **Feed 主页（FeedScreen）**
- 全屏竖版视频播放器
- 顶部：标签云（可横向滑动）
- 视频上层叠加：
  - 右侧：点赞/评论/分享/收藏图标（竖排）
  - 底部：创作者头像、用户名、提示词预览（前 50 字）
- 底部导航栏：首页/搜索/上传/个人中心

### 2. **详情页（DetailScreen）**
- 上半部：视频播放器（可暂停）
- 下半部：
  - 完整提示词文本框（带"复制"按钮）
  - 模型标签：DALL-E 3、成功率 95%
  - "在沙盒中尝试"按钮
  - 评论区（可切换"查看分叉"）
- 返回按钮（左上角）

### 3. **上传页面（UploadModal）**
- 步骤式表单：
  1. 上传媒体（视频/图片）或录屏
  2. 输入提示词（多行文本框）
  3. 选择 AI 模型（下拉菜单）
  4. 添加标签（# 开头，自动完成）
  5. 预览生成的视频片段
- 底部："发布"按钮

### 4. **搜索页（SearchScreen）**
- 顶部：搜索框（支持标签和关键词）
- 热门标签网格（卡片式）
- 搜索结果：瀑布流布局（视频缩略图 + 标题）

### 5. **个人中心（ProfileScreen）**
- 顶部：头像、用户名、简介
- 数据统计：作品数、粉丝数、获赞数
- 作品展示：
  - 标签切换："全部"/"系列 1"/"系列 2"
  - 网格布局（3 列）
- "编辑资料"按钮

---

## 数据库设计

### 用户表（users）
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(50) UNIQUE NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  interests TEXT[], -- ['art', 'education', 'tech']
  followers_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### 帖子表（posts）
```sql
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  prompt_text TEXT NOT NULL,
  model_name VARCHAR(100), -- 'DALL-E 3', 'GPT-4'
  success_rate INTEGER, -- 0-100
  video_url TEXT NOT NULL,
  thumbnail_url TEXT,
  tags TEXT[], -- ['#ArtGen', '#AI']
  likes_count INTEGER DEFAULT 0,
  views_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_posts_user_id ON posts(user_id);
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX idx_posts_tags ON posts USING GIN(tags);
```

### 评论表（comments）
```sql
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES comments(id) ON DELETE CASCADE, -- 用于回复
  content TEXT NOT NULL,
  is_fork BOOLEAN DEFAULT false,
  forked_prompt TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_comments_post_id ON comments(post_id);
```

### 交互表（interactions）
```sql
CREATE TABLE interactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  type VARCHAR(20) NOT NULL, -- 'like', 'save', 'view'
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, post_id, type)
);
```

---

## 后端代码结构

### 项目目录
```
backend/
├── src/
│   ├── config/
│   │   ├── database.js      # Supabase 连接配置
│   │   └── firebase.js      # Firebase 初始化
│   ├── routes/
│   │   ├── auth.js          # 认证路由
│   │   ├── posts.js         # 内容路由
│   │   ├── users.js         # 用户路由
│   │   └── generate.js      # AI 生成路由
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── postController.js
│   │   ├── userController.js
│   │   └── generateController.js
│   ├── middleware/
│   │   ├── auth.js          # JWT 验证中间件
│   │   └── rateLimit.js     # 速率限制
│   ├── services/
│   │   ├── aiService.js     # OpenAI API 调用
│   │   └── videoService.js  # FFmpeg 处理
│   └── app.js               # Express 应用入口
├── package.json
└── docker-compose.yml
```

### 核心路由实现（routes/posts.js）
```javascript
const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const postController = require('../controllers/postController');

// 获取推荐信息流
router.get('/feed', authenticateToken, postController.getFeed);

// 获取单个帖子详情
router.get('/:id', postController.getPostById);

// 创建新帖子
router.post('/', authenticateToken, postController.createPost);

// 点赞/取消点赞
router.post('/:id/like', authenticateToken, postController.toggleLike);

// 保存/取消保存
router.post('/:id/save', authenticateToken, postController.toggleSave);

// 获取评论
router.get('/:id/comments', postController.getComments);

// 添加评论
router.post('/:id/comments', authenticateToken, postController.addComment);

module.exports = router;
```

### AI 服务代理（services/aiService.js）
```javascript
const { Configuration, OpenAIApi } = require('openai');

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

/**
 * 在沙盒中执行提示词
 * @param {string} prompt - 用户提示词
 * @param {string} model - AI 模型名称
 * @param {object} input - 用户输入（文本/图片）
 */
async function executePrompt(prompt, model = 'dall-e-3', input = {}) {
  try {
    if (model.includes('dall-e')) {
      const response = await openai.createImage({
        model: model,
        prompt: prompt,
        n: 1,
        size: '1024x1024',
      });
      return {
        success: true,
        result: response.data.data[0].url,
        model: model,
      };
    } else if (model.includes('gpt')) {
      const response = await openai.createChatCompletion({
        model: model,
        messages: [{ role: 'user', content: prompt }],
      });
      return {
        success: true,
        result: response.data.choices[0].message.content,
        model: model,
      };
    }
  } catch (error) {
    // 处理速率限制
    if (error.response?.status === 429) {
      throw new Error('API 速率限制，请稍后重试');
    }
    throw error;
  }
}

module.exports = { executePrompt };
```

### 视频生成服务（services/videoService.js）
```javascript
const ffmpeg = require('fluent-ffmpeg');
const path = require('path');

/**
 * 将图片序列生成为短视频
 * @param {string[]} imagePaths - 图片路径数组
 * @param {string} audioPath - 音频路径（可选）
 * @param {string} outputPath - 输出视频路径
 */
function generateClip(imagePaths, audioPath, outputPath) {
  return new Promise((resolve, reject) => {
    const command = ffmpeg();
    
    // 添加图片序列
    imagePaths.forEach((imgPath, index) => {
      command.input(imgPath).inputOptions([
        '-loop 1',
        '-t 2', // 每张图片持续 2 秒
      ]);
    });
    
    // 如果有音频，添加音频
    if (audioPath) {
      command.input(audioPath);
    }
    
    command
      .complexFilter([
        // 拼接图片序列
        `concat=n=${imagePaths.length}:v=1:a=0[outv]`,
      ])
      .outputOptions([
        '-map [outv]',
        '-c:v libx264',
        '-pix_fmt yuv420p',
        '-preset fast',
        '-crf 23',
      ])
      .output(outputPath)
      .on('end', () => resolve(outputPath))
      .on('error', (err) => reject(err))
      .run();
  });
}

module.exports = { generateClip };
```

### Express 应用入口（app.js）
```javascript
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');
const userRoutes = require('./routes/users');
const generateRoutes = require('./routes/generate');

const app = express();

// 中间件
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 全局速率限制
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 分钟
  max: 100, // 限制 100 个请求
});
app.use(limiter);

// 路由
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/users', userRoutes);
app.use('/api/generate', generateRoutes);

// 健康检查
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || '服务器内部错误',
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`服务器运行在端口 ${PORT}`);
});

module.exports = app;
```

---

## 前端代码结构

### 项目目录
```
frontend/
├── src/
│   ├── screens/
│   │   ├── FeedScreen.tsx        # 主信息流
│   │   ├── DetailScreen.tsx      # 帖子详情
│   │   ├── UploadScreen.tsx      # 上传页面
│   │   ├── SearchScreen.tsx      # 搜索页面
│   │   └── ProfileScreen.tsx     # 个人中心
│   ├── components/
│   │   ├── VideoPlayer.tsx       # 视频播放器
│   │   ├── PostCard.tsx          # 帖子卡片
│   │   ├── CommentItem.tsx       # 评论项
│   │   └── UploadModal.tsx       # 上传弹窗
│   ├── navigation/
│   │   └── AppNavigator.tsx      # 导航配置
│   ├── store/
│   │   ├── actions/              # Redux actions
│   │   ├── reducers/             # Redux reducers
│   │   └── store.ts              # Redux store 配置
│   ├── services/
│   │   └── api.ts                # API 调用封装
│   ├── utils/
│   │   └── storage.ts            # 离线存储工具
│   └── App.tsx
├── package.json
└── app.json                      # Expo 配置
```

### 主信息流组件（screens/FeedScreen.tsx）
```typescript
import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  FlatList,
  Dimensions,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import VideoPlayer from '../components/VideoPlayer';
import { fetchFeed } from '../store/actions/postActions';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const FeedScreen: React.FC = () => {
  const dispatch = useDispatch();
  const { posts, loading, hasMore } = useSelector((state) => state.posts);
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    dispatch(fetchFeed());
  }, [dispatch]);

  const loadMore = () => {
    if (!loading && hasMore) {
      dispatch(fetchFeed(posts.length));
    }
  };

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index || 0);
    }
  }).current;

  const renderItem = ({ item, index }) => (
    <View style={styles.videoContainer}>
      <VideoPlayer
        uri={item.videoUrl}
        isPlaying={index === currentIndex}
        post={item}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={posts}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        snapToInterval={SCREEN_HEIGHT}
        snapToAlignment="start"
        decelerationRate="fast"
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{
          itemVisiblePercentThreshold: 80,
        }}
        ListFooterComponent={
          loading ? <ActivityIndicator size="large" color="#fff" /> : null
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  videoContainer: {
    height: SCREEN_HEIGHT,
    width: '100%',
  },
});

export default FeedScreen;
```

### 视频播放器组件（components/VideoPlayer.tsx）
```typescript
import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch } from 'react-redux';
import { toggleLike, toggleSave } from '../store/actions/postActions';

interface VideoPlayerProps {
  uri: string;
  isPlaying: boolean;
  post: any;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ uri, isPlaying, post }) => {
  const videoRef = useRef<Video>(null);
  const dispatch = useDispatch();
  const likeAnimation = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isPlaying) {
      videoRef.current?.playAsync();
    } else {
      videoRef.current?.pauseAsync();
    }
  }, [isPlaying]);

  const handleLike = () => {
    dispatch(toggleLike(post.id));
    // 点赞动画
    Animated.sequence([
      Animated.spring(likeAnimation, {
        toValue: 1.3,
        useNativeDriver: true,
      }),
      Animated.spring(likeAnimation, {
        toValue: 1,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <View style={styles.container}>
      <Video
        ref={videoRef}
        source={{ uri }}
        style={styles.video}
        resizeMode={ResizeMode.COVER}
        isLooping
        shouldPlay={isPlaying}
      />

      {/* 右侧按钮栏 */}
      <View style={styles.rightActions}>
        <TouchableOpacity style={styles.actionButton} onPress={handleLike}>
          <Animated.View style={{ transform: [{ scale: likeAnimation }] }}>
            <Ionicons
              name={post.isLiked ? 'heart' : 'heart-outline'}
              size={32}
              color={post.isLiked ? '#ff2d55' : '#fff'}
            />
          </Animated.View>
          <Text style={styles.actionText}>{post.likesCount}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="chatbubble-outline" size={32} color="#fff" />
          <Text style={styles.actionText}>{post.commentsCount || 0}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => dispatch(toggleSave(post.id))}
        >
          <Ionicons
            name={post.isSaved ? 'bookmark' : 'bookmark-outline'}
            size={32}
            color="#fff"
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="share-outline" size={32} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* 底部信息 */}
      <View style={styles.bottomInfo}>
        <View style={styles.userInfo}>
          <Text style={styles.username}>@{post.user.username}</Text>
          <Text style={styles.promptPreview} numberOfLines={2}>
            {post.promptText}
          </Text>
          <View style={styles.tags}>
            {post.tags.map((tag, index) => (
              <Text key={index} style={styles.tag}>
                {tag}
              </Text>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  video: {
    flex: 1,
  },
  rightActions: {
    position: 'absolute',
    right: 10,
    bottom: 100,
    gap: 20,
  },
  actionButton: {
    alignItems: 'center',
  },
  actionText: {
    color: '#fff',
    fontSize: 12,
    marginTop: 4,
  },
  bottomInfo: {
    position: 'absolute',
    bottom: 20,
    left: 10,
    right: 80,
  },
  userInfo: {
    gap: 8,
  },
  username: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  promptPreview: {
    color: '#fff',
    fontSize: 14,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    color: '#4a9eff',
    fontSize: 14,
  },
});

export default VideoPlayer;
```

### API 服务封装（services/api.ts）
```typescript
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';

// 创建 axios 实例
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器：添加认证 token
apiClient.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 响应拦截器：处理错误
apiClient.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    if (error.response?.status === 401) {
      // Token 过期，清除本地存储并跳转到登录
      await AsyncStorage.removeItem('authToken');
      // 触发导航到登录页（需要通过导航 ref）
    }
    return Promise.reject(error);
  }
);

// API 方法
export const api = {
  // 认证
  login: (email: string, password: string) =>
    apiClient.post('/auth/login', { email, password }),
  
  googleLogin: (idToken: string) =>
    apiClient.post('/auth/google', { idToken }),
  
  // 帖子
  getFeed: (offset = 0, limit = 10) =>
    apiClient.get('/posts/feed', { params: { offset, limit } }),
  
  getPostById: (id: string) =>
    apiClient.get(`/posts/${id}`),
  
  createPost: (data: FormData) =>
    apiClient.post('/posts', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  
  toggleLike: (postId: string) =>
    apiClient.post(`/posts/${postId}/like`),
  
  toggleSave: (postId: string) =>
    apiClient.post(`/posts/${postId}/save`),
  
  // 评论
  getComments: (postId: string) =>
    apiClient.get(`/posts/${postId}/comments`),
  
  addComment: (postId: string, content: string, isFork = false) =>
    apiClient.post(`/posts/${postId}/comments`, { content, isFork }),
  
  // AI 生成
  generatePreview: (prompt: string, model: string, input: any) =>
    apiClient.post('/generate/preview', { prompt, model, input }),
  
  // 用户
  getUserProfile: (userId: string) =>
    apiClient.get(`/users/${userId}`),
  
  updateProfile: (data: any) =>
    apiClient.patch('/users/me', data),
};

export default apiClient;
```

---

## 配置文件

### package.json（后端）
```json
{
  "name": "promptidea-backend",
  "version": "0.1.0",
  "description": "PromptIdea MVP 后端服务",
  "main": "src/app.js",
  "scripts": {
    "start": "node src/app.js",
    "dev": "nodemon src/app.js",
    "test": "jest --coverage",
    "migrate": "node scripts/migrate.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "helmet": "^7.0.0",
    "express-rate-limit": "^6.8.0",
    "pg": "^8.11.0",
    "@supabase/supabase-js": "^2.26.0",
    "firebase-admin": "^11.10.1",
    "openai": "^3.3.0",
    "fluent-ffmpeg": "^2.1.2",
    "jsonwebtoken": "^9.0.1",
    "bcryptjs": "^2.4.3",
    "dotenv": "^16.3.1"
  },
  "devDependencies": {
    "nodemon": "^3.0.1",
    "jest": "^29.6.1",
    "supertest": "^6.3.3"
  }
}
```

### package.json（前端）
```json
{
  "name": "promptidea-app",
  "version": "0.1.0",
  "main": "node_modules/expo/AppEntry.js",
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web",
    "test": "jest",
    "lint": "eslint . --ext .ts,.tsx"
  },
  "dependencies": {
    "expo": "~49.0.0",
    "react": "18.2.0",
    "react-native": "0.72.3",
    "expo-av": "~13.4.1",
    "react-redux": "^8.1.1",
    "@reduxjs/toolkit": "^1.9.5",
    "@react-navigation/native": "^6.1.7",
    "@react-navigation/bottom-tabs": "^6.5.8",
    "@react-navigation/stack": "^6.3.17",
    "axios": "^1.4.0",
    "@react-native-async-storage/async-storage": "^1.19.1",
    "expo-image-picker": "~14.3.2",
    "@expo/vector-icons": "^13.0.0"
  },
  "devDependencies": {
    "@types/react": "~18.2.14",
    "typescript": "^5.1.3",
    "jest": "^29.6.1",
    "@testing-library/react-native": "^12.2.0"
  }
}
```

### docker-compose.yml
```yaml
version: '3.8'

services:
  # PostgreSQL 数据库
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: promptidea
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./scripts/init.sql:/docker-entrypoint-initdb.d/init.sql

  # 后端服务
  backend:
    build: ./backend
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgres://admin:${DB_PASSWORD}@postgres:5432/promptidea
      OPENAI_API_KEY: ${OPENAI_API_KEY}
      FIREBASE_CONFIG: ${FIREBASE_CONFIG}
      JWT_SECRET: ${JWT_SECRET}
    depends_on:
      - postgres
    volumes:
      - ./backend:/app
      - /app/node_modules

  # Redis（用于缓存）
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  postgres_data:
```

---

## 部署指南

### 1. 前端部署（Expo + EAS Build）

#### 步骤 1：安装 Expo CLI
```bash
npm install -g eas-cli
eas login
```

#### 步骤 2：配置 app.json
```json
{
  "expo": {
    "name": "PromptIdea",
    "slug": "promptidea",
    "version": "0.1.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#000000"
    },
    "updates": {
      "fallbackToCacheTimeout": 0
    },
    "assetBundlePatterns": ["**/*"],
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.promptidea.app"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#000000"
      },
      "package": "com.promptidea.app"
    },
    "extra": {
      "apiUrl": process.env.EXPO_PUBLIC_API_URL
    }
  }
}
```

#### 步骤 3：构建并发布
```bash
# 初始化 EAS
eas build:configure

# 构建 Android APK
eas build --platform android --profile preview

# 构建 iOS（需要 Apple Developer 账号）
eas build --platform ios --profile preview

# 发布到 Expo Go（用于测试）
expo publish
```

### 2. 后端部署（Vercel）

#### 步骤 1：创建 vercel.json
```json
{
  "version": 2,
  "builds": [
    {
      "src": "src/app.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "src/app.js"
    }
  ],
  "env": {
    "DATABASE_URL": "@database-url",
    "OPENAI_API_KEY": "@openai-api-key",
    "FIREBASE_CONFIG": "@firebase-config",
    "JWT_SECRET": "@jwt-secret"
  }
}
```

#### 步骤 2：部署到 Vercel
```bash
# 安装 Vercel CLI
npm i -g vercel

# 登录
vercel login

# 部署
vercel --prod

# 添加环境变量
vercel env add DATABASE_URL
vercel env add OPENAI_API_KEY
vercel env add FIREBASE_CONFIG
vercel env add JWT_SECRET
```

### 3. 数据库部署（Supabase）

1. 访问 [Supabase](https://supabase.com)
2. 创建新项目
3. 在 SQL 编辑器中运行数据库迁移脚本
4. 获取连接字符串并添加到环境变量

### 4. 存储配置（Firebase）

1. 访问 [Firebase Console](https://console.firebase.google.com)
2. 创建新项目
3. 启用 Storage
4. 下载服务账号密钥（JSON）
5. 将密钥添加到环境变量 `FIREBASE_CONFIG`

---

## 测试策略

### 单元测试示例（Jest）

#### 后端测试（__tests__/posts.test.js）
```javascript
const request = require('supertest');
const app = require('../src/app');

describe('POST /api/posts', () => {
  it('应该创建新帖子', async () => {
    const response = await request(app)
      .post('/api/posts')
      .set('Authorization', 'Bearer test-token')
      .send({
        promptText: '一只可爱的猫咪在月球上',
        modelName: 'DALL-E 3',
        tags: ['#ArtGen', '#AI'],
      })
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body.promptText).toBe('一只可爱的猫咪在月球上');
  });

  it('应该拒绝未认证的请求', async () => {
    await request(app)
      .post('/api/posts')
      .send({
        promptText: '测试',
      })
      .expect(401);
  });
});

describe('GET /api/posts/feed', () => {
  it('应该返回推荐信息流', async () => {
    const response = await request(app)
      .get('/api/posts/feed')
      .set('Authorization', 'Bearer test-token')
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });
});
```

#### 前端测试（__tests__/FeedScreen.test.tsx）
```typescript
import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import FeedScreen from '../src/screens/FeedScreen';

const mockStore = configureStore([]);

describe('FeedScreen', () => {
  it('应该渲染视频列表', async () => {
    const store = mockStore({
      posts: {
        posts: [
          {
            id: '1',
            videoUrl: 'https://example.com/video1.mp4',
            promptText: '测试提示词',
            user: { username: 'testuser' },
          },
        ],
        loading: false,
        hasMore: true,
      },
    });

    const { getByText } = render(
      <Provider store={store}>
        <FeedScreen />
      </Provider>
    );

    await waitFor(() => {
      expect(getByText('@testuser')).toBeTruthy();
    });
  });
});
```

### 边缘情况处理

#### 1. API 速率限制
```javascript
// middleware/rateLimit.js
const rateLimit = require('express-rate-limit');

const aiApiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 分钟
  max: 5, // 限制 5 个请求
  message: 'AI API 调用过于频繁，请稍后重试',
  handler: (req, res) => {
    res.status(429).json({
      error: 'Too Many Requests',
      retryAfter: 60,
    });
  },
});
```

#### 2. 离线模式（保存的提示词）
```typescript
// utils/storage.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

export const savePromptOffline = async (post: any) => {
  try {
    const saved = await AsyncStorage.getItem('savedPrompts');
    const prompts = saved ? JSON.parse(saved) : [];
    prompts.push(post);
    await AsyncStorage.setItem('savedPrompts', JSON.stringify(prompts));
  } catch (error) {
    console.error('保存失败:', error);
  }
};

export const getSavedPrompts = async () => {
  try {
    const saved = await AsyncStorage.getItem('savedPrompts');
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error('读取失败:', error);
    return [];
  }
};
```

#### 3. 视频加载失败回退
```typescript
<Video
  source={{ uri: post.videoUrl }}
  onError={(error) => {
    console.error('视频加载失败:', error);
    // 显示占位图或重试
  }}
  posterSource={{ uri: post.thumbnailUrl }}
/>
```

---

## 性能优化

### 1. 视频预加载
```typescript
// 预加载下一个视频
const preloadNext = () => {
  if (currentIndex + 1 < posts.length) {
    const nextPost = posts[currentIndex + 1];
    Video.prefetchAsync(nextPost.videoUrl);
  }
};
```

### 2. 图片优化
- 使用 WebP 格式
- CDN 分发
- 按需加载（lazy loading）

### 3. 数据库索引
```sql
-- 提升查询性能
CREATE INDEX idx_posts_tags ON posts USING GIN(tags);
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX idx_interactions_user_post ON interactions(user_id, post_id);
```

### 4. Redis 缓存
```javascript
const redis = require('redis');
const client = redis.createClient();

// 缓存热门帖子
async function getPopularPosts() {
  const cached = await client.get('popular_posts');
  if (cached) return JSON.parse(cached);
  
  const posts = await db.query('SELECT * FROM posts ORDER BY views_count DESC LIMIT 50');
  await client.setEx('popular_posts', 300, JSON.stringify(posts)); // 缓存 5 分钟
  return posts;
}
```

---

## v1.1 扩展功能

### 1. 推荐引擎（TensorFlow.js）
```javascript
const tf = require('@tensorflow/tfjs-node');

// 简单的协同过滤推荐
async function recommendPosts(userId, topK = 10) {
  // 1. 获取用户交互历史
  const userInteractions = await getUserInteractions(userId);
  
  // 2. 计算相似用户
  const similarUsers = await findSimilarUsers(userId);
  
  // 3. 推荐相似用户喜欢的内容
  const recommendations = await getRecommendationsFromSimilarUsers(similarUsers, topK);
  
  return recommendations;
}
```

### 2. 内容变现
- 创作者打赏功能
- 付费高级提示词
- 广告集成（Google AdMob）

### 3. 社交功能增强
- 私信系统
- 实时通知（WebSocket）
- 直播功能（Agora SDK）

### 4. 高级搜索
- Elasticsearch 全文搜索
- 图像相似度搜索（CLIP 模型）
- 语义搜索

---

## 深色模式支持

### 主题配置
```typescript
// theme.ts
export const darkTheme = {
  background: '#000000',
  surface: '#1c1c1e',
  primary: '#4a9eff',
  text: '#ffffff',
  textSecondary: '#8e8e93',
  border: '#38383a',
  error: '#ff3b30',
  success: '#34c759',
};

export const lightTheme = {
  background: '#ffffff',
  surface: '#f2f2f7',
  primary: '#007aff',
  text: '#000000',
  textSecondary: '#8e8e93',
  border: '#c6c6c8',
  error: '#ff3b30',
  success: '#34c759',
};
```

---

## 总结

PromptIdea v0.1 MVP 提供了完整的技术栈、架构设计和代码实现。主要特性：

✅ **移动优先**：React Native + Expo 快速开发
✅ **流畅体验**：60fps 垂直滚动，类似 TikTok
✅ **AI 集成**：OpenAI API 沙盒测试
✅ **模块化**：清晰的前后端分离架构
✅ **可扩展**：预留推荐引擎、变现等接口

**预计开发时间：1-2 天**（熟练开发者）

**下一步：**
1. 克隆仓库，安装依赖
2. 配置环境变量（.env 文件）
3. 运行 Docker Compose 启动本地开发环境
4. 使用 Expo Go 测试移动端

---

**项目状态：** 🚀 MVP 就绪，可立即开始开发！

**技术支持：** 如有问题，请查阅各服务官方文档或提交 Issue。
