# 标题可读性改进说明

## 问题描述
标题与背景图片重叠会大大影响标题的可读性，特别是在流式浏览模式下，文字可能因为背景图片的颜色或图案而难以阅读。

## 解决方案
实现了标题背景的局部透明模糊效果，在保证美观的前提下增强标题的可读性。

## 实现的技术特性

### 1. 毛玻璃效果 (Glassmorphism)
- 使用 `backdrop-filter: blur()` 创建背景模糊效果
- 半透明背景色提供对比度
- 微妙的边框和阴影增强层次感

### 2. 分层设计
- **标题层**：最强的模糊效果和对比度
- **描述层**：中等模糊效果
- **标签层**：轻微模糊效果

### 3. 响应式适配
- 移动设备上调整模糊强度和内边距
- 保持在不同屏幕尺寸下的可读性

## 具体实现

### 流式浏览页面

#### 标题样式
```css
.streaming-headline {
    backdrop-filter: blur(10px);
    background: rgba(0, 0, 0, 0.3);
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
    padding: 16px 20px;
    border-radius: 12px;
}
```

#### 描述样式
```css
.streaming-description {
    backdrop-filter: blur(8px);
    background: rgba(0, 0, 0, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.05);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    padding: 12px 16px;
    border-radius: 8px;
}
```

#### 标签样式
```css
.streaming-tag {
    backdrop-filter: blur(12px);
    background: rgba(99, 102, 241, 0.4);
    border: 1px solid rgba(99, 102, 241, 0.6);
    box-shadow: 0 2px 8px rgba(99, 102, 241, 0.2);
}
```

### 列表页面

#### 卡片标题
```css
.prompt-title {
    backdrop-filter: blur(6px);
    background: rgba(30, 41, 59, 0.7);
    border: 1px solid rgba(99, 102, 241, 0.1);
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
    padding: 8px 12px;
    border-radius: 6px;
}
```

#### 卡片描述
```css
.prompt-description {
    backdrop-filter: blur(4px);
    background: rgba(30, 41, 59, 0.5);
    border: 1px solid rgba(99, 102, 241, 0.05);
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
    padding: 6px 10px;
    border-radius: 4px;
}
```

### 详情页面

#### 模态框标题
```css
.modal-header h2 {
    backdrop-filter: blur(8px);
    background: rgba(30, 41, 59, 0.8);
    border: 1px solid rgba(99, 102, 241, 0.2);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    padding: 12px 16px;
    border-radius: 8px;
}
```

## 视觉效果特点

### 1. 层次感
- 不同元素使用不同强度的模糊效果
- 标题最突出，描述次之，标签最轻

### 2. 对比度
- 半透明背景提供足够的对比度
- 文字阴影增强可读性
- 边框提供视觉边界

### 3. 现代感
- 毛玻璃效果符合现代设计趋势
- 圆角设计更加友好
- 微妙的阴影增加深度

## 浏览器兼容性

### 支持的浏览器
- Chrome 76+
- Firefox 103+
- Safari 9+
- Edge 79+

### 降级方案
对于不支持 `backdrop-filter` 的浏览器，会显示半透明背景色作为降级方案。

## 性能考虑

### 优化措施
- 使用 `will-change` 属性优化动画性能
- 合理控制模糊半径，避免过度模糊
- 响应式设计减少不必要的重绘

### 建议
- 在低端设备上可以考虑减少模糊效果
- 使用 `transform` 而不是改变布局属性

## 使用效果

### 改进前
- 标题与背景图片重叠，可读性差
- 文字可能被背景图案干扰
- 缺乏视觉层次感

### 改进后
- 标题背景有模糊效果，可读性大幅提升
- 文字清晰可见，不受背景干扰
- 具有现代感的毛玻璃效果
- 良好的视觉层次和对比度

## 维护说明

### 自定义样式
可以通过修改以下CSS变量来调整效果：
- `backdrop-filter` 的模糊半径
- `background` 的透明度和颜色
- `border` 的透明度和颜色
- `box-shadow` 的阴影效果

### 响应式调整
在移动设备上，模糊效果和间距会自动调整以适应小屏幕。
