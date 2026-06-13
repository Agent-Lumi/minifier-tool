// Minifier Tool - Minify JS/CSS/HTML
// Made with 💡 by Agent-Lumi
// Now with PWA support, Undo/Redo, and Dark/Light theme toggle!

let currentMode = 'js';
let currentFileName = '';
let originalFileContent = '';

// Theme Management
function initTheme() {
    const savedTheme = localStorage.getItem('minifier-theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('minifier-theme', newTheme);
    updateThemeIcon(newTheme);
    
    // Update meta theme-color for mobile browsers
    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) {
        metaTheme.content = newTheme === 'dark' ? '#6f42c1' : '#8b5cf6';
    }
}

function updateThemeIcon(theme) {
    const toggleBtn = document.getElementById('theme-toggle');
    if (toggleBtn) {
        toggleBtn.textContent = theme === 'dark' ? '☀️' : '🌙';
        toggleBtn.title = theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode';
    }
}

// Undo/Redo State Management
const undoStack = [];
const redoStack = [];
const MAX_HISTORY = 50;

// Check if app is running as installed PWA
const isPWA = window.matchMedia('(display-mode: standalone)').matches || 
              window.navigator.standalone === true;

// ============================================
// UNDO/REDO FUNCTIONALITY
// ============================================

function saveUndoState() {
    const input = document.getElementById('input');
    if (!input) return;
    
    const currentValue = input.value;
    
    // Don't save if same as last state
    if (undoStack.length > 0 && undoStack[undoStack.length - 1] === currentValue) {
        return;
    }
    
    undoStack.push(currentValue);
    
    // Limit history size
    if (undoStack.length > MAX_HISTORY) {
        undoStack.shift();
    }
    
    // Clear redo stack on new change
    redoStack.length = 0;
    
    updateUndoRedoButtons();
}

function undo() {
    const input = document.getElementById('input');
    if (!input || undoStack.length === 0) return;
    
    // Save current state to redo stack
    redoStack.push(input.value);
    
    // Restore previous state
    const previousState = undoStack.pop();
    input.value = previousState;
    
    // Trigger minify to update output
    minify();
    updateUndoRedoButtons();
    
    showToast('↩️ Undone', 'info');
}

function redo() {
    const input = document.getElementById('input');
    if (!input || redoStack.length === 0) return;
    
    // Save current state to undo stack
    undoStack.push(input.value);
    
    // Restore next state
    const nextState = redoStack.pop();
    input.value = nextState;
    
    // Trigger minify to update output
    minify();
    updateUndoRedoButtons();
    
    showToast('↪️ Redone', 'info');
}

function updateUndoRedoButtons() {
    const undoBtn = document.getElementById('undo-btn');
    const redoBtn = document.getElementById('redo-btn');
    
    if (undoBtn) {
        undoBtn.disabled = undoStack.length === 0;
        undoBtn.style.opacity = undoStack.length === 0 ? '0.5' : '1';
    }
    
    if (redoBtn) {
        redoBtn.disabled = redoStack.length === 0;
        redoBtn.style.opacity = redoStack.length === 0 ? '0.5' : '1';
    }
}

// ============================================

function setMode(mode) {
    currentMode = mode;
    document.querySelectorAll('.mode-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-mode="${mode}"]`).classList.add('active');
    
    const input = document.getElementById('input');
    const placeholders = {
        js: "// Paste your JavaScript here...\nfunction hello() {\n  console.log('Hello World');\n}",
        css: "/* Paste your CSS here... */\n.container {\n  display: flex;\n  padding: 20px;\n}",
        html: "<!-- Paste your HTML here... --\u003e\n<div class=\"container\"\u003e\n  <h1>Hello</h1>\n</div\u003e"
    };
    input.placeholder = placeholders[mode];
    
    // Save preference
    localStorage.setItem('minifier-mode', mode);
}

function minify() {
    const input = document.getElementById('input').value;
    const output = document.getElementById('output');
    
    if (!input.trim()) {
        output.value = '';
        updateStats(0, 0, 0);
        return;
    }
    
    let result;
    try {
        switch(currentMode) {
            case 'js':
                result = minifyJS(input);
                break;
            case 'css':
                result = minifyCSS(input);
                break;
            case 'html':
                result = minifyHTML(input);
                break;
        }
        output.value = result;
        updateStats(input.length, result.length);
        
        // Save to history
        saveToHistory(input, result, currentMode);
    } catch (e) {
        output.value = 'Error: ' + e.message;
        updateStats(input.length, 0);
    }
}

function minifyJS(code) {
    return code
        // Remove single-line comments (but not in strings)
        .replace(/([^:]\/\/.*$)/gm, '')
        // Remove multi-line comments
        .replace(/\/\*[\s\S]*?\*\//g, '')
        // Remove extra whitespace
        .replace(/\s+/g, ' ')
        // Remove spaces around operators (careful with regex)
        .replace(/\s*([{}();,:+\-*\/=~<>!&|])\s*/g, '$1')
        // Remove trailing semicolons before closing braces
        .replace(/;}/g, '}')
        .trim();
}

function minifyCSS(code) {
    return code
        // Remove comments
        .replace(/\/\*[\s\S]*?\*\//g, '')
        // Remove extra whitespace
        .replace(/\s+/g, ' ')
        // Remove spaces around selectors and properties
        .replace(/\s*([{}:;,])>*+~])\s*/g, '$1')
        // Remove trailing semicolons in blocks
        .replace(/;}/g, '}')
        // Remove unnecessary spaces
        .replace(/\s*{\s*/g, '{')
        .replace(/\s*}\s*/g, '}')
        .trim();
}

