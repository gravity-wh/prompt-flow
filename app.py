#!/usr/bin/env python3
"""
PromptFlow - Backend API Server
A Flask-based REST API for managing prompt ideas collection
"""

from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import sqlite3
import os
import json
from datetime import datetime
import base64

app = Flask(__name__)
CORS(app)

DATABASE = 'prompts.db'
UPLOAD_FOLDER = 'static/images'

# Ensure upload folder exists
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def get_db():
    """Create a database connection"""
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    """Initialize the database with schema and sample data"""
    conn = get_db()
    cursor = conn.cursor()
    
    # Create prompts table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS prompts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            model TEXT NOT NULL,
            mode TEXT NOT NULL,
            category TEXT NOT NULL,
            author TEXT NOT NULL,
            prompt_text TEXT NOT NULL,
            headline TEXT NOT NULL,
            description TEXT NOT NULL,
            effect_image TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Check if we need to add sample data
    cursor.execute('SELECT COUNT(*) FROM prompts')
    if cursor.fetchone()[0] == 0:
        # Add sample prompts
        sample_prompts = [
            {
                'model': 'GPT-4',
                'mode': 'Text Generation',
                'category': '科技',
                'author': 'AI Researcher',
                'headline': '智能代码审查助手',
                'description': '自动检测代码中的潜在问题和优化建议',
                'prompt_text': '作为一个资深的代码审查专家，请帮我分析以下代码的质量，包括：1）潜在的bug和错误 2）性能优化建议 3）代码可读性改进 4）最佳实践建议。请提供详细的分析和具体的改进代码示例。',
                'effect_image': 'https://via.placeholder.com/800x600/4A90E2/FFFFFF?text=Code+Review+AI'
            },
            {
                'model': 'DALL-E 3',
                'mode': 'Image Generation',
                'category': '教育',
                'author': 'Education Designer',
                'headline': '互动式科学插图生成器',
                'description': '为教育材料创建生动的科学概念可视化',
                'prompt_text': 'Create a detailed, colorful and educational illustration showing [scientific concept], designed for middle school students. The style should be engaging, clear, and scientifically accurate. Include labels and diagrams that make complex ideas easy to understand.',
                'effect_image': 'https://via.placeholder.com/800x600/50C878/FFFFFF?text=Science+Illustration'
            },
            {
                'model': 'GPT-4',
                'mode': 'Text Generation',
                'category': '健康',
                'author': 'Fitness Coach',
                'headline': '个性化健身计划生成器',
                'description': '根据用户目标和身体状况制定专属训练方案',
                'prompt_text': '作为专业健身教练，请根据以下信息为我制定一个为期8周的健身计划：目标：[增肌/减脂/塑形]，当前体重：[X]kg，身高：[Y]cm，每周可训练天数：[Z]天。请包括：1）详细的训练动作和组数 2）饮食建议 3）进度跟踪方法。',
                'effect_image': 'https://via.placeholder.com/800x600/FF6B6B/FFFFFF?text=Fitness+Plan'
            },
            {
                'model': 'Midjourney',
                'mode': 'Image Generation',
                'category': '运动',
                'author': 'Sports Designer',
                'headline': '运动海报设计生成',
                'description': '创建激励人心的运动主题视觉作品',
                'prompt_text': 'A dynamic sports poster featuring [sport name], dramatic lighting, high contrast, energetic composition, professional athlete in action, stadium background, vibrant colors, motivational atmosphere, 8k quality, photorealistic --ar 2:3 --v 6',
                'effect_image': 'https://via.placeholder.com/800x600/FFD700/000000?text=Sports+Poster'
            },
            {
                'model': 'Claude',
                'mode': 'Text Generation',
                'category': '教育',
                'author': 'Language Teacher',
                'headline': '语言学习对话伙伴',
                'description': '沉浸式语言练习助手，提供实时纠错',
                'prompt_text': '你是一位耐心的[语言]老师。让我们进行日常对话练习，主题是[主题]。请用[语言]和我交谈，如果我犯错，请用中文温和地指出错误，解释正确用法，然后继续对话。请保持对话自然流畅。',
                'effect_image': 'https://via.placeholder.com/800x600/9B59B6/FFFFFF?text=Language+Learning'
            },
            {
                'model': 'Stable Diffusion',
                'mode': 'Image Generation',
                'category': '科技',
                'author': 'UI Designer',
                'headline': '未来科技界面设计',
                'description': '生成具有未来感的用户界面概念',
                'prompt_text': 'Futuristic holographic user interface, sci-fi HUD design, glowing blue and cyan elements, transparent panels, advanced technology dashboard, clean minimalist style, high-tech aesthetics, 3D floating elements, dark background, octane render, 4k --ar 16:9',
                'effect_image': 'https://via.placeholder.com/800x600/00CED1/000000?text=Futuristic+UI'
            }
        ]
        
        for prompt in sample_prompts:
            cursor.execute('''
                INSERT INTO prompts (model, mode, category, author, headline, description, prompt_text, effect_image)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                prompt['model'],
                prompt['mode'],
                prompt['category'],
                prompt['author'],
                prompt['headline'],
                prompt['description'],
                prompt['prompt_text'],
                prompt['effect_image']
            ))
    
    conn.commit()
    conn.close()

@app.route('/')
def index():
    """Serve the main page"""
    return send_from_directory('.', 'index.html')

@app.route('/streaming.html')
def streaming():
    """Serve the streaming page"""
    return send_from_directory('.', 'streaming.html')

@app.route('/api/prompts', methods=['GET'])
def get_prompts():
    """Get all prompts or filter by category"""
    category = request.args.get('category')
    
    conn = get_db()
    cursor = conn.cursor()
    
    if category:
        cursor.execute('SELECT * FROM prompts WHERE category = ? ORDER BY created_at DESC', (category,))
    else:
        cursor.execute('SELECT * FROM prompts ORDER BY created_at DESC')
    
    prompts = []
    for row in cursor.fetchall():
        prompts.append({
            'id': row['id'],
            'model': row['model'],
            'mode': row['mode'],
            'category': row['category'],
            'author': row['author'],
            'headline': row['headline'],
            'description': row['description'],
            'prompt_text': row['prompt_text'],
            'effect_image': row['effect_image'],
            'created_at': row['created_at']
        })
    
    conn.close()
    return jsonify(prompts)

@app.route('/api/prompts/<int:prompt_id>', methods=['GET'])
def get_prompt(prompt_id):
    """Get a specific prompt by ID"""
    conn = get_db()
    cursor = conn.cursor()
    
    cursor.execute('SELECT * FROM prompts WHERE id = ?', (prompt_id,))
    row = cursor.fetchone()
    
    if row is None:
        conn.close()
        return jsonify({'error': 'Prompt not found'}), 404
    
    prompt = {
        'id': row['id'],
        'model': row['model'],
        'mode': row['mode'],
        'category': row['category'],
        'author': row['author'],
        'headline': row['headline'],
        'description': row['description'],
        'prompt_text': row['prompt_text'],
        'effect_image': row['effect_image'],
        'created_at': row['created_at']
    }
    
    conn.close()
    return jsonify(prompt)

@app.route('/api/prompts', methods=['POST'])
def add_prompt():
    """Add a new prompt"""
    data = request.get_json()
    
    # Validate required fields
    required_fields = ['model', 'mode', 'category', 'author', 'headline', 'description', 'prompt_text']
    for field in required_fields:
        if field not in data:
            return jsonify({'error': f'Missing required field: {field}'}), 400
    
    conn = get_db()
    cursor = conn.cursor()
    
    cursor.execute('''
        INSERT INTO prompts (model, mode, category, author, headline, description, prompt_text, effect_image)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        data['model'],
        data['mode'],
        data['category'],
        data['author'],
        data['headline'],
        data['description'],
        data['prompt_text'],
        data.get('effect_image', '')
    ))
    
    prompt_id = cursor.lastrowid
    conn.commit()
    conn.close()
    
    return jsonify({'id': prompt_id, 'message': 'Prompt added successfully'}), 201

