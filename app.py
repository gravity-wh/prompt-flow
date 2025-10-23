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
from werkzeug.utils import secure_filename
import uuid

app = Flask(__name__)
CORS(app)

DATABASE = 'prompts.db'
UPLOAD_FOLDER = 'static/images'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp', 'bmp', 'tiff'}

# Ensure upload folder exists
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def allowed_file(filename):
    """Check if file extension is allowed"""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

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
            images TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Create images table for storing multiple images per prompt
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS prompt_images (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            prompt_id INTEGER NOT NULL,
            image_path TEXT NOT NULL,
            is_primary BOOLEAN DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (prompt_id) REFERENCES prompts (id) ON DELETE CASCADE
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
        # Get primary image for this prompt
        cursor.execute('''
            SELECT image_path FROM prompt_images 
            WHERE prompt_id = ? AND is_primary = 1 
            LIMIT 1
        ''', (row['id'],))
        primary_image = cursor.fetchone()
        
        # Get all images for this prompt
        cursor.execute('''
            SELECT image_path FROM prompt_images 
            WHERE prompt_id = ? 
            ORDER BY is_primary DESC, created_at ASC
        ''', (row['id'],))
        all_images = [img['image_path'] for img in cursor.fetchall()]
        
        # Convert relative paths to full URLs
        all_images_urls = [f"{request.url_root.rstrip('/')}{img_path}" if not img_path.startswith('http') else img_path for img_path in all_images]
        
        prompts.append({
            'id': row['id'],
            'model': row['model'],
            'mode': row['mode'],
            'category': row['category'],
            'author': row['author'],
            'headline': row['headline'],
            'description': row['description'],
            'prompt_text': row['prompt_text'],
            'effect_image': primary_image['image_path'] if primary_image else row['effect_image'],
            'images': all_images_urls,
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
    
    # Get all images for this prompt
    cursor.execute('''
        SELECT image_path, is_primary FROM prompt_images 
        WHERE prompt_id = ? 
        ORDER BY is_primary DESC, created_at ASC
    ''', (prompt_id,))
    images_data = cursor.fetchall()
    
    all_images = [img['image_path'] for img in images_data]
    primary_image = next((img['image_path'] for img in images_data if img['is_primary']), None)
    
    # Convert relative paths to full URLs
    all_images_urls = [f"{request.url_root.rstrip('/')}{img_path}" if not img_path.startswith('http') else img_path for img_path in all_images]
    
    prompt = {
        'id': row['id'],
        'model': row['model'],
        'mode': row['mode'],
        'category': row['category'],
        'author': row['author'],
        'headline': row['headline'],
        'description': row['description'],
        'prompt_text': row['prompt_text'],
        'effect_image': primary_image or row['effect_image'],
        'images': all_images_urls,
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
    
    # Add images if provided
    if 'images' in data and data['images']:
        for i, image_path in enumerate(data['images']):
            is_primary = i == 0  # First image is primary
            cursor.execute('''
                INSERT INTO prompt_images (prompt_id, image_path, is_primary)
                VALUES (?, ?, ?)
            ''', (prompt_id, image_path, is_primary))
    
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
    
    if not update_fields and 'images' not in data:
        conn.close()
        return jsonify({'error': 'No fields to update'}), 400
    
    # Update prompt fields
    if update_fields:
        values.append(prompt_id)
        query = f"UPDATE prompts SET {', '.join(update_fields)} WHERE id = ?"
        cursor.execute(query, values)
    
    # Update images if provided
    if 'images' in data:
        # Delete existing images
        cursor.execute('DELETE FROM prompt_images WHERE prompt_id = ?', (prompt_id,))
        
        # Add new images
        if data['images']:
            for i, image_path in enumerate(data['images']):
                is_primary = i == 0  # First image is primary
                cursor.execute('''
                    INSERT INTO prompt_images (prompt_id, image_path, is_primary)
                    VALUES (?, ?, ?)
                ''', (prompt_id, image_path, is_primary))
    
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

@app.route('/api/upload', methods=['POST'])
def upload_image():
    """Upload image files"""
    if 'files' not in request.files:
        return jsonify({'error': 'No files provided'}), 400
    
    files = request.files.getlist('files')
    uploaded_files = []
    
    for file in files:
        if file.filename == '':
            continue
            
        if not allowed_file(file.filename):
            return jsonify({'error': f'File type not allowed: {file.filename}'}), 400
        
        # Generate unique filename
        filename = secure_filename(file.filename)
        name, ext = os.path.splitext(filename)
        unique_filename = f"{uuid.uuid4()}{ext}"
        
        # Save file
        file_path = os.path.join(UPLOAD_FOLDER, unique_filename)
        file.save(file_path)
        
        uploaded_files.append({
            'filename': unique_filename,
            'original_name': filename,
            'path': f'/static/images/{unique_filename}'
        })
    
    return jsonify({
        'message': f'Successfully uploaded {len(uploaded_files)} files',
        'files': uploaded_files
    }), 200

@app.route('/api/prompts/<int:prompt_id>/images', methods=['POST'])
def add_prompt_images():
    """Add images to a specific prompt"""
    prompt_id = request.view_args['prompt_id']
    data = request.get_json()
    
    if 'images' not in data:
        return jsonify({'error': 'No images provided'}), 400
    
    conn = get_db()
    cursor = conn.cursor()
    
    # Check if prompt exists
    cursor.execute('SELECT id FROM prompts WHERE id = ?', (prompt_id,))
    if cursor.fetchone() is None:
        conn.close()
        return jsonify({'error': 'Prompt not found'}), 404
    
    # Add images to database
    for i, image_path in enumerate(data['images']):
        is_primary = i == 0  # First image is primary
        cursor.execute('''
            INSERT INTO prompt_images (prompt_id, image_path, is_primary)
            VALUES (?, ?, ?)
        ''', (prompt_id, image_path, is_primary))
    
    conn.commit()
    conn.close()
    
    return jsonify({'message': 'Images added successfully'}), 200

@app.route('/api/prompts/<int:prompt_id>/images', methods=['GET'])
def get_prompt_images():
    """Get all images for a specific prompt"""
    prompt_id = request.view_args['prompt_id']
    
    conn = get_db()
    cursor = conn.cursor()
    
    cursor.execute('''
        SELECT image_path, is_primary 
        FROM prompt_images 
        WHERE prompt_id = ? 
        ORDER BY is_primary DESC, created_at ASC
    ''', (prompt_id,))
    
    images = []
    for row in cursor.fetchall():
        image_path = row['image_path']
        # Convert relative path to full URL
        full_url = f"{request.url_root.rstrip('/')}{image_path}" if not image_path.startswith('http') else image_path
        images.append({
            'path': full_url,
            'is_primary': bool(row['is_primary'])
        })
    
    conn.close()
    return jsonify(images)

if __name__ == '__main__':
    init_db()
    app.run(host='0.0.0.0', port=5000, debug=True)
