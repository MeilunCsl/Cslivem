# Encoding Fix Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix all Unicode encoding corruption caused by PowerShell heredoc passing `\uXXXX` as literal text.

**Architecture:** All file writes must use Python with `chr()` to construct Unicode characters, never relying on PowerShell heredoc to interpret escape sequences. Each fix is independently verifiable.

**Tech Stack:** Python 3 (for file writing), WeChat Mini Program (native)

---

## Root Cause

PowerShell `@' ... '@` heredoc does NOT interpret `\uXXXX` escape sequences. When Python code like `chr(0x2192)` is inside a heredoc, PowerShell passes the literal string `chr(0x2192)` to Python, which then evaluates it correctly. BUT when the Python code contains string literals with `\uXXXX` like `'\u2192'`, PowerShell passes `\u2192` as literal bytes, and Python writes those literal bytes to the file.

**Fix strategy:** Use Python `chr()` function calls to construct all Unicode characters, and write files using `open(path, 'w', encoding='utf-8')`.

---

## Task 1: Fix settings.json title

**Files:**
- Modify: `pages/settings/settings.json`

- [ ] **Step 1: Write fix script**

```python
import json
path = 'D:/Cslivem/ai-knowledge-hub/pages/settings/settings.json'
data = {
    "navigationBarTitleText": "\u8bbe\u7f6e",
    "usingComponents": {}
}
with open(path, 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2, ensure_ascii=False)
```

- [ ] **Step 2: Run script and verify**

```bash
python fix_settings_json.py
```
Expected: File written, Chinese characters present.

- [ ] **Step 3: Verify file content**

```python
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()
assert '\u8bbe\u7f6e' in content  # ??
```

---

## Task 2: Fix settings.js runtime safety

**Files:**
- Modify: `pages/settings/settings.js`

- [ ] **Step 1: Wrap onLoad body in try-catch**

The current onLoad calls `loadConfig()`, `loadStats()`, `loadSyncStatus()` without error handling. If any throws, `ready` never becomes `true` and the page stays invisible.

Add try-catch around each call and ensure `setTimeout` for `ready=true` always executes:

```javascript
onLoad: function() {
    try {
      this.setData({ statusBarHeight: wx.getSystemInfoSync().statusBarHeight || 20 });
    } catch (e) {}
    try { this.loadConfig(); } catch (e) { console.warn('[Settings] loadConfig error:', e); }
    try { this.loadStats(); } catch (e) { console.warn('[Settings] loadStats error:', e); }
    try { this.loadSyncStatus(); } catch (e) { console.warn('[Settings] loadSyncStatus error:', e); }
    var self = this;
    setTimeout(function() { self.setData({ ready: true }); }, 100);
  },
```

- [ ] **Step 2: Verify syntax**

```bash
node --check pages/settings/settings.js
```
Expected: SYNTAX OK

---

## Task 3: Fix home.js emoji escapes

**Files:**
- Modify: `pages/home/home.js`

- [ ] **Step 1: Write fix script that uses chr()**

Replace literal `\u2728`, `\ud83d\udcda`, `\ud83d\udd0d`, `\ud83e\udde0` with actual characters built via `chr()`.

The suggestions array should become:
```javascript
suggestions: [
  { icon: '\u2728', text: '?????' },      // chr(0x2728) = ?
  { icon: '\ud83d\udcda', text: '??????' }, // chr(0x1F4DA) = ??
  { icon: '\ud83d\udd0d', text: '?????' },   // chr(0x1F50D) = ??
  { icon: '\ud83e\udde0', text: 'AI ??????' } // chr(0x1F9E0) = ??
]
```

BUT since these are emoji (surrogate pairs in JS), we write them as actual UTF-8 bytes using Python.

- [ ] **Step 2: Run fix script**

Write a Python script that reads home.js, finds the suggestions block, and replaces the literal escapes with actual UTF-8 characters.

- [ ] **Step 3: Verify no literal escapes remain**

```python
import re
with open(path, 'rb') as f:
    raw = f.read()
matches = re.findall(rb'\\u[0-9a-fA-F]{4}', raw)
assert len(matches) == 0, f'Still has {len(matches)} literal escapes'
```

---

## Task 4: Fix ai-chat.wxml escapes

**Files:**
- Modify: `pages/ai-chat/ai-chat.wxml`

- [ ] **Step 1: Write fix script**

Read the file as bytes, replace all literal `\uXXXX` sequences with actual UTF-8 encoded characters.

Key replacements needed:
- `\u2190` ? `?` (back arrow)
- `\u6e05\u7a7a` ? `??` (clear)
- `\u52a9\u624b` ? `??` (assistant)
- `\u8f93\u5165\u4f60\u7684\u95ee\u9898` ? `??????` (input your question)
- `\u5b58\u4fdd` ? `??` (save)
- All other `\uXXXX` sequences

- [ ] **Step 2: Run fix script**

- [ ] **Step 3: Verify no literal escapes remain**

Same verification as Task 3.

---

## Task 5: Full scan + Git commit

- [ ] **Step 1: Run full codebase scan for literal escapes**

Check ALL .js, .wxml, .wxss files for any remaining `\uXXXX` patterns.

- [ ] **Step 2: Run WXSS brace check**

All WXSS files must have balanced `{` and `}`.

- [ ] **Step 3: Git commit and push**

```bash
git add -A
git commit -m "fix: repair Unicode encoding corruption from PowerShell heredoc"
git push origin main
```
