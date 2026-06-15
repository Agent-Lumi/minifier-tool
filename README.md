# 🗜️ Minifier Tool

A beautiful, fast tool to minify JavaScript, CSS, and HTML code for production. Built with 💡 by Agent-Lumi for @shalkith.

## ✨ Features

- **JavaScript Minification** - Remove comments, whitespace, and optimize
- **CSS Minification** - Clean up styles and reduce file size  
- **HTML Minification** - Remove whitespace and comments
- **📁 File Upload** - Drag & drop or click to upload files
- **📋 Copy to Clipboard** - Quick copy of minified output
- **💾 Download** - Save minified code as file
- **📊 Stats** - See exactly how many bytes you saved
- **↩️↪️ Undo/Redo** - Mistake? No problem! Undo/redo with Ctrl+Z/Ctrl+Y
- **🌓 Dark/Light Theme** - Toggle between dark and light modes
- **🔍 Side-by-Side Diff View** - See exactly what was removed during minification
- **📱 PWA Support** - Install as app, works offline!
- **🚀 Auto-detection** - Automatically detects file type from upload

## 🆕 What's New

### v2.2 - Side-by-Side Diff View
- **🔍 Visual Comparison** - See original and minified code side-by-side
- **Color-coded Changes** - Red = removed, Green = minified result, Yellow = modified
- **Line Numbers** - Easy reference for each section
- **Savings Stats** - Byte counts displayed in diff header
- **Legend** - Quick reference for what each color means

### v2.1 - Theme Toggle
- **🌓 Dark/Light Mode** - Click the moon/sun button to switch themes
- **Automatic persistence** - Your theme preference is saved
- **Smooth transitions** - Beautiful animated theme switching

### v2.0 - Undo/Redo Support
- **Undo changes** with Ctrl+Z or the Undo button
- **Redo changes** with Ctrl+Y (or Ctrl+Shift+Z) or the Redo button
- Tracks up to 50 changes in history
- Perfect for when you accidentally clear or overwrite code

## 📱 Progressive Web App

This tool is a PWA - you can install it on your device and use it offline!

### Install on Desktop (Chrome/Edge)
1. Visit the site
2. Click the install icon in the address bar (or use the prompt)
3. Launch from your desktop anytime!

### Install on Mobile (Android/iOS)
- **Android Chrome**: Menu → "Add to Home screen"
- **iOS Safari**: Share → "Add to Home Screen"

Once installed, it works completely offline - no internet needed! 🎉

## 🎯 Usage

1. Select your mode (JavaScript, CSS, or HTML)
2. Paste your code or drag & drop a file
3. Click **🗜️ Minify**
4. Copy or download the result
5. Click **🔍 Show Diff** to see a visual comparison of what was removed!

### Diff View
The side-by-side diff view shows:
- **Red highlighting** - Lines/whitespace/comments that were removed
- **Yellow highlighting** - Lines that had whitespace stripped
- **Green highlighting** - The minified result
- **Statistics** - See exact character counts for original, minified, and saved

### Keyboard Shortcuts
- **Ctrl+Z**: Undo last change
- **Ctrl+Y** (or **Ctrl+Shift+Z**): Redo
- **Theme Toggle**: Click the 🌙/☀️ button in the top-right corner

## 🎨 Themes

The tool supports both **Dark** and **Light** themes:
- Click the moon/sun icon in the top-right corner to toggle
- Your preference is automatically saved
- Smooth animated transitions between themes
- Works offline in both themes

## 🔧 Technical Details

- Pure client-side processing - your code never leaves your device
- Works offline after first load
- Service Worker for caching
- Responsive design for all screen sizes
- Undo/Redo history saved in memory (up to 50 states)
- Diff view renders client-side for privacy

## 🌐 Live Demo

**[Try it now →](https://agent-lumi.github.io/minifier-tool/)**

## 📝 License

MIT License - feel free to use and modify!

---

Made with 💡 by [Agent-Lumi](https://github.com/Agent-Lumi) for [@shalkith](https://github.com/shalkith)

Last updated: 2026-06-15 - Added Side-by-Side Diff View! 🔍
