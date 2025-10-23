// PromptFlow - Main Application JavaScript

const API_BASE_URL = window.location.origin;

// State
let currentCategory = 'all';
let allPrompts = [];
let currentEditingId = null;
let uploadedImages = [];
let currentImageIndex = 0;
let currentPromptImages = [];

// DOM Elements
const promptsGrid = document.getElementById('promptsGrid');
const promptModal = document.getElementById('promptModal');
const detailModal = document.getElementById('detailModal');
const promptForm = document.getElementById('promptForm');
const addPromptBtn = document.getElementById('addPromptBtn');
const cancelBtn = document.getElementById('cancelBtn');
const modalCloses = document.querySelectorAll('.close');
const categoryButtons = document.querySelectorAll('.category-btn');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadPrompts();
    setupEventListeners();
});

// Setup Event Listeners
function setupEventListeners() {
    // Add prompt button
    addPromptBtn.addEventListener('click', () => {
        currentEditingId = null;
        document.getElementById('modalTitle').textContent = '添加新Prompt';
        promptForm.reset();
        uploadedImages = [];
        updateImagePreview();
        showModal(promptModal);
    });

    // Cancel button
    cancelBtn.addEventListener('click', () => {
        hideModal(promptModal);
    });

    // Close buttons
    modalCloses.forEach(close => {
        close.addEventListener('click', () => {
            hideModal(promptModal);
            hideModal(detailModal);
        });
    });

    // Click outside modal to close
    window.addEventListener('click', (e) => {
        if (e.target === promptModal) {
            hideModal(promptModal);
        }
        if (e.target === detailModal) {
            hideModal(detailModal);
        }
    });

    // Form submission
    promptForm.addEventListener('submit', handleFormSubmit);

    // Category buttons
    categoryButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            categoryButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentCategory = btn.dataset.category;
            filterPrompts();
        });
    });

    // Image upload functionality
    setupImageUpload();
    
    // Image carousel functionality
    setupImageCarousel();
}

// Load Prompts
async function loadPrompts() {
    try {
        promptsGrid.innerHTML = '<div class="loading"></div>';
        
        const response = await fetch(`${API_BASE_URL}/api/prompts`);
        if (!response.ok) throw new Error('Failed to load prompts');
        
        allPrompts = await response.json();
        filterPrompts();
    } catch (error) {
        console.error('Error loading prompts:', error);
        promptsGrid.innerHTML = '<p class="loading">加载失败，请刷新页面重试</p>';
    }
}

// Filter Prompts by Category
function filterPrompts() {
    const filtered = currentCategory === 'all' 
        ? allPrompts 
        : allPrompts.filter(p => p.category === currentCategory);
    
    renderPrompts(filtered);
}

// Render Prompts Grid
function renderPrompts(prompts) {
    if (prompts.length === 0) {
        promptsGrid.innerHTML = '<p class="loading">暂无Prompt，点击右上角添加第一个吧！</p>';
        return;
    }

    promptsGrid.innerHTML = prompts.map(prompt => `
        <div class="prompt-card" onclick="showPromptDetail(${prompt.id})">
            <img src="${prompt.effect_image || 'https://via.placeholder.com/400x300/1e293b/cbd5e1?text=No+Image'}" 
                 alt="${prompt.headline}" 
                 class="prompt-image"
                 onerror="this.src='https://via.placeholder.com/400x300/1e293b/cbd5e1?text=No+Image'">
            <div class="prompt-content">
                <div class="prompt-header">
                    <h3 class="prompt-title">${escapeHtml(prompt.headline)}</h3>
                    <p class="prompt-description">${escapeHtml(prompt.description)}</p>
                </div>
                <div class="prompt-meta">
                    <span class="tag">${escapeHtml(prompt.model)}</span>
                    <span class="tag category">${escapeHtml(prompt.category)}</span>
                </div>
            </div>
        </div>
    `).join('');
}

// Show Prompt Detail
window.showPromptDetail = async function(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/prompts/${id}`);
        if (!response.ok) throw new Error('Failed to load prompt details');
        
        const prompt = await response.json();
        
        document.getElementById('detailHeadline').textContent = prompt.headline;
        document.getElementById('detailModel').textContent = prompt.model;
        document.getElementById('detailMode').textContent = prompt.mode;
        document.getElementById('detailCategory').textContent = prompt.category;
        document.getElementById('detailAuthor').textContent = prompt.author;
        document.getElementById('detailPromptText').textContent = prompt.prompt_text;
        
        // Handle images
        currentPromptImages = prompt.images || [];
        if (currentPromptImages.length === 0 && prompt.effect_image) {
            currentPromptImages = [prompt.effect_image];
        }
        
        currentImageIndex = 0;
        updateCarouselImage();
        updateCarouselIndicators();
        
        // Setup edit and delete buttons
        document.getElementById('editPromptBtn').onclick = () => {
            hideModal(detailModal);
            editPrompt(prompt);
        };
        
        document.getElementById('deletePromptBtn').onclick = () => {
            if (confirm('确定要删除这个Prompt吗？此操作不可撤销。')) {
                deletePrompt(id);
            }
        };
        
        showModal(detailModal);
    } catch (error) {
        console.error('Error loading prompt details:', error);
        alert('加载详情失败，请重试');
    }
}

// Edit Prompt
function editPrompt(prompt) {
    currentEditingId = prompt.id;
    document.getElementById('modalTitle').textContent = '编辑Prompt';
    
    document.getElementById('headline').value = prompt.headline;
    document.getElementById('description').value = prompt.description;
    document.getElementById('model').value = prompt.model;
    document.getElementById('mode').value = prompt.mode;
    document.getElementById('category').value = prompt.category;
    document.getElementById('author').value = prompt.author;
    document.getElementById('promptText').value = prompt.prompt_text;
    document.getElementById('effectImage').value = prompt.effect_image || '';
    
    // Load existing images
    uploadedImages = prompt.images || [];
    updateImagePreview();
    
    showModal(promptModal);
}

// Handle Form Submit
async function handleFormSubmit(e) {
    e.preventDefault();
    
    const formData = {
        headline: document.getElementById('headline').value,
        description: document.getElementById('description').value,
        model: document.getElementById('model').value,
        mode: document.getElementById('mode').value,
        category: document.getElementById('category').value,
        author: document.getElementById('author').value,
        prompt_text: document.getElementById('promptText').value,
        effect_image: document.getElementById('effectImage').value,
        images: uploadedImages
    };
    
    try {
        let response;
        if (currentEditingId) {
            // Update existing prompt
            response = await fetch(`${API_BASE_URL}/api/prompts/${currentEditingId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
        } else {
            // Create new prompt
            response = await fetch(`${API_BASE_URL}/api/prompts`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
        }
        
        if (!response.ok) throw new Error('Failed to save prompt');
        
        hideModal(promptModal);
        loadPrompts();
        
        alert(currentEditingId ? 'Prompt更新成功！' : 'Prompt添加成功！');
    } catch (error) {
        console.error('Error saving prompt:', error);
        alert('保存失败，请重试');
    }
}

