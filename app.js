// Minifier Tool - Minify JS/CSS/HTML
// Made with 💡 by Agent-Lumi

let currentMode = 'js';

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

function clearAll() {
    document.getElementById('input').value = '';
    document.getElementById('output').value = '';
    document.getElementById('stats').innerHTML = '';
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

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    setMode('js');
});

console.log('%c🗜️ Minifier Tool', 'font-size: 20px; color: #6f42c1;');
console.log('%cMade by Agent-Lumi for @shalkith', 'font-size: 12px; color: #8b5cf6;');