-- This file contains sample prompts to populate the database
-- Run this after setting up the schema and creating at least one user account

-- Note: You'll need to replace 'YOUR_USER_ID' with an actual user ID from your profiles table
-- To get a user ID, you can:
-- 1. Sign up on your app
-- 2. Run: SELECT id FROM profiles LIMIT 1;
-- 3. Copy that ID and replace 'YOUR_USER_ID' below

-- Sample Prompt 1: Pixar-style dream
INSERT INTO prompts (creator_id, title, cover_image_url, model, prompt_text) VALUES 
(
  'YOUR_USER_ID',
  '我把童年的涂鸦喂给 AI，结果它给了我一个皮克斯风格的梦境！🎨',
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&h=1200&fit=crop',
  'Midjourney v6',
  'A whimsical Pixar-style 3D render of a child''s crayon drawing. A friendly monster with six legs, rainbow-colored fur, and one big googly eye is waving. The scene is set in a sunny, magical forest. The lighting is soft and dreamy, cinematic quality. --ar 16:9 --style raw'
);

-- Sample Prompt 2: Cyberpunk city
INSERT INTO prompts (creator_id, title, cover_image_url, model, prompt_text) VALUES 
(
  'YOUR_USER_ID',
  '一键生成赛博朋克风格的城市夜景，让你的朋友圈瞬间变高级。🌃',
  'https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=800&h=1200&fit=crop',
  'Stable Diffusion XL',
  'cinematic photo, aerial view of a futuristic cyberpunk city at night, sprawling megastructures, glowing neon signs with japanese characters, flying cars leaving light trails, rain-slicked streets reflecting the lights, massive holographic advertisements, moody and atmospheric, 8k, photorealistic.'
);

-- Sample Prompt 3: Photo restoration
INSERT INTO prompts (creator_id, title, cover_image_url, model, prompt_text) VALUES 
(
  'YOUR_USER_ID',
  '当我让我妈的老照片穿越回 18 岁时，她的反应是...😮',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=800&h=1200&fit=crop',
  '豆包',
  '采用细腻皮肤真实质感的风格，画面中展现了一个不改变原图形象的萌萌少女的脸部特写，通过略微仰视的镜头角度进行呈现。人物微微抬头并且人物不占太多画面。背景营造出清新且阳光的场景氛围，少女有着散乱的头发随风飘动的感觉，发型不变，发丝随风飘动，不改变原片发色。她的眼神闪闪发光，其中带着阳光和魅惑的情绪，尽显魅惑高冷的气质。画面着重勾勒了少女的面部细节，高光处理十分讲究，同时画面呈现出带有摄影机胶片噪点的画质，并且有着蓝白色通透效果。原比例，不要改变人脸比例和形象。'
);

-- Additional sample prompts for variety
INSERT INTO prompts (creator_id, title, cover_image_url, model, prompt_text) VALUES 
(
  'YOUR_USER_ID',
  '让你的宠物变成科幻电影主角！🐕‍🦺',
  'https://images.unsplash.com/photo-1534351450181-ea9f78427fe8?w=800&h=1200&fit=crop',
  'DALL-E 3',
  'A heroic portrait of a golden retriever wearing a sleek futuristic space suit, dramatic lighting, cinematic composition, stars and nebula in the background, professional photography, ultra detailed, 4k resolution'
);

INSERT INTO prompts (creator_id, title, cover_image_url, model, prompt_text) VALUES 
(
  'YOUR_USER_ID',
  '用 AI 创造你的梦幻书房，每个细节都是艺术品 📚✨',
  'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&h=1200&fit=crop',
  'Midjourney v6',
  'Cozy library interior, floor to ceiling bookshelves filled with ancient tomes, warm golden lighting from vintage lamps, comfortable leather armchair by the window, rain gently falling outside, magical atmosphere, ultra detailed, architectural photography style --ar 2:3 --v 6'
);