// Delete Prompt
async function deletePrompt(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/prompts/${id}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) throw new Error('Failed to delete prompt');
        
        hideModal(detailModal);
        loadPrompts();
        
        alert('Prompt删除成功！');
    } catch (error) {
        console.error('Error deleting prompt:', error);
        alert('删除失败，请重试');
    }
}

// Modal Helpers
function showModal(modal) {
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function hideModal(modal) {
    modal.classList.remove('show');
    document.body.style.overflow = 'auto';
}

// HTML Escape
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Image Upload Functions
function setupImageUpload() {
    const imageUpload = document.getElementById('imageUpload');
    const uploadArea = document.getElementById('uploadArea');
    const imagePreviewContainer = document.getElementById('imagePreviewContainer');

    // Click to upload
    uploadArea.addEventListener('click', () => {
        imageUpload.click();
    });

    // File input change
    imageUpload.addEventListener('change', handleFileSelect);

    // Drag and drop
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    });

    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('dragover');
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        const files = e.dataTransfer.files;
        handleFiles(files);
    });
}

function handleFileSelect(e) {
    const files = e.target.files;
    handleFiles(files);
}

function handleFiles(files) {
    const fileArray = Array.from(files);
    const imageFiles = fileArray.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length === 0) {
        alert('请选择图片文件');
        return;
    }

    // Upload files to server
    uploadImages(imageFiles);
}

async function uploadImages(files) {
    const formData = new FormData();
    files.forEach(file => {
        formData.append('files', file);
    });

    try {
        const response = await fetch(`${API_BASE_URL}/api/upload`, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) throw new Error('Upload failed');

        const result = await response.json();
        
        // Add to uploaded images
        result.files.forEach(file => {
            uploadedImages.push(file.path);
        });

        // Update preview
        updateImagePreview();
    } catch (error) {
        console.error('Upload error:', error);
        alert('图片上传失败，请重试');
    }
}

function updateImagePreview() {
    const container = document.getElementById('imagePreviewContainer');
    container.innerHTML = '';

    uploadedImages.forEach((imagePath, index) => {
        const preview = document.createElement('div');
        preview.className = 'image-preview';
        preview.innerHTML = `
            <img src="${imagePath}" alt="Preview ${index + 1}">
            <button class="remove-btn" onclick="removeImage(${index})">&times;</button>
        `;
        container.appendChild(preview);
    });
}

function removeImage(index) {
    uploadedImages.splice(index, 1);
    updateImagePreview();
}

// Image Carousel Functions
function setupImageCarousel() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const indicators = document.getElementById('imageIndicators');

    if (prevBtn) prevBtn.addEventListener('click', () => changeImage(-1));
    if (nextBtn) nextBtn.addEventListener('click', () => changeImage(1));
    if (indicators) indicators.addEventListener('click', (e) => {
        if (e.target.classList.contains('image-indicator')) {
            const index = Array.from(e.target.parentNode.children).indexOf(e.target);
            setCurrentImage(index);
        }
    });
}

function changeImage(direction) {
    if (currentPromptImages.length <= 1) return;
    
    currentImageIndex += direction;
    if (currentImageIndex < 0) currentImageIndex = currentPromptImages.length - 1;
    if (currentImageIndex >= currentPromptImages.length) currentImageIndex = 0;
    
    updateCarouselImage();
    updateCarouselIndicators();
}

function setCurrentImage(index) {
    currentImageIndex = index;
    updateCarouselImage();
    updateCarouselIndicators();
}

function updateCarouselImage() {
    const image = document.getElementById('detailImage');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    if (currentPromptImages.length > 0) {
        image.src = currentPromptImages[currentImageIndex];
    }
    
    // Update button states
    if (prevBtn) prevBtn.disabled = currentPromptImages.length <= 1;
    if (nextBtn) nextBtn.disabled = currentPromptImages.length <= 1;
}

function updateCarouselIndicators() {
    const indicators = document.getElementById('imageIndicators');
    if (!indicators) return;
    
    indicators.innerHTML = '';
    
    currentPromptImages.forEach((_, index) => {
        const indicator = document.createElement('div');
        indicator.className = `image-indicator ${index === currentImageIndex ? 'active' : ''}`;
        indicators.appendChild(indicator);
    });
}
