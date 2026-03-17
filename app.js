// Minifier Tool - Minify JS/CSS/HTML
// Made with 💡 by Agent-Lumi

let currentMode = 'js';
let currentFileName = '';
let originalFileContent = '';

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
        html: "<!-- Paste your HTML here... -->\n<div class=\"container\">\n  <h1>Hello</h1>\n</div>"
    };
    input.placeholder = placeholders[mode];
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
    } catch (e) {
        output.value = 'Error: ' + e.message;
        updateStats(input.length, 0);
    }
}

function minifyJS(code) {
    return code
        // Remove comments
        .replace(/\/\/.*$/gm, '')
        .replace(/\/\*[\s\S]*?\*\//g, '')
        // Remove extra whitespace
        .replace(/\s+/g, ' ')
        // Remove spaces around operators
        .replace(/\s*([{}();,:+\-*\/=<>!&|])\s*/g, '$1')
        .trim();
}

function minifyCSS(code) {
    return code
        // Remove comments
        .replace(/\/\*[\s\S]*?\*\//g, '')
        // Remove extra whitespace
        .replace(/\s+/g, ' ')
        // Remove spaces around selectors
        .replace(/\s*([{}:;,>+~])\s*/g, '$1')
        // Remove trailing semicolons
        .replace(/;}/g, '}')
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
        .trim();
}

function copyOutput() {
    const output = document.getElementById('output');
    if (!output.value) return;
    
    output.select();
    document.execCommand('copy');
    
    // Show feedback
    const btn = document.querySelector('button[onclick="copyOutput()"]');
    const original = btn.textContent;
    btn.textContent = '✅ Copied!';
    setTimeout(() => btn.textContent = original, 2000);
}

function downloadMinified() {
    const output = document.getElementById('output');
    if (!output.value) {
        alert('Nothing to download! Please minify some code first.');
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
    
    // Show feedback
    const btn = document.querySelector('button[onclick="downloadMinified()"]');
    const original = btn.textContent;
    btn.textContent = '✅ Downloaded!';
    setTimeout(() => btn.textContent = original, 2000);
}

function clearAll() {
    document.getElementById('input').value = '';
    document.getElementById('output').value = '';
    document.getElementById('stats').innerHTML = '';
    currentFileName = '';
    originalFileContent = '';
    resetUploadZone();
}

function updateStats(original, minified) {
    const saved = original - minified;
    const percent = original > 0 ? ((saved / original) * 100).toFixed(1) : 0;
    
    document.getElementById('stats').innerHTML = `
        <div class="stat">
            <span>📊 Original:</span> ${original.toLocaleString()} bytes
        </div>
        <div class="stat">
            <span>🗜️ Minified:</span> ${minified.toLocaleString()} bytes
        </div>
        <div class="stat saved">
            <span>💾 Saved:</span> ${saved.toLocaleString()} bytes (${percent}%)
        </div>
    `;
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
        alert('Unsupported file type. Please upload .js, .css, or .html files.');
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
    };
    reader.readAsText(file);
}

function setupFileInput() {
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    
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
    setMode('js');
    setupFileInput();
});

console.log('%c🗜️ Minifier Tool', 'font-size: 20px; color: #6f42c1;');
console.log('%cMade by Agent-Lumi for @shalkith', 'font-size: 12px; color: #8b5cf6;');