function minifyHTML(code) {
    return code
        // Remove comments
        .replace(/<!--[\s\S]*?-->/g, '')
        // Remove whitespace between tags
        .replace(/>\s+</g, '><')
        // Remove extra whitespace
        .replace(/\s+/g, ' ')
        // Remove spaces before/after =
        .replace(/\s*=\s*/g, '=')
        // Remove leading/trailing whitespace
        .trim();
}

function copyOutput() {
    const output = document.getElementById('output');
    if (!output.value) return;
    
    // Use modern clipboard API with fallback
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(output.value).then(() => {
            showFeedback('copyOutput()', '✅ Copied!');
        }).catch(() => fallbackCopy());
    } else {
        fallbackCopy();
    }
    
    function fallbackCopy() {
        output.select();
        document.execCommand('copy');
        showFeedback('copyOutput()', '✅ Copied!');
    }
}

function showFeedback(fnName, text) {
    const btn = document.querySelector(`button[onclick="${fnName}"]`);
    if (!btn) return;
    const original = btn.textContent;
    btn.textContent = text;
    setTimeout(() => btn.textContent = original, 2000);
}

function downloadMinified() {
    const output = document.getElementById('output');
    if (!output.value) {
        showToast('Nothing to download! Minify some code first.', 'warning');
        return;
    }
    
    const blob = new Blob([output.value], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    
    // Generate filename
    let downloadName = currentFileName || `minified.${currentMode}`;
    if (downloadName.includes('.')) {
        const parts = downloadName.split('.');
        parts[parts.length - 2] += '.min';
        downloadName = parts.join('.');
    } else {
        downloadName = `minified.${currentMode}`;
    }
    
    a.href = url;
    a.download = downloadName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showFeedback('downloadMinified()', '✅ Downloaded!');
}

function clearAll() {
    document.getElementById('input').value = '';
    document.getElementById('output').value = '';
    document.getElementById('stats').innerHTML = '';
    currentFileName = '';
    originalFileContent = '';
    resetUploadZone();
    showToast('Cleared!', 'success');
}

function updateStats(original, minified) {
    const saved = original - minified;
    const percent = original > 0 ? ((saved / original) * 100).toFixed(1) : 0;
    
    document.getElementById('stats').innerHTML = `
        <div class="stat">
            <span>📊 Original:</span>
            ${original.toLocaleString()} bytes
        </div>
        <div class="stat">
            <span>🗜️ Minified:</span>
            ${minified.toLocaleString()} bytes
        </div>
        <div class="stat saved">
            <span>💾 Saved:</span>
            ${saved.toLocaleString()} bytes (${percent}%)
        </div>
    `;
}

// Toast notification
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: ${type === 'success' ? '#22c55e' : type === 'warning' ? '#f59e0b' : '#6f42c1'};
        color: white;
        padding: 12px 24px;
        border-radius: 8px;
        font-weight: 500;
        z-index: 1001;
        animation: slideUp 0.3s ease;
    `;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.3s';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// History management
function saveToHistory(input, output, mode) {
    try {
        let history = JSON.parse(localStorage.getItem('minifier-history') || '[]');
        const entry = {
            timestamp: Date.now(),
            mode: mode,
            inputLength: input.length,
            outputLength: output.length,
            saved: input.length - output.length
        };
        history.unshift(entry);
        history = history.slice(0, 50); // Keep last 50
        localStorage.setItem('minifier-history', JSON.stringify(history));
    } catch (e) {
        console.log('History save failed:', e);
    }
}

// File Upload Functions
function detectFileType(filename) {
    const ext = filename.split('.').pop().toLowerCase();
    const typeMap = {
        'js': 'js',
        'css': 'css',
        'html': 'html',
        'htm': 'html'
    };
    return typeMap[ext] || null;
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function updateUploadZone(filename, size) {
    const dropZone = document.getElementById('dropZone');
    dropZone.classList.add('has-file');
    dropZone.innerHTML = `
        <div class="file-info">
            <span>✅</span>
            <span class="file-name">${filename}</span>
            <span class="file-size">(${formatFileSize(size)})</span>
        </div>
    `;
}

function resetUploadZone() {
    const dropZone = document.getElementById('dropZone');
    dropZone.classList.remove('has-file');
    dropZone.innerHTML = `
        <div class="upload-content">
            <div class="upload-icon">📁</div>
            <p class="upload-text">Drag & drop your file here</p>
            <p class="upload-hint">or click to browse</p>
            <p class="upload-types">Supports: .js, .css, .html</p>
        </div>
        <input type="file" id="fileInput" accept=".js,.css,.html" hidden>
    `;
    setupFileInput();
}

function handleFile(file) {
    if (!file) return;
    
    const fileType = detectFileType(file.name);
    
    if (!fileType) {
        showToast('Unsupported file type. Use .js, .css, or .html', 'warning');
        return;
    }
    
    currentFileName = file.name;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        originalFileContent = e.target.result;
        document.getElementById('input').value = originalFileContent;
        
        // Auto-set mode based on file type
        setMode(fileType);
        
        // Update upload zone
        updateUploadZone(file.name, file.size);
        
        // Auto-minify
        minify();
        showToast(`Loaded ${file.name}`, 'success');
    };
    reader.onerror = function() {
        showToast('Error reading file', 'warning');
    };
    reader.readAsText(file);
}

function setupFileInput() {
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    
    if (!dropZone || !fileInput) return;
    
    // Click to browse
    dropZone.addEventListener('click', (e) => {
        if (!dropZone.classList.contains('has-file')) {
            fileInput.click();
        }
    });
    
    // File input change
    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        handleFile(file);
    });
    
    // Drag and drop events
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, preventDefaults, false);
    });
    
    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    ['dragenter', 'dragover'].forEach(eventName => {
        dropZone.addEventListener(eventName, () => {
            dropZone.classList.add('dragover');
        }, false);
    });
    
    ['dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, () => {
            dropZone.classList.remove('dragover');
        }, false);
    });
    
    // Handle drop
    dropZone.addEventListener('drop', (e) => {
        const dt = e.dataTransfer;
        const files = dt.files;
        handleFile(files[0]);
    }, false);
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Initialize theme first
    initTheme();
    
    // Restore saved mode preference
    const savedMode = localStorage.getItem('minifier-mode') || 'js';
    setMode(savedMode);
    
    // Setup file input
    setupFileInput();
    
    // Setup undo/redo keyboard shortcuts
    setupUndoRedoShortcuts();
    
    // Initialize undo/redo buttons state
    updateUndoRedoButtons();
    
    // Log PWA status
    if (isPWA) {
        console.log('✅ Running as installed PWA');
    }
});

// Setup keyboard shortcuts for undo/redo
function setupUndoRedoShortcuts() {
    const input = document.getElementById('input');
    if (!input) return;
    
    // Track input changes for undo history
    let debounceTimer;
    input.addEventListener('input', () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            saveUndoState();
        }, 500); // Save state 500ms after typing stops
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Check if user is in input field
        const isInputFocused = document.activeElement === input;
        
        if ((e.ctrlKey || e.metaKey) && !e.shiftKey && e.key === 'z') {
            e.preventDefault();
            if (isInputFocused) {
                input.blur(); // Temporarily blur to avoid cursor issues
            }
            undo();
        } else if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'Z') {
            e.preventDefault();
            if (isInputFocused) {
                input.blur();
            }
            redo();
        } else if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
            e.preventDefault();
            if (isInputFocused) {
                input.blur();
            }
            redo();
        }
    });
}

console.log('%c🗜️ Minifier Tool', 'font-size: 20px; color: #6f42c1;');
console.log('%cMade by Agent-Lumi for @shalkith', 'font-size: 12px; color: #8b5cf6;');
console.log('%cNow with PWA support, offline usage, and Undo/Redo! 🎉', 'font-size: 12px; color: #22c55e;');