@app.route('/api/prompts/<int:prompt_id>', methods=['DELETE'])
def delete_prompt(prompt_id):
    """Delete a prompt"""
    conn = get_db()
    cursor = conn.cursor()
    
    # Check if prompt exists
    cursor.execute('SELECT * FROM prompts WHERE id = ?', (prompt_id,))
    if cursor.fetchone() is None:
        conn.close()
        return jsonify({'error': 'Prompt not found'}), 404
    
    cursor.execute('DELETE FROM prompts WHERE id = ?', (prompt_id,))
    conn.commit()
    conn.close()
    
    return jsonify({'message': 'Prompt deleted successfully'}), 200

@app.route('/api/prompts/<int:prompt_id>', methods=['PUT'])
def update_prompt(prompt_id):
    """Update an existing prompt"""
    data = request.get_json()
    
    conn = get_db()
    cursor = conn.cursor()
    
    # Check if prompt exists
    cursor.execute('SELECT * FROM prompts WHERE id = ?', (prompt_id,))
    if cursor.fetchone() is None:
        conn.close()
        return jsonify({'error': 'Prompt not found'}), 404
    
    # Build update query dynamically based on provided fields
    update_fields = []
    values = []
    
    allowed_fields = ['model', 'mode', 'category', 'author', 'headline', 'description', 'prompt_text', 'effect_image']
    for field in allowed_fields:
        if field in data:
            update_fields.append(f'{field} = ?')
            values.append(data[field])
    
    if not update_fields:
        conn.close()
        return jsonify({'error': 'No fields to update'}), 400
    
    values.append(prompt_id)
    query = f"UPDATE prompts SET {', '.join(update_fields)} WHERE id = ?"
    
    cursor.execute(query, values)
    conn.commit()
    conn.close()
    
    return jsonify({'message': 'Prompt updated successfully'}), 200

@app.route('/api/categories', methods=['GET'])
def get_categories():
    """Get all unique categories"""
    conn = get_db()
    cursor = conn.cursor()
    
    cursor.execute('SELECT DISTINCT category FROM prompts ORDER BY category')
    categories = [row['category'] for row in cursor.fetchall()]
    
    conn.close()
    return jsonify(categories)

if __name__ == '__main__':
    init_db()
    app.run(host='0.0.0.0', port=5000, debug=True)
