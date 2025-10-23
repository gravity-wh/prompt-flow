// PromptFlow - Streaming Mode JavaScript

const API_BASE_URL = window.location.origin;

let prompts = [];
let currentIndex = 0;

// DOM Elements
const streamingContainer = document.getElementById('streamingContainer');
const currentIndexEl = document.getElementById('currentIndex');
const totalCountEl = document.getElementById('totalCount');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadPrompts();
    setupScrollHandler();
});

// Load Prompts
async function loadPrompts() {
    try {
        streamingContainer.innerHTML = '<div class="streaming-loading">加载中...</div>';
        
        const response = await fetch(`${API_BASE_URL}/api/prompts`);
        if (!response.ok) throw new Error('Failed to load prompts');
        
        prompts = await response.json();
        
        if (prompts.length === 0) {
            streamingContainer.innerHTML = '<div class="streaming-loading">暂无Prompt</div>';
            return;
        }
        
        renderStreamingCards();
        updateCounter();
    } catch (error) {
        console.error('Error loading prompts:', error);
        streamingContainer.innerHTML = '<div class="streaming-loading">加载失败，请刷新页面重试</div>';
    }
}

// Render Streaming Cards
function renderStreamingCards() {
    streamingContainer.innerHTML = prompts.map((prompt, index) => `
        <div class="streaming-card" data-index="${index}">
            <div class="streaming-image-wrapper">
                <img src="${prompt.effect_image || 'https://via.placeholder.com/1200x800/1e293b/cbd5e1?text=No+Image'}" 
                     alt="${escapeHtml(prompt.headline)}" 
                     class="streaming-image"
                     onerror="this.src='https://via.placeholder.com/1200x800/1e293b/cbd5e1?text=No+Image'">
                
                <div class="streaming-overlay">
                    <h2 class="streaming-headline">${escapeHtml(prompt.headline)}</h2>
                    <p class="streaming-description">${escapeHtml(prompt.description)}</p>
                    <div class="streaming-meta">
                        <span class="streaming-tag">${escapeHtml(prompt.model)}</span>
                        <span class="streaming-tag">${escapeHtml(prompt.mode)}</span>
                        <span class="streaming-tag">${escapeHtml(prompt.category)}</span>
                    </div>
                </div>
                
                <div class="expand-indicator" onclick="toggleDetail(${index})">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M6 9l6 6 6-6"/>
                    </svg>
                    查看详情
                </div>
            </div>
            
            <div class="streaming-detail">
                <div class="detail-section">
                    <div class="detail-grid">
                        <div class="detail-item">
                            <div class="detail-item-label">AI模型</div>
                            <div class="detail-item-value">${escapeHtml(prompt.model)}</div>
                        </div>
                        <div class="detail-item">
                            <div class="detail-item-label">模式</div>
                            <div class="detail-item-value">${escapeHtml(prompt.mode)}</div>
                        </div>
                        <div class="detail-item">
                            <div class="detail-item-label">分类</div>
                            <div class="detail-item-value">${escapeHtml(prompt.category)}</div>
                        </div>
                        <div class="detail-item">
                            <div class="detail-item-label">作者</div>
                            <div class="detail-item-value">${escapeHtml(prompt.author)}</div>
                        </div>
                    </div>
                </div>
                
                <div class="detail-section">
                    <h3>Prompt文本</h3>
                    <div class="streaming-prompt-text">${escapeHtml(prompt.prompt_text)}</div>
                </div>
            </div>
        </div>
    `).join('');
    
    totalCountEl.textContent = prompts.length;
}

// Toggle Detail Panel
window.toggleDetail = function(index) {
    const card = document.querySelector(`.streaming-card[data-index="${index}"]`);
    if (card) {
        card.classList.toggle('expanded');
        
        // Update expand indicator
        const indicator = card.querySelector('.expand-indicator');
        if (card.classList.contains('expanded')) {
            indicator.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M18 15l-6-6-6 6"/>
                </svg>
                收起详情
            `;
        } else {
            indicator.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M6 9l6 6 6-6"/>
                </svg>
                查看详情
            `;
        }
    }
}

// Setup Scroll Handler
function setupScrollHandler() {
    let ticking = false;
    
    streamingContainer.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                updateCurrentIndex();
                ticking = false;
            });
            ticking = true;
        }
    });
}

// Update Current Index based on scroll position
function updateCurrentIndex() {
    const scrollTop = streamingContainer.scrollTop;
    const viewportHeight = window.innerHeight;
    
    const index = Math.round(scrollTop / viewportHeight);
    currentIndex = Math.max(0, Math.min(index, prompts.length - 1));
    
    updateCounter();
}

// Update Counter Display
function updateCounter() {
    currentIndexEl.textContent = currentIndex + 1;
}

// HTML Escape
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Keyboard Navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault();
        if (currentIndex < prompts.length - 1) {
            currentIndex++;
            scrollToIndex(currentIndex);
        }
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
        if (currentIndex > 0) {
            currentIndex--;
            scrollToIndex(currentIndex);
        }
    }
});

// Scroll to specific index
function scrollToIndex(index) {
    const viewportHeight = window.innerHeight;
    streamingContainer.scrollTo({
        top: index * viewportHeight,
        behavior: 'smooth'
    });
}
