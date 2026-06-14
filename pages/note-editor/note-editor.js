// pages/note-editor/note-editor.js
var noteModule = require('../../modules/note/public');
var markdown = require('../../utils/markdown');
var graphQuery = require('../../core/graph/graph-query');
var types = require('../../core/graph/types');

Page({
  data: {
    statusBarHeight: 20,
    ready: false,
    noteId: '',
    title: '',
    content: '',
    isNew: false,
    showToolbar: true,
    // Wiki-link suggestions
    showSuggestions: false,
    previewMode: false,
    htmlContent: '',
    linkQuery: '',
    suggestions: [],
    showAiMenu: false,
    aiProcessing: false
  },

  onLoad: function(options) {
    try { this.setData({ statusBarHeight: wx.getSystemInfoSync().statusBarHeight || 20 

  toggleAiMenu: function() {
    this.setData({ showAiMenu: !this.data.showAiMenu });
  },

  onAiContinue: function() {
    this.runAiTask('continue');
  },

  onAiSummarize: function() {
    this.runAiTask('summarize');
  },

  onAiRewrite: function() {
    this.runAiTask('rewrite');
  },

  onAiExtractTasks: function() {
    this.runAiTask('extract');
  },

  onAiExpand: function() {
    this.runAiTask('expand');
  },

  onAiShorten: function() {
    this.runAiTask('shorten');
  },

  runAiTask: function(task) {
    var self = this;
    var content = self.data.content;
    if (!content || content.length < 10) {
      wx.showToast({ title: '内容太短', icon: 'none' });
      return;
    }
    self.setData({ aiProcessing: true, showAiMenu: false });

    var gateway = require('../../miniprogram/ai-gateway');
    var promptRegistry = require('../../miniprogram/prompt-registry');

    var prompts = {
      continue: '请根据以下内容继续写下去，保持风格一致，只输出续写部分：',
      summarize: '请用一段话总结以下内容的核心要点：',
      rewrite: '请重新改写以下内容，使其更清晰、更有条理：',
      extract: '请从以下内容中提取待办任务，每行一个，用 - [ ] 开头：',
      expand: '请扩充以下内容，增加更多细节和例子：',
      shorten: '请精简以下内容，保留核心信息，删除冗余部分：'
    };

    var systemPrompt = prompts[task] || prompts.summarize;
    var userMsg = content.substring(0, 2000);

    gateway.ask(userMsg, systemPrompt).then(function(res) {
      var result = res.content || '';
      if (task === 'continue') {
        self.setData({ content: content + '

' + result, aiProcessing: false });
      } else if (task === 'extract') {
        self.setData({ content: content + '

## 提取的任务
' + result, aiProcessing: false });
      } else {
        wx.showModal({
          title: 'AI 结果',
          content: result.substring(0, 500),
          confirmText: '应用',
          cancelText: '取消',
          success: function(modalRes) {
            if (modalRes.confirm) {
              self.setData({ content: result, aiProcessing: false });
            } else {
              self.setData({ aiProcessing: false });
            }
          }
        });
      }
      wx.showToast({ title: 'AI 完成', icon: 'success' });
    }).catch(function(err) {
      self.setData({ aiProcessing: false });
      wx.showToast({ title: 'AI 失败', icon: 'none' });
    });
  },

}); } catch(e) {}
    var noteId = options.id || '';
    var templateId = options.template || '';
    this.setData({ noteId: noteId, isNew: !noteId 

  toggleAiMenu: function() {
    this.setData({ showAiMenu: !this.data.showAiMenu });
  },

  onAiContinue: function() {
    this.runAiTask('continue');
  },

  onAiSummarize: function() {
    this.runAiTask('summarize');
  },

  onAiRewrite: function() {
    this.runAiTask('rewrite');
  },

  onAiExtractTasks: function() {
    this.runAiTask('extract');
  },

  onAiExpand: function() {
    this.runAiTask('expand');
  },

  onAiShorten: function() {
    this.runAiTask('shorten');
  },

  runAiTask: function(task) {
    var self = this;
    var content = self.data.content;
    if (!content || content.length < 10) {
      wx.showToast({ title: '内容太短', icon: 'none' });
      return;
    }
    self.setData({ aiProcessing: true, showAiMenu: false });

    var gateway = require('../../miniprogram/ai-gateway');
    var promptRegistry = require('../../miniprogram/prompt-registry');

    var prompts = {
      continue: '请根据以下内容继续写下去，保持风格一致，只输出续写部分：',
      summarize: '请用一段话总结以下内容的核心要点：',
      rewrite: '请重新改写以下内容，使其更清晰、更有条理：',
      extract: '请从以下内容中提取待办任务，每行一个，用 - [ ] 开头：',
      expand: '请扩充以下内容，增加更多细节和例子：',
      shorten: '请精简以下内容，保留核心信息，删除冗余部分：'
    };

    var systemPrompt = prompts[task] || prompts.summarize;
    var userMsg = content.substring(0, 2000);

    gateway.ask(userMsg, systemPrompt).then(function(res) {
      var result = res.content || '';
      if (task === 'continue') {
        self.setData({ content: content + '

' + result, aiProcessing: false });
      } else if (task === 'extract') {
        self.setData({ content: content + '

## 提取的任务
' + result, aiProcessing: false });
      } else {
        wx.showModal({
          title: 'AI 结果',
          content: result.substring(0, 500),
          confirmText: '应用',
          cancelText: '取消',
          success: function(modalRes) {
            if (modalRes.confirm) {
              self.setData({ content: result, aiProcessing: false });
            } else {
              self.setData({ aiProcessing: false });
            }
          }
        });
      }
      wx.showToast({ title: 'AI 完成', icon: 'success' });
    }).catch(function(err) {
      self.setData({ aiProcessing: false });
      wx.showToast({ title: 'AI 失败', icon: 'none' });
    });
  },

});
    if (noteId) { this.loadNote(noteId); }
    else if (templateId) { this.loadTemplate(templateId); }
    var self = this;
    setTimeout(function() { self.setData({ ready: true 

  toggleAiMenu: function() {
    this.setData({ showAiMenu: !this.data.showAiMenu });
  },

  onAiContinue: function() {
    this.runAiTask('continue');
  },

  onAiSummarize: function() {
    this.runAiTask('summarize');
  },

  onAiRewrite: function() {
    this.runAiTask('rewrite');
  },

  onAiExtractTasks: function() {
    this.runAiTask('extract');
  },

  onAiExpand: function() {
    this.runAiTask('expand');
  },

  onAiShorten: function() {
    this.runAiTask('shorten');
  },

  runAiTask: function(task) {
    var self = this;
    var content = self.data.content;
    if (!content || content.length < 10) {
      wx.showToast({ title: '内容太短', icon: 'none' });
      return;
    }
    self.setData({ aiProcessing: true, showAiMenu: false });

    var gateway = require('../../miniprogram/ai-gateway');
    var promptRegistry = require('../../miniprogram/prompt-registry');

    var prompts = {
      continue: '请根据以下内容继续写下去，保持风格一致，只输出续写部分：',
      summarize: '请用一段话总结以下内容的核心要点：',
      rewrite: '请重新改写以下内容，使其更清晰、更有条理：',
      extract: '请从以下内容中提取待办任务，每行一个，用 - [ ] 开头：',
      expand: '请扩充以下内容，增加更多细节和例子：',
      shorten: '请精简以下内容，保留核心信息，删除冗余部分：'
    };

    var systemPrompt = prompts[task] || prompts.summarize;
    var userMsg = content.substring(0, 2000);

    gateway.ask(userMsg, systemPrompt).then(function(res) {
      var result = res.content || '';
      if (task === 'continue') {
        self.setData({ content: content + '

' + result, aiProcessing: false });
      } else if (task === 'extract') {
        self.setData({ content: content + '

## 提取的任务
' + result, aiProcessing: false });
      } else {
        wx.showModal({
          title: 'AI 结果',
          content: result.substring(0, 500),
          confirmText: '应用',
          cancelText: '取消',
          success: function(modalRes) {
            if (modalRes.confirm) {
              self.setData({ content: result, aiProcessing: false });
            } else {
              self.setData({ aiProcessing: false });
            }
          }
        });
      }
      wx.showToast({ title: 'AI 完成', icon: 'success' });
    }).catch(function(err) {
      self.setData({ aiProcessing: false });
      wx.showToast({ title: 'AI 失败', icon: 'none' });
    });
  },

}); }, 100);
  },



  loadTemplate: function(templateId) {
    var noteModule = require('../../modules/note/public');
    var template = noteModule.getTemplateById(templateId);
    if (template) {
      var now = new Date();
      var dateStr = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0') + '-' + String(now.getDate()).padStart(2, '0');
      this.setData({
        title: template.title + dateStr,
        content: template.content,
        isNew: true
      

  toggleAiMenu: function() {
    this.setData({ showAiMenu: !this.data.showAiMenu });
  },

  onAiContinue: function() {
    this.runAiTask('continue');
  },

  onAiSummarize: function() {
    this.runAiTask('summarize');
  },

  onAiRewrite: function() {
    this.runAiTask('rewrite');
  },

  onAiExtractTasks: function() {
    this.runAiTask('extract');
  },

  onAiExpand: function() {
    this.runAiTask('expand');
  },

  onAiShorten: function() {
    this.runAiTask('shorten');
  },

  runAiTask: function(task) {
    var self = this;
    var content = self.data.content;
    if (!content || content.length < 10) {
      wx.showToast({ title: '内容太短', icon: 'none' });
      return;
    }
    self.setData({ aiProcessing: true, showAiMenu: false });

    var gateway = require('../../miniprogram/ai-gateway');
    var promptRegistry = require('../../miniprogram/prompt-registry');

    var prompts = {
      continue: '请根据以下内容继续写下去，保持风格一致，只输出续写部分：',
      summarize: '请用一段话总结以下内容的核心要点：',
      rewrite: '请重新改写以下内容，使其更清晰、更有条理：',
      extract: '请从以下内容中提取待办任务，每行一个，用 - [ ] 开头：',
      expand: '请扩充以下内容，增加更多细节和例子：',
      shorten: '请精简以下内容，保留核心信息，删除冗余部分：'
    };

    var systemPrompt = prompts[task] || prompts.summarize;
    var userMsg = content.substring(0, 2000);

    gateway.ask(userMsg, systemPrompt).then(function(res) {
      var result = res.content || '';
      if (task === 'continue') {
        self.setData({ content: content + '

' + result, aiProcessing: false });
      } else if (task === 'extract') {
        self.setData({ content: content + '

## 提取的任务
' + result, aiProcessing: false });
      } else {
        wx.showModal({
          title: 'AI 结果',
          content: result.substring(0, 500),
          confirmText: '应用',
          cancelText: '取消',
          success: function(modalRes) {
            if (modalRes.confirm) {
              self.setData({ content: result, aiProcessing: false });
            } else {
              self.setData({ aiProcessing: false });
            }
          }
        });
      }
      wx.showToast({ title: 'AI 完成', icon: 'success' });
    }).catch(function(err) {
      self.setData({ aiProcessing: false });
      wx.showToast({ title: 'AI 失败', icon: 'none' });
    });
  },

});
    }
  },
  loadNote: function(id) {
    var note = noteModule.getRecentNotes(100);
    for (var i = 0; i < note.length; i++) {
      if (note[i].id === id) {
        this.setData({ title: note[i].title, content: note[i].content 

  toggleAiMenu: function() {
    this.setData({ showAiMenu: !this.data.showAiMenu });
  },

  onAiContinue: function() {
    this.runAiTask('continue');
  },

  onAiSummarize: function() {
    this.runAiTask('summarize');
  },

  onAiRewrite: function() {
    this.runAiTask('rewrite');
  },

  onAiExtractTasks: function() {
    this.runAiTask('extract');
  },

  onAiExpand: function() {
    this.runAiTask('expand');
  },

  onAiShorten: function() {
    this.runAiTask('shorten');
  },

  runAiTask: function(task) {
    var self = this;
    var content = self.data.content;
    if (!content || content.length < 10) {
      wx.showToast({ title: '内容太短', icon: 'none' });
      return;
    }
    self.setData({ aiProcessing: true, showAiMenu: false });

    var gateway = require('../../miniprogram/ai-gateway');
    var promptRegistry = require('../../miniprogram/prompt-registry');

    var prompts = {
      continue: '请根据以下内容继续写下去，保持风格一致，只输出续写部分：',
      summarize: '请用一段话总结以下内容的核心要点：',
      rewrite: '请重新改写以下内容，使其更清晰、更有条理：',
      extract: '请从以下内容中提取待办任务，每行一个，用 - [ ] 开头：',
      expand: '请扩充以下内容，增加更多细节和例子：',
      shorten: '请精简以下内容，保留核心信息，删除冗余部分：'
    };

    var systemPrompt = prompts[task] || prompts.summarize;
    var userMsg = content.substring(0, 2000);

    gateway.ask(userMsg, systemPrompt).then(function(res) {
      var result = res.content || '';
      if (task === 'continue') {
        self.setData({ content: content + '

' + result, aiProcessing: false });
      } else if (task === 'extract') {
        self.setData({ content: content + '

## 提取的任务
' + result, aiProcessing: false });
      } else {
        wx.showModal({
          title: 'AI 结果',
          content: result.substring(0, 500),
          confirmText: '应用',
          cancelText: '取消',
          success: function(modalRes) {
            if (modalRes.confirm) {
              self.setData({ content: result, aiProcessing: false });
            } else {
              self.setData({ aiProcessing: false });
            }
          }
        });
      }
      wx.showToast({ title: 'AI 完成', icon: 'success' });
    }).catch(function(err) {
      self.setData({ aiProcessing: false });
      wx.showToast({ title: 'AI 失败', icon: 'none' });
    });
  },

});
        break;
      }
    }
  },

  onTitleInput: function(e) {
    this.setData({ title: e.detail.value 

  toggleAiMenu: function() {
    this.setData({ showAiMenu: !this.data.showAiMenu });
  },

  onAiContinue: function() {
    this.runAiTask('continue');
  },

  onAiSummarize: function() {
    this.runAiTask('summarize');
  },

  onAiRewrite: function() {
    this.runAiTask('rewrite');
  },

  onAiExtractTasks: function() {
    this.runAiTask('extract');
  },

  onAiExpand: function() {
    this.runAiTask('expand');
  },

  onAiShorten: function() {
    this.runAiTask('shorten');
  },

  runAiTask: function(task) {
    var self = this;
    var content = self.data.content;
    if (!content || content.length < 10) {
      wx.showToast({ title: '内容太短', icon: 'none' });
      return;
    }
    self.setData({ aiProcessing: true, showAiMenu: false });

    var gateway = require('../../miniprogram/ai-gateway');
    var promptRegistry = require('../../miniprogram/prompt-registry');

    var prompts = {
      continue: '请根据以下内容继续写下去，保持风格一致，只输出续写部分：',
      summarize: '请用一段话总结以下内容的核心要点：',
      rewrite: '请重新改写以下内容，使其更清晰、更有条理：',
      extract: '请从以下内容中提取待办任务，每行一个，用 - [ ] 开头：',
      expand: '请扩充以下内容，增加更多细节和例子：',
      shorten: '请精简以下内容，保留核心信息，删除冗余部分：'
    };

    var systemPrompt = prompts[task] || prompts.summarize;
    var userMsg = content.substring(0, 2000);

    gateway.ask(userMsg, systemPrompt).then(function(res) {
      var result = res.content || '';
      if (task === 'continue') {
        self.setData({ content: content + '

' + result, aiProcessing: false });
      } else if (task === 'extract') {
        self.setData({ content: content + '

## 提取的任务
' + result, aiProcessing: false });
      } else {
        wx.showModal({
          title: 'AI 结果',
          content: result.substring(0, 500),
          confirmText: '应用',
          cancelText: '取消',
          success: function(modalRes) {
            if (modalRes.confirm) {
              self.setData({ content: result, aiProcessing: false });
            } else {
              self.setData({ aiProcessing: false });
            }
          }
        });
      }
      wx.showToast({ title: 'AI 完成', icon: 'success' });
    }).catch(function(err) {
      self.setData({ aiProcessing: false });
      wx.showToast({ title: 'AI 失败', icon: 'none' });
    });
  },

});
  },

  onContentInput: function(e) {
    var value = e.detail.value;
    this.setData({ content: value 

  toggleAiMenu: function() {
    this.setData({ showAiMenu: !this.data.showAiMenu });
  },

  onAiContinue: function() {
    this.runAiTask('continue');
  },

  onAiSummarize: function() {
    this.runAiTask('summarize');
  },

  onAiRewrite: function() {
    this.runAiTask('rewrite');
  },

  onAiExtractTasks: function() {
    this.runAiTask('extract');
  },

  onAiExpand: function() {
    this.runAiTask('expand');
  },

  onAiShorten: function() {
    this.runAiTask('shorten');
  },

  runAiTask: function(task) {
    var self = this;
    var content = self.data.content;
    if (!content || content.length < 10) {
      wx.showToast({ title: '内容太短', icon: 'none' });
      return;
    }
    self.setData({ aiProcessing: true, showAiMenu: false });

    var gateway = require('../../miniprogram/ai-gateway');
    var promptRegistry = require('../../miniprogram/prompt-registry');

    var prompts = {
      continue: '请根据以下内容继续写下去，保持风格一致，只输出续写部分：',
      summarize: '请用一段话总结以下内容的核心要点：',
      rewrite: '请重新改写以下内容，使其更清晰、更有条理：',
      extract: '请从以下内容中提取待办任务，每行一个，用 - [ ] 开头：',
      expand: '请扩充以下内容，增加更多细节和例子：',
      shorten: '请精简以下内容，保留核心信息，删除冗余部分：'
    };

    var systemPrompt = prompts[task] || prompts.summarize;
    var userMsg = content.substring(0, 2000);

    gateway.ask(userMsg, systemPrompt).then(function(res) {
      var result = res.content || '';
      if (task === 'continue') {
        self.setData({ content: content + '

' + result, aiProcessing: false });
      } else if (task === 'extract') {
        self.setData({ content: content + '

## 提取的任务
' + result, aiProcessing: false });
      } else {
        wx.showModal({
          title: 'AI 结果',
          content: result.substring(0, 500),
          confirmText: '应用',
          cancelText: '取消',
          success: function(modalRes) {
            if (modalRes.confirm) {
              self.setData({ content: result, aiProcessing: false });
            } else {
              self.setData({ aiProcessing: false });
            }
          }
        });
      }
      wx.showToast({ title: 'AI 完成', icon: 'success' });
    }).catch(function(err) {
      self.setData({ aiProcessing: false });
      wx.showToast({ title: 'AI 失败', icon: 'none' });
    });
  },

});
    this.refreshPreview();
    // Detect [[ trigger for link suggestions
    this._checkLinkTrigger(value);
  },


  togglePreview: function() {
    var isPreview = !this.data.previewMode;
    if (isPreview) {
      var html = markdown.parseMarkdown(this.data.content);
      this.setData({ previewMode: true, htmlContent: html 

  toggleAiMenu: function() {
    this.setData({ showAiMenu: !this.data.showAiMenu });
  },

  onAiContinue: function() {
    this.runAiTask('continue');
  },

  onAiSummarize: function() {
    this.runAiTask('summarize');
  },

  onAiRewrite: function() {
    this.runAiTask('rewrite');
  },

  onAiExtractTasks: function() {
    this.runAiTask('extract');
  },

  onAiExpand: function() {
    this.runAiTask('expand');
  },

  onAiShorten: function() {
    this.runAiTask('shorten');
  },

  runAiTask: function(task) {
    var self = this;
    var content = self.data.content;
    if (!content || content.length < 10) {
      wx.showToast({ title: '内容太短', icon: 'none' });
      return;
    }
    self.setData({ aiProcessing: true, showAiMenu: false });

    var gateway = require('../../miniprogram/ai-gateway');
    var promptRegistry = require('../../miniprogram/prompt-registry');

    var prompts = {
      continue: '请根据以下内容继续写下去，保持风格一致，只输出续写部分：',
      summarize: '请用一段话总结以下内容的核心要点：',
      rewrite: '请重新改写以下内容，使其更清晰、更有条理：',
      extract: '请从以下内容中提取待办任务，每行一个，用 - [ ] 开头：',
      expand: '请扩充以下内容，增加更多细节和例子：',
      shorten: '请精简以下内容，保留核心信息，删除冗余部分：'
    };

    var systemPrompt = prompts[task] || prompts.summarize;
    var userMsg = content.substring(0, 2000);

    gateway.ask(userMsg, systemPrompt).then(function(res) {
      var result = res.content || '';
      if (task === 'continue') {
        self.setData({ content: content + '

' + result, aiProcessing: false });
      } else if (task === 'extract') {
        self.setData({ content: content + '

## 提取的任务
' + result, aiProcessing: false });
      } else {
        wx.showModal({
          title: 'AI 结果',
          content: result.substring(0, 500),
          confirmText: '应用',
          cancelText: '取消',
          success: function(modalRes) {
            if (modalRes.confirm) {
              self.setData({ content: result, aiProcessing: false });
            } else {
              self.setData({ aiProcessing: false });
            }
          }
        });
      }
      wx.showToast({ title: 'AI 完成', icon: 'success' });
    }).catch(function(err) {
      self.setData({ aiProcessing: false });
      wx.showToast({ title: 'AI 失败', icon: 'none' });
    });
  },

});
    } else {
      this.setData({ previewMode: false, htmlContent: '' 

  toggleAiMenu: function() {
    this.setData({ showAiMenu: !this.data.showAiMenu });
  },

  onAiContinue: function() {
    this.runAiTask('continue');
  },

  onAiSummarize: function() {
    this.runAiTask('summarize');
  },

  onAiRewrite: function() {
    this.runAiTask('rewrite');
  },

  onAiExtractTasks: function() {
    this.runAiTask('extract');
  },

  onAiExpand: function() {
    this.runAiTask('expand');
  },

  onAiShorten: function() {
    this.runAiTask('shorten');
  },

  runAiTask: function(task) {
    var self = this;
    var content = self.data.content;
    if (!content || content.length < 10) {
      wx.showToast({ title: '内容太短', icon: 'none' });
      return;
    }
    self.setData({ aiProcessing: true, showAiMenu: false });

    var gateway = require('../../miniprogram/ai-gateway');
    var promptRegistry = require('../../miniprogram/prompt-registry');

    var prompts = {
      continue: '请根据以下内容继续写下去，保持风格一致，只输出续写部分：',
      summarize: '请用一段话总结以下内容的核心要点：',
      rewrite: '请重新改写以下内容，使其更清晰、更有条理：',
      extract: '请从以下内容中提取待办任务，每行一个，用 - [ ] 开头：',
      expand: '请扩充以下内容，增加更多细节和例子：',
      shorten: '请精简以下内容，保留核心信息，删除冗余部分：'
    };

    var systemPrompt = prompts[task] || prompts.summarize;
    var userMsg = content.substring(0, 2000);

    gateway.ask(userMsg, systemPrompt).then(function(res) {
      var result = res.content || '';
      if (task === 'continue') {
        self.setData({ content: content + '

' + result, aiProcessing: false });
      } else if (task === 'extract') {
        self.setData({ content: content + '

## 提取的任务
' + result, aiProcessing: false });
      } else {
        wx.showModal({
          title: 'AI 结果',
          content: result.substring(0, 500),
          confirmText: '应用',
          cancelText: '取消',
          success: function(modalRes) {
            if (modalRes.confirm) {
              self.setData({ content: result, aiProcessing: false });
            } else {
              self.setData({ aiProcessing: false });
            }
          }
        });
      }
      wx.showToast({ title: 'AI 完成', icon: 'success' });
    }).catch(function(err) {
      self.setData({ aiProcessing: false });
      wx.showToast({ title: 'AI 失败', icon: 'none' });
    });
  },

});
    }
  },

  refreshPreview: function() {
    if (this.data.previewMode) {
      var html = markdown.parseMarkdown(this.data.content);
      this.setData({ htmlContent: html 

  toggleAiMenu: function() {
    this.setData({ showAiMenu: !this.data.showAiMenu });
  },

  onAiContinue: function() {
    this.runAiTask('continue');
  },

  onAiSummarize: function() {
    this.runAiTask('summarize');
  },

  onAiRewrite: function() {
    this.runAiTask('rewrite');
  },

  onAiExtractTasks: function() {
    this.runAiTask('extract');
  },

  onAiExpand: function() {
    this.runAiTask('expand');
  },

  onAiShorten: function() {
    this.runAiTask('shorten');
  },

  runAiTask: function(task) {
    var self = this;
    var content = self.data.content;
    if (!content || content.length < 10) {
      wx.showToast({ title: '内容太短', icon: 'none' });
      return;
    }
    self.setData({ aiProcessing: true, showAiMenu: false });

    var gateway = require('../../miniprogram/ai-gateway');
    var promptRegistry = require('../../miniprogram/prompt-registry');

    var prompts = {
      continue: '请根据以下内容继续写下去，保持风格一致，只输出续写部分：',
      summarize: '请用一段话总结以下内容的核心要点：',
      rewrite: '请重新改写以下内容，使其更清晰、更有条理：',
      extract: '请从以下内容中提取待办任务，每行一个，用 - [ ] 开头：',
      expand: '请扩充以下内容，增加更多细节和例子：',
      shorten: '请精简以下内容，保留核心信息，删除冗余部分：'
    };

    var systemPrompt = prompts[task] || prompts.summarize;
    var userMsg = content.substring(0, 2000);

    gateway.ask(userMsg, systemPrompt).then(function(res) {
      var result = res.content || '';
      if (task === 'continue') {
        self.setData({ content: content + '

' + result, aiProcessing: false });
      } else if (task === 'extract') {
        self.setData({ content: content + '

## 提取的任务
' + result, aiProcessing: false });
      } else {
        wx.showModal({
          title: 'AI 结果',
          content: result.substring(0, 500),
          confirmText: '应用',
          cancelText: '取消',
          success: function(modalRes) {
            if (modalRes.confirm) {
              self.setData({ content: result, aiProcessing: false });
            } else {
              self.setData({ aiProcessing: false });
            }
          }
        });
      }
      wx.showToast({ title: 'AI 完成', icon: 'success' });
    }).catch(function(err) {
      self.setData({ aiProcessing: false });
      wx.showToast({ title: 'AI 失败', icon: 'none' });
    });
  },

});
    }
  },

  _checkLinkTrigger: function(text) {
    // Find the last [[ that hasn't been closed
    var lastOpen = text.lastIndexOf('[[');
    var lastClose = text.lastIndexOf(']]');
    if (lastOpen > lastClose && lastOpen >= 0) {
      var query = text.substring(lastOpen + 2);
      if (query.length <= 20) {
        this._searchSuggestions(query);
        return;
      }
    }
    this.setData({ showSuggestions: false,
    previewMode: false,
    htmlContent: '', suggestions: [] 

  toggleAiMenu: function() {
    this.setData({ showAiMenu: !this.data.showAiMenu });
  },

  onAiContinue: function() {
    this.runAiTask('continue');
  },

  onAiSummarize: function() {
    this.runAiTask('summarize');
  },

  onAiRewrite: function() {
    this.runAiTask('rewrite');
  },

  onAiExtractTasks: function() {
    this.runAiTask('extract');
  },

  onAiExpand: function() {
    this.runAiTask('expand');
  },

  onAiShorten: function() {
    this.runAiTask('shorten');
  },

  runAiTask: function(task) {
    var self = this;
    var content = self.data.content;
    if (!content || content.length < 10) {
      wx.showToast({ title: '内容太短', icon: 'none' });
      return;
    }
    self.setData({ aiProcessing: true, showAiMenu: false });

    var gateway = require('../../miniprogram/ai-gateway');
    var promptRegistry = require('../../miniprogram/prompt-registry');

    var prompts = {
      continue: '请根据以下内容继续写下去，保持风格一致，只输出续写部分：',
      summarize: '请用一段话总结以下内容的核心要点：',
      rewrite: '请重新改写以下内容，使其更清晰、更有条理：',
      extract: '请从以下内容中提取待办任务，每行一个，用 - [ ] 开头：',
      expand: '请扩充以下内容，增加更多细节和例子：',
      shorten: '请精简以下内容，保留核心信息，删除冗余部分：'
    };

    var systemPrompt = prompts[task] || prompts.summarize;
    var userMsg = content.substring(0, 2000);

    gateway.ask(userMsg, systemPrompt).then(function(res) {
      var result = res.content || '';
      if (task === 'continue') {
        self.setData({ content: content + '

' + result, aiProcessing: false });
      } else if (task === 'extract') {
        self.setData({ content: content + '

## 提取的任务
' + result, aiProcessing: false });
      } else {
        wx.showModal({
          title: 'AI 结果',
          content: result.substring(0, 500),
          confirmText: '应用',
          cancelText: '取消',
          success: function(modalRes) {
            if (modalRes.confirm) {
              self.setData({ content: result, aiProcessing: false });
            } else {
              self.setData({ aiProcessing: false });
            }
          }
        });
      }
      wx.showToast({ title: 'AI 完成', icon: 'success' });
    }).catch(function(err) {
      self.setData({ aiProcessing: false });
      wx.showToast({ title: 'AI 失败', icon: 'none' });
    });
  },

});
  },

  _searchSuggestions: function(query) {
    var results = [];
    if (query.length === 0) {
      // Show recent notes
      results = noteModule.getRecentNotes(5).map(function(n) {
        return { id: n.id, label: n.title || 'Untitled', type: 'note' };
      

  toggleAiMenu: function() {
    this.setData({ showAiMenu: !this.data.showAiMenu });
  },

  onAiContinue: function() {
    this.runAiTask('continue');
  },

  onAiSummarize: function() {
    this.runAiTask('summarize');
  },

  onAiRewrite: function() {
    this.runAiTask('rewrite');
  },

  onAiExtractTasks: function() {
    this.runAiTask('extract');
  },

  onAiExpand: function() {
    this.runAiTask('expand');
  },

  onAiShorten: function() {
    this.runAiTask('shorten');
  },

  runAiTask: function(task) {
    var self = this;
    var content = self.data.content;
    if (!content || content.length < 10) {
      wx.showToast({ title: '内容太短', icon: 'none' });
      return;
    }
    self.setData({ aiProcessing: true, showAiMenu: false });

    var gateway = require('../../miniprogram/ai-gateway');
    var promptRegistry = require('../../miniprogram/prompt-registry');

    var prompts = {
      continue: '请根据以下内容继续写下去，保持风格一致，只输出续写部分：',
      summarize: '请用一段话总结以下内容的核心要点：',
      rewrite: '请重新改写以下内容，使其更清晰、更有条理：',
      extract: '请从以下内容中提取待办任务，每行一个，用 - [ ] 开头：',
      expand: '请扩充以下内容，增加更多细节和例子：',
      shorten: '请精简以下内容，保留核心信息，删除冗余部分：'
    };

    var systemPrompt = prompts[task] || prompts.summarize;
    var userMsg = content.substring(0, 2000);

    gateway.ask(userMsg, systemPrompt).then(function(res) {
      var result = res.content || '';
      if (task === 'continue') {
        self.setData({ content: content + '

' + result, aiProcessing: false });
      } else if (task === 'extract') {
        self.setData({ content: content + '

## 提取的任务
' + result, aiProcessing: false });
      } else {
        wx.showModal({
          title: 'AI 结果',
          content: result.substring(0, 500),
          confirmText: '应用',
          cancelText: '取消',
          success: function(modalRes) {
            if (modalRes.confirm) {
              self.setData({ content: result, aiProcessing: false });
            } else {
              self.setData({ aiProcessing: false });
            }
          }
        });
      }
      wx.showToast({ title: 'AI 完成', icon: 'success' });
    }).catch(function(err) {
      self.setData({ aiProcessing: false });
      wx.showToast({ title: 'AI 失败', icon: 'none' });
    });
  },

});
    } else {
      // Search graph nodes
      var nodes = graphQuery.searchNodes(query);
      results = nodes.slice(0, 8).map(function(n) {
        return { id: n.id, label: n.label, type: n.type };
      

  toggleAiMenu: function() {
    this.setData({ showAiMenu: !this.data.showAiMenu });
  },

  onAiContinue: function() {
    this.runAiTask('continue');
  },

  onAiSummarize: function() {
    this.runAiTask('summarize');
  },

  onAiRewrite: function() {
    this.runAiTask('rewrite');
  },

  onAiExtractTasks: function() {
    this.runAiTask('extract');
  },

  onAiExpand: function() {
    this.runAiTask('expand');
  },

  onAiShorten: function() {
    this.runAiTask('shorten');
  },

  runAiTask: function(task) {
    var self = this;
    var content = self.data.content;
    if (!content || content.length < 10) {
      wx.showToast({ title: '内容太短', icon: 'none' });
      return;
    }
    self.setData({ aiProcessing: true, showAiMenu: false });

    var gateway = require('../../miniprogram/ai-gateway');
    var promptRegistry = require('../../miniprogram/prompt-registry');

    var prompts = {
      continue: '请根据以下内容继续写下去，保持风格一致，只输出续写部分：',
      summarize: '请用一段话总结以下内容的核心要点：',
      rewrite: '请重新改写以下内容，使其更清晰、更有条理：',
      extract: '请从以下内容中提取待办任务，每行一个，用 - [ ] 开头：',
      expand: '请扩充以下内容，增加更多细节和例子：',
      shorten: '请精简以下内容，保留核心信息，删除冗余部分：'
    };

    var systemPrompt = prompts[task] || prompts.summarize;
    var userMsg = content.substring(0, 2000);

    gateway.ask(userMsg, systemPrompt).then(function(res) {
      var result = res.content || '';
      if (task === 'continue') {
        self.setData({ content: content + '

' + result, aiProcessing: false });
      } else if (task === 'extract') {
        self.setData({ content: content + '

## 提取的任务
' + result, aiProcessing: false });
      } else {
        wx.showModal({
          title: 'AI 结果',
          content: result.substring(0, 500),
          confirmText: '应用',
          cancelText: '取消',
          success: function(modalRes) {
            if (modalRes.confirm) {
              self.setData({ content: result, aiProcessing: false });
            } else {
              self.setData({ aiProcessing: false });
            }
          }
        });
      }
      wx.showToast({ title: 'AI 完成', icon: 'success' });
    }).catch(function(err) {
      self.setData({ aiProcessing: false });
      wx.showToast({ title: 'AI 失败', icon: 'none' });
    });
  },

});
      // Also search notes directly
      var notes = noteModule.searchNotes(query);
      notes.slice(0, 3).forEach(function(n) {
        var nodeId = 'node_note_' + n.id;
        var exists = results.some(function(r) { return r.id === nodeId; 

  toggleAiMenu: function() {
    this.setData({ showAiMenu: !this.data.showAiMenu });
  },

  onAiContinue: function() {
    this.runAiTask('continue');
  },

  onAiSummarize: function() {
    this.runAiTask('summarize');
  },

  onAiRewrite: function() {
    this.runAiTask('rewrite');
  },

  onAiExtractTasks: function() {
    this.runAiTask('extract');
  },

  onAiExpand: function() {
    this.runAiTask('expand');
  },

  onAiShorten: function() {
    this.runAiTask('shorten');
  },

  runAiTask: function(task) {
    var self = this;
    var content = self.data.content;
    if (!content || content.length < 10) {
      wx.showToast({ title: '内容太短', icon: 'none' });
      return;
    }
    self.setData({ aiProcessing: true, showAiMenu: false });

    var gateway = require('../../miniprogram/ai-gateway');
    var promptRegistry = require('../../miniprogram/prompt-registry');

    var prompts = {
      continue: '请根据以下内容继续写下去，保持风格一致，只输出续写部分：',
      summarize: '请用一段话总结以下内容的核心要点：',
      rewrite: '请重新改写以下内容，使其更清晰、更有条理：',
      extract: '请从以下内容中提取待办任务，每行一个，用 - [ ] 开头：',
      expand: '请扩充以下内容，增加更多细节和例子：',
      shorten: '请精简以下内容，保留核心信息，删除冗余部分：'
    };

    var systemPrompt = prompts[task] || prompts.summarize;
    var userMsg = content.substring(0, 2000);

    gateway.ask(userMsg, systemPrompt).then(function(res) {
      var result = res.content || '';
      if (task === 'continue') {
        self.setData({ content: content + '

' + result, aiProcessing: false });
      } else if (task === 'extract') {
        self.setData({ content: content + '

## 提取的任务
' + result, aiProcessing: false });
      } else {
        wx.showModal({
          title: 'AI 结果',
          content: result.substring(0, 500),
          confirmText: '应用',
          cancelText: '取消',
          success: function(modalRes) {
            if (modalRes.confirm) {
              self.setData({ content: result, aiProcessing: false });
            } else {
              self.setData({ aiProcessing: false });
            }
          }
        });
      }
      wx.showToast({ title: 'AI 完成', icon: 'success' });
    }).catch(function(err) {
      self.setData({ aiProcessing: false });
      wx.showToast({ title: 'AI 失败', icon: 'none' });
    });
  },

});
        if (!exists) {
          results.push({ id: nodeId, label: n.title || 'Untitled', type: 'note' 

  toggleAiMenu: function() {
    this.setData({ showAiMenu: !this.data.showAiMenu });
  },

  onAiContinue: function() {
    this.runAiTask('continue');
  },

  onAiSummarize: function() {
    this.runAiTask('summarize');
  },

  onAiRewrite: function() {
    this.runAiTask('rewrite');
  },

  onAiExtractTasks: function() {
    this.runAiTask('extract');
  },

  onAiExpand: function() {
    this.runAiTask('expand');
  },

  onAiShorten: function() {
    this.runAiTask('shorten');
  },

  runAiTask: function(task) {
    var self = this;
    var content = self.data.content;
    if (!content || content.length < 10) {
      wx.showToast({ title: '内容太短', icon: 'none' });
      return;
    }
    self.setData({ aiProcessing: true, showAiMenu: false });

    var gateway = require('../../miniprogram/ai-gateway');
    var promptRegistry = require('../../miniprogram/prompt-registry');

    var prompts = {
      continue: '请根据以下内容继续写下去，保持风格一致，只输出续写部分：',
      summarize: '请用一段话总结以下内容的核心要点：',
      rewrite: '请重新改写以下内容，使其更清晰、更有条理：',
      extract: '请从以下内容中提取待办任务，每行一个，用 - [ ] 开头：',
      expand: '请扩充以下内容，增加更多细节和例子：',
      shorten: '请精简以下内容，保留核心信息，删除冗余部分：'
    };

    var systemPrompt = prompts[task] || prompts.summarize;
    var userMsg = content.substring(0, 2000);

    gateway.ask(userMsg, systemPrompt).then(function(res) {
      var result = res.content || '';
      if (task === 'continue') {
        self.setData({ content: content + '

' + result, aiProcessing: false });
      } else if (task === 'extract') {
        self.setData({ content: content + '

## 提取的任务
' + result, aiProcessing: false });
      } else {
        wx.showModal({
          title: 'AI 结果',
          content: result.substring(0, 500),
          confirmText: '应用',
          cancelText: '取消',
          success: function(modalRes) {
            if (modalRes.confirm) {
              self.setData({ content: result, aiProcessing: false });
            } else {
              self.setData({ aiProcessing: false });
            }
          }
        });
      }
      wx.showToast({ title: 'AI 完成', icon: 'success' });
    }).catch(function(err) {
      self.setData({ aiProcessing: false });
      wx.showToast({ title: 'AI 失败', icon: 'none' });
    });
  },

});
        }
      

  toggleAiMenu: function() {
    this.setData({ showAiMenu: !this.data.showAiMenu });
  },

  onAiContinue: function() {
    this.runAiTask('continue');
  },

  onAiSummarize: function() {
    this.runAiTask('summarize');
  },

  onAiRewrite: function() {
    this.runAiTask('rewrite');
  },

  onAiExtractTasks: function() {
    this.runAiTask('extract');
  },

  onAiExpand: function() {
    this.runAiTask('expand');
  },

  onAiShorten: function() {
    this.runAiTask('shorten');
  },

  runAiTask: function(task) {
    var self = this;
    var content = self.data.content;
    if (!content || content.length < 10) {
      wx.showToast({ title: '内容太短', icon: 'none' });
      return;
    }
    self.setData({ aiProcessing: true, showAiMenu: false });

    var gateway = require('../../miniprogram/ai-gateway');
    var promptRegistry = require('../../miniprogram/prompt-registry');

    var prompts = {
      continue: '请根据以下内容继续写下去，保持风格一致，只输出续写部分：',
      summarize: '请用一段话总结以下内容的核心要点：',
      rewrite: '请重新改写以下内容，使其更清晰、更有条理：',
      extract: '请从以下内容中提取待办任务，每行一个，用 - [ ] 开头：',
      expand: '请扩充以下内容，增加更多细节和例子：',
      shorten: '请精简以下内容，保留核心信息，删除冗余部分：'
    };

    var systemPrompt = prompts[task] || prompts.summarize;
    var userMsg = content.substring(0, 2000);

    gateway.ask(userMsg, systemPrompt).then(function(res) {
      var result = res.content || '';
      if (task === 'continue') {
        self.setData({ content: content + '

' + result, aiProcessing: false });
      } else if (task === 'extract') {
        self.setData({ content: content + '

## 提取的任务
' + result, aiProcessing: false });
      } else {
        wx.showModal({
          title: 'AI 结果',
          content: result.substring(0, 500),
          confirmText: '应用',
          cancelText: '取消',
          success: function(modalRes) {
            if (modalRes.confirm) {
              self.setData({ content: result, aiProcessing: false });
            } else {
              self.setData({ aiProcessing: false });
            }
          }
        });
      }
      wx.showToast({ title: 'AI 完成', icon: 'success' });
    }).catch(function(err) {
      self.setData({ aiProcessing: false });
      wx.showToast({ title: 'AI 失败', icon: 'none' });
    });
  },

});
    }
    this.setData({ showSuggestions: results.length > 0, suggestions: results, linkQuery: query 

  toggleAiMenu: function() {
    this.setData({ showAiMenu: !this.data.showAiMenu });
  },

  onAiContinue: function() {
    this.runAiTask('continue');
  },

  onAiSummarize: function() {
    this.runAiTask('summarize');
  },

  onAiRewrite: function() {
    this.runAiTask('rewrite');
  },

  onAiExtractTasks: function() {
    this.runAiTask('extract');
  },

  onAiExpand: function() {
    this.runAiTask('expand');
  },

  onAiShorten: function() {
    this.runAiTask('shorten');
  },

  runAiTask: function(task) {
    var self = this;
    var content = self.data.content;
    if (!content || content.length < 10) {
      wx.showToast({ title: '内容太短', icon: 'none' });
      return;
    }
    self.setData({ aiProcessing: true, showAiMenu: false });

    var gateway = require('../../miniprogram/ai-gateway');
    var promptRegistry = require('../../miniprogram/prompt-registry');

    var prompts = {
      continue: '请根据以下内容继续写下去，保持风格一致，只输出续写部分：',
      summarize: '请用一段话总结以下内容的核心要点：',
      rewrite: '请重新改写以下内容，使其更清晰、更有条理：',
      extract: '请从以下内容中提取待办任务，每行一个，用 - [ ] 开头：',
      expand: '请扩充以下内容，增加更多细节和例子：',
      shorten: '请精简以下内容，保留核心信息，删除冗余部分：'
    };

    var systemPrompt = prompts[task] || prompts.summarize;
    var userMsg = content.substring(0, 2000);

    gateway.ask(userMsg, systemPrompt).then(function(res) {
      var result = res.content || '';
      if (task === 'continue') {
        self.setData({ content: content + '

' + result, aiProcessing: false });
      } else if (task === 'extract') {
        self.setData({ content: content + '

## 提取的任务
' + result, aiProcessing: false });
      } else {
        wx.showModal({
          title: 'AI 结果',
          content: result.substring(0, 500),
          confirmText: '应用',
          cancelText: '取消',
          success: function(modalRes) {
            if (modalRes.confirm) {
              self.setData({ content: result, aiProcessing: false });
            } else {
              self.setData({ aiProcessing: false });
            }
          }
        });
      }
      wx.showToast({ title: 'AI 完成', icon: 'success' });
    }).catch(function(err) {
      self.setData({ aiProcessing: false });
      wx.showToast({ title: 'AI 失败', icon: 'none' });
    });
  },

});
  },

  onSuggestionTap: function(e) {
    var label = e.currentTarget.dataset.label;
    var content = this.data.content;
    var lastOpen = content.lastIndexOf('[[');
    if (lastOpen >= 0) {
      var newContent = content.substring(0, lastOpen + 2) + label + ']]';
      this.setData({ content: newContent, showSuggestions: false,
    previewMode: false,
    htmlContent: '', suggestions: [] 

  toggleAiMenu: function() {
    this.setData({ showAiMenu: !this.data.showAiMenu });
  },

  onAiContinue: function() {
    this.runAiTask('continue');
  },

  onAiSummarize: function() {
    this.runAiTask('summarize');
  },

  onAiRewrite: function() {
    this.runAiTask('rewrite');
  },

  onAiExtractTasks: function() {
    this.runAiTask('extract');
  },

  onAiExpand: function() {
    this.runAiTask('expand');
  },

  onAiShorten: function() {
    this.runAiTask('shorten');
  },

  runAiTask: function(task) {
    var self = this;
    var content = self.data.content;
    if (!content || content.length < 10) {
      wx.showToast({ title: '内容太短', icon: 'none' });
      return;
    }
    self.setData({ aiProcessing: true, showAiMenu: false });

    var gateway = require('../../miniprogram/ai-gateway');
    var promptRegistry = require('../../miniprogram/prompt-registry');

    var prompts = {
      continue: '请根据以下内容继续写下去，保持风格一致，只输出续写部分：',
      summarize: '请用一段话总结以下内容的核心要点：',
      rewrite: '请重新改写以下内容，使其更清晰、更有条理：',
      extract: '请从以下内容中提取待办任务，每行一个，用 - [ ] 开头：',
      expand: '请扩充以下内容，增加更多细节和例子：',
      shorten: '请精简以下内容，保留核心信息，删除冗余部分：'
    };

    var systemPrompt = prompts[task] || prompts.summarize;
    var userMsg = content.substring(0, 2000);

    gateway.ask(userMsg, systemPrompt).then(function(res) {
      var result = res.content || '';
      if (task === 'continue') {
        self.setData({ content: content + '

' + result, aiProcessing: false });
      } else if (task === 'extract') {
        self.setData({ content: content + '

## 提取的任务
' + result, aiProcessing: false });
      } else {
        wx.showModal({
          title: 'AI 结果',
          content: result.substring(0, 500),
          confirmText: '应用',
          cancelText: '取消',
          success: function(modalRes) {
            if (modalRes.confirm) {
              self.setData({ content: result, aiProcessing: false });
            } else {
              self.setData({ aiProcessing: false });
            }
          }
        });
      }
      wx.showToast({ title: 'AI 完成', icon: 'success' });
    }).catch(function(err) {
      self.setData({ aiProcessing: false });
      wx.showToast({ title: 'AI 失败', icon: 'none' });
    });
  },

});
    }
  },

  insertMarkdown: function(e) {
    var type = e.currentTarget.dataset.type;
    var content = this.data.content;
    var insert = '';
    switch (type) {
      case 'bold': insert = '**粗体**'; break;
      case 'italic': insert = '*斜体*'; break;
      case 'heading': insert = '## '; break;
      case 'list': insert = '- '; break;
      case 'link': insert = '[[]]'; break;
      case 'code': insert = '`代码`'; break;
      case 'divider': insert = '\n---\n'; break;
    }
    this.setData({ content: content + insert 

  toggleAiMenu: function() {
    this.setData({ showAiMenu: !this.data.showAiMenu });
  },

  onAiContinue: function() {
    this.runAiTask('continue');
  },

  onAiSummarize: function() {
    this.runAiTask('summarize');
  },

  onAiRewrite: function() {
    this.runAiTask('rewrite');
  },

  onAiExtractTasks: function() {
    this.runAiTask('extract');
  },

  onAiExpand: function() {
    this.runAiTask('expand');
  },

  onAiShorten: function() {
    this.runAiTask('shorten');
  },

  runAiTask: function(task) {
    var self = this;
    var content = self.data.content;
    if (!content || content.length < 10) {
      wx.showToast({ title: '内容太短', icon: 'none' });
      return;
    }
    self.setData({ aiProcessing: true, showAiMenu: false });

    var gateway = require('../../miniprogram/ai-gateway');
    var promptRegistry = require('../../miniprogram/prompt-registry');

    var prompts = {
      continue: '请根据以下内容继续写下去，保持风格一致，只输出续写部分：',
      summarize: '请用一段话总结以下内容的核心要点：',
      rewrite: '请重新改写以下内容，使其更清晰、更有条理：',
      extract: '请从以下内容中提取待办任务，每行一个，用 - [ ] 开头：',
      expand: '请扩充以下内容，增加更多细节和例子：',
      shorten: '请精简以下内容，保留核心信息，删除冗余部分：'
    };

    var systemPrompt = prompts[task] || prompts.summarize;
    var userMsg = content.substring(0, 2000);

    gateway.ask(userMsg, systemPrompt).then(function(res) {
      var result = res.content || '';
      if (task === 'continue') {
        self.setData({ content: content + '

' + result, aiProcessing: false });
      } else if (task === 'extract') {
        self.setData({ content: content + '

## 提取的任务
' + result, aiProcessing: false });
      } else {
        wx.showModal({
          title: 'AI 结果',
          content: result.substring(0, 500),
          confirmText: '应用',
          cancelText: '取消',
          success: function(modalRes) {
            if (modalRes.confirm) {
              self.setData({ content: result, aiProcessing: false });
            } else {
              self.setData({ aiProcessing: false });
            }
          }
        });
      }
      wx.showToast({ title: 'AI 完成', icon: 'success' });
    }).catch(function(err) {
      self.setData({ aiProcessing: false });
      wx.showToast({ title: 'AI 失败', icon: 'none' });
    });
  },

});
    if (type === 'link') {
      this._checkLinkTrigger(content + insert);
    }
  },

  // AI Assistance
  aiSuggestTitle: function() {
    if (!this.data.content.trim()) {
      wx.showToast({ title: '请先输入内容', icon: 'none' 

  toggleAiMenu: function() {
    this.setData({ showAiMenu: !this.data.showAiMenu });
  },

  onAiContinue: function() {
    this.runAiTask('continue');
  },

  onAiSummarize: function() {
    this.runAiTask('summarize');
  },

  onAiRewrite: function() {
    this.runAiTask('rewrite');
  },

  onAiExtractTasks: function() {
    this.runAiTask('extract');
  },

  onAiExpand: function() {
    this.runAiTask('expand');
  },

  onAiShorten: function() {
    this.runAiTask('shorten');
  },

  runAiTask: function(task) {
    var self = this;
    var content = self.data.content;
    if (!content || content.length < 10) {
      wx.showToast({ title: '内容太短', icon: 'none' });
      return;
    }
    self.setData({ aiProcessing: true, showAiMenu: false });

    var gateway = require('../../miniprogram/ai-gateway');
    var promptRegistry = require('../../miniprogram/prompt-registry');

    var prompts = {
      continue: '请根据以下内容继续写下去，保持风格一致，只输出续写部分：',
      summarize: '请用一段话总结以下内容的核心要点：',
      rewrite: '请重新改写以下内容，使其更清晰、更有条理：',
      extract: '请从以下内容中提取待办任务，每行一个，用 - [ ] 开头：',
      expand: '请扩充以下内容，增加更多细节和例子：',
      shorten: '请精简以下内容，保留核心信息，删除冗余部分：'
    };

    var systemPrompt = prompts[task] || prompts.summarize;
    var userMsg = content.substring(0, 2000);

    gateway.ask(userMsg, systemPrompt).then(function(res) {
      var result = res.content || '';
      if (task === 'continue') {
        self.setData({ content: content + '

' + result, aiProcessing: false });
      } else if (task === 'extract') {
        self.setData({ content: content + '

## 提取的任务
' + result, aiProcessing: false });
      } else {
        wx.showModal({
          title: 'AI 结果',
          content: result.substring(0, 500),
          confirmText: '应用',
          cancelText: '取消',
          success: function(modalRes) {
            if (modalRes.confirm) {
              self.setData({ content: result, aiProcessing: false });
            } else {
              self.setData({ aiProcessing: false });
            }
          }
        });
      }
      wx.showToast({ title: 'AI 完成', icon: 'success' });
    }).catch(function(err) {
      self.setData({ aiProcessing: false });
      wx.showToast({ title: 'AI 失败', icon: 'none' });
    });
  },

});
      return;
    }
    var self = this;
    var aiGateway = require('../../miniprogram/ai-gateway');
    aiGateway.ask('为以下内容生成一个简洁标题（不超过20字，只返回标题）：\n' + self.data.content.substring(0, 500))
      .then(function(r) {
        self.setData({ title: r.content.replace(/['"]/g, '').trim() 

  toggleAiMenu: function() {
    this.setData({ showAiMenu: !this.data.showAiMenu });
  },

  onAiContinue: function() {
    this.runAiTask('continue');
  },

  onAiSummarize: function() {
    this.runAiTask('summarize');
  },

  onAiRewrite: function() {
    this.runAiTask('rewrite');
  },

  onAiExtractTasks: function() {
    this.runAiTask('extract');
  },

  onAiExpand: function() {
    this.runAiTask('expand');
  },

  onAiShorten: function() {
    this.runAiTask('shorten');
  },

  runAiTask: function(task) {
    var self = this;
    var content = self.data.content;
    if (!content || content.length < 10) {
      wx.showToast({ title: '内容太短', icon: 'none' });
      return;
    }
    self.setData({ aiProcessing: true, showAiMenu: false });

    var gateway = require('../../miniprogram/ai-gateway');
    var promptRegistry = require('../../miniprogram/prompt-registry');

    var prompts = {
      continue: '请根据以下内容继续写下去，保持风格一致，只输出续写部分：',
      summarize: '请用一段话总结以下内容的核心要点：',
      rewrite: '请重新改写以下内容，使其更清晰、更有条理：',
      extract: '请从以下内容中提取待办任务，每行一个，用 - [ ] 开头：',
      expand: '请扩充以下内容，增加更多细节和例子：',
      shorten: '请精简以下内容，保留核心信息，删除冗余部分：'
    };

    var systemPrompt = prompts[task] || prompts.summarize;
    var userMsg = content.substring(0, 2000);

    gateway.ask(userMsg, systemPrompt).then(function(res) {
      var result = res.content || '';
      if (task === 'continue') {
        self.setData({ content: content + '

' + result, aiProcessing: false });
      } else if (task === 'extract') {
        self.setData({ content: content + '

## 提取的任务
' + result, aiProcessing: false });
      } else {
        wx.showModal({
          title: 'AI 结果',
          content: result.substring(0, 500),
          confirmText: '应用',
          cancelText: '取消',
          success: function(modalRes) {
            if (modalRes.confirm) {
              self.setData({ content: result, aiProcessing: false });
            } else {
              self.setData({ aiProcessing: false });
            }
          }
        });
      }
      wx.showToast({ title: 'AI 完成', icon: 'success' });
    }).catch(function(err) {
      self.setData({ aiProcessing: false });
      wx.showToast({ title: 'AI 失败', icon: 'none' });
    });
  },

});
        wx.showToast({ title: '标题已生成', icon: 'success' 

  toggleAiMenu: function() {
    this.setData({ showAiMenu: !this.data.showAiMenu });
  },

  onAiContinue: function() {
    this.runAiTask('continue');
  },

  onAiSummarize: function() {
    this.runAiTask('summarize');
  },

  onAiRewrite: function() {
    this.runAiTask('rewrite');
  },

  onAiExtractTasks: function() {
    this.runAiTask('extract');
  },

  onAiExpand: function() {
    this.runAiTask('expand');
  },

  onAiShorten: function() {
    this.runAiTask('shorten');
  },

  runAiTask: function(task) {
    var self = this;
    var content = self.data.content;
    if (!content || content.length < 10) {
      wx.showToast({ title: '内容太短', icon: 'none' });
      return;
    }
    self.setData({ aiProcessing: true, showAiMenu: false });

    var gateway = require('../../miniprogram/ai-gateway');
    var promptRegistry = require('../../miniprogram/prompt-registry');

    var prompts = {
      continue: '请根据以下内容继续写下去，保持风格一致，只输出续写部分：',
      summarize: '请用一段话总结以下内容的核心要点：',
      rewrite: '请重新改写以下内容，使其更清晰、更有条理：',
      extract: '请从以下内容中提取待办任务，每行一个，用 - [ ] 开头：',
      expand: '请扩充以下内容，增加更多细节和例子：',
      shorten: '请精简以下内容，保留核心信息，删除冗余部分：'
    };

    var systemPrompt = prompts[task] || prompts.summarize;
    var userMsg = content.substring(0, 2000);

    gateway.ask(userMsg, systemPrompt).then(function(res) {
      var result = res.content || '';
      if (task === 'continue') {
        self.setData({ content: content + '

' + result, aiProcessing: false });
      } else if (task === 'extract') {
        self.setData({ content: content + '

## 提取的任务
' + result, aiProcessing: false });
      } else {
        wx.showModal({
          title: 'AI 结果',
          content: result.substring(0, 500),
          confirmText: '应用',
          cancelText: '取消',
          success: function(modalRes) {
            if (modalRes.confirm) {
              self.setData({ content: result, aiProcessing: false });
            } else {
              self.setData({ aiProcessing: false });
            }
          }
        });
      }
      wx.showToast({ title: 'AI 完成', icon: 'success' });
    }).catch(function(err) {
      self.setData({ aiProcessing: false });
      wx.showToast({ title: 'AI 失败', icon: 'none' });
    });
  },

});
      })
      .catch(function() { wx.showToast({ title: 'AI 服务不可用', icon: 'none' 

  toggleAiMenu: function() {
    this.setData({ showAiMenu: !this.data.showAiMenu });
  },

  onAiContinue: function() {
    this.runAiTask('continue');
  },

  onAiSummarize: function() {
    this.runAiTask('summarize');
  },

  onAiRewrite: function() {
    this.runAiTask('rewrite');
  },

  onAiExtractTasks: function() {
    this.runAiTask('extract');
  },

  onAiExpand: function() {
    this.runAiTask('expand');
  },

  onAiShorten: function() {
    this.runAiTask('shorten');
  },

  runAiTask: function(task) {
    var self = this;
    var content = self.data.content;
    if (!content || content.length < 10) {
      wx.showToast({ title: '内容太短', icon: 'none' });
      return;
    }
    self.setData({ aiProcessing: true, showAiMenu: false });

    var gateway = require('../../miniprogram/ai-gateway');
    var promptRegistry = require('../../miniprogram/prompt-registry');

    var prompts = {
      continue: '请根据以下内容继续写下去，保持风格一致，只输出续写部分：',
      summarize: '请用一段话总结以下内容的核心要点：',
      rewrite: '请重新改写以下内容，使其更清晰、更有条理：',
      extract: '请从以下内容中提取待办任务，每行一个，用 - [ ] 开头：',
      expand: '请扩充以下内容，增加更多细节和例子：',
      shorten: '请精简以下内容，保留核心信息，删除冗余部分：'
    };

    var systemPrompt = prompts[task] || prompts.summarize;
    var userMsg = content.substring(0, 2000);

    gateway.ask(userMsg, systemPrompt).then(function(res) {
      var result = res.content || '';
      if (task === 'continue') {
        self.setData({ content: content + '

' + result, aiProcessing: false });
      } else if (task === 'extract') {
        self.setData({ content: content + '

## 提取的任务
' + result, aiProcessing: false });
      } else {
        wx.showModal({
          title: 'AI 结果',
          content: result.substring(0, 500),
          confirmText: '应用',
          cancelText: '取消',
          success: function(modalRes) {
            if (modalRes.confirm) {
              self.setData({ content: result, aiProcessing: false });
            } else {
              self.setData({ aiProcessing: false });
            }
          }
        });
      }
      wx.showToast({ title: 'AI 完成', icon: 'success' });
    }).catch(function(err) {
      self.setData({ aiProcessing: false });
      wx.showToast({ title: 'AI 失败', icon: 'none' });
    });
  },

}); 

  toggleAiMenu: function() {
    this.setData({ showAiMenu: !this.data.showAiMenu });
  },

  onAiContinue: function() {
    this.runAiTask('continue');
  },

  onAiSummarize: function() {
    this.runAiTask('summarize');
  },

  onAiRewrite: function() {
    this.runAiTask('rewrite');
  },

  onAiExtractTasks: function() {
    this.runAiTask('extract');
  },

  onAiExpand: function() {
    this.runAiTask('expand');
  },

  onAiShorten: function() {
    this.runAiTask('shorten');
  },

  runAiTask: function(task) {
    var self = this;
    var content = self.data.content;
    if (!content || content.length < 10) {
      wx.showToast({ title: '内容太短', icon: 'none' });
      return;
    }
    self.setData({ aiProcessing: true, showAiMenu: false });

    var gateway = require('../../miniprogram/ai-gateway');
    var promptRegistry = require('../../miniprogram/prompt-registry');

    var prompts = {
      continue: '请根据以下内容继续写下去，保持风格一致，只输出续写部分：',
      summarize: '请用一段话总结以下内容的核心要点：',
      rewrite: '请重新改写以下内容，使其更清晰、更有条理：',
      extract: '请从以下内容中提取待办任务，每行一个，用 - [ ] 开头：',
      expand: '请扩充以下内容，增加更多细节和例子：',
      shorten: '请精简以下内容，保留核心信息，删除冗余部分：'
    };

    var systemPrompt = prompts[task] || prompts.summarize;
    var userMsg = content.substring(0, 2000);

    gateway.ask(userMsg, systemPrompt).then(function(res) {
      var result = res.content || '';
      if (task === 'continue') {
        self.setData({ content: content + '

' + result, aiProcessing: false });
      } else if (task === 'extract') {
        self.setData({ content: content + '

## 提取的任务
' + result, aiProcessing: false });
      } else {
        wx.showModal({
          title: 'AI 结果',
          content: result.substring(0, 500),
          confirmText: '应用',
          cancelText: '取消',
          success: function(modalRes) {
            if (modalRes.confirm) {
              self.setData({ content: result, aiProcessing: false });
            } else {
              self.setData({ aiProcessing: false });
            }
          }
        });
      }
      wx.showToast({ title: 'AI 完成', icon: 'success' });
    }).catch(function(err) {
      self.setData({ aiProcessing: false });
      wx.showToast({ title: 'AI 失败', icon: 'none' });
    });
  },

});
  },

  aiSuggestTags: function() {
    if (!this.data.content.trim()) {
      wx.showToast({ title: '请先输入内容', icon: 'none' 

  toggleAiMenu: function() {
    this.setData({ showAiMenu: !this.data.showAiMenu });
  },

  onAiContinue: function() {
    this.runAiTask('continue');
  },

  onAiSummarize: function() {
    this.runAiTask('summarize');
  },

  onAiRewrite: function() {
    this.runAiTask('rewrite');
  },

  onAiExtractTasks: function() {
    this.runAiTask('extract');
  },

  onAiExpand: function() {
    this.runAiTask('expand');
  },

  onAiShorten: function() {
    this.runAiTask('shorten');
  },

  runAiTask: function(task) {
    var self = this;
    var content = self.data.content;
    if (!content || content.length < 10) {
      wx.showToast({ title: '内容太短', icon: 'none' });
      return;
    }
    self.setData({ aiProcessing: true, showAiMenu: false });

    var gateway = require('../../miniprogram/ai-gateway');
    var promptRegistry = require('../../miniprogram/prompt-registry');

    var prompts = {
      continue: '请根据以下内容继续写下去，保持风格一致，只输出续写部分：',
      summarize: '请用一段话总结以下内容的核心要点：',
      rewrite: '请重新改写以下内容，使其更清晰、更有条理：',
      extract: '请从以下内容中提取待办任务，每行一个，用 - [ ] 开头：',
      expand: '请扩充以下内容，增加更多细节和例子：',
      shorten: '请精简以下内容，保留核心信息，删除冗余部分：'
    };

    var systemPrompt = prompts[task] || prompts.summarize;
    var userMsg = content.substring(0, 2000);

    gateway.ask(userMsg, systemPrompt).then(function(res) {
      var result = res.content || '';
      if (task === 'continue') {
        self.setData({ content: content + '

' + result, aiProcessing: false });
      } else if (task === 'extract') {
        self.setData({ content: content + '

## 提取的任务
' + result, aiProcessing: false });
      } else {
        wx.showModal({
          title: 'AI 结果',
          content: result.substring(0, 500),
          confirmText: '应用',
          cancelText: '取消',
          success: function(modalRes) {
            if (modalRes.confirm) {
              self.setData({ content: result, aiProcessing: false });
            } else {
              self.setData({ aiProcessing: false });
            }
          }
        });
      }
      wx.showToast({ title: 'AI 完成', icon: 'success' });
    }).catch(function(err) {
      self.setData({ aiProcessing: false });
      wx.showToast({ title: 'AI 失败', icon: 'none' });
    });
  },

});
      return;
    }
    var self = this;
    var aiGateway = require('../../miniprogram/ai-gateway');
    aiGateway.suggestTags(self.data.content)
      .then(function(r) {
        var tags = r.tags || [];
        if (tags.length > 0) {
          wx.showModal({
            title: 'AI 建议标签',
            content: tags.join(', '),
            confirmText: '添加到笔记',
            success: function(res) {
              if (res.confirm) {
                var noteModule = require('../../modules/note/public');
var markdown = require('../../utils/markdown');
                tags.forEach(function(tag) {
                  try { noteModule.addTag(self.data.noteId, tag); } catch(e) {}
                

  toggleAiMenu: function() {
    this.setData({ showAiMenu: !this.data.showAiMenu });
  },

  onAiContinue: function() {
    this.runAiTask('continue');
  },

  onAiSummarize: function() {
    this.runAiTask('summarize');
  },

  onAiRewrite: function() {
    this.runAiTask('rewrite');
  },

  onAiExtractTasks: function() {
    this.runAiTask('extract');
  },

  onAiExpand: function() {
    this.runAiTask('expand');
  },

  onAiShorten: function() {
    this.runAiTask('shorten');
  },

  runAiTask: function(task) {
    var self = this;
    var content = self.data.content;
    if (!content || content.length < 10) {
      wx.showToast({ title: '内容太短', icon: 'none' });
      return;
    }
    self.setData({ aiProcessing: true, showAiMenu: false });

    var gateway = require('../../miniprogram/ai-gateway');
    var promptRegistry = require('../../miniprogram/prompt-registry');

    var prompts = {
      continue: '请根据以下内容继续写下去，保持风格一致，只输出续写部分：',
      summarize: '请用一段话总结以下内容的核心要点：',
      rewrite: '请重新改写以下内容，使其更清晰、更有条理：',
      extract: '请从以下内容中提取待办任务，每行一个，用 - [ ] 开头：',
      expand: '请扩充以下内容，增加更多细节和例子：',
      shorten: '请精简以下内容，保留核心信息，删除冗余部分：'
    };

    var systemPrompt = prompts[task] || prompts.summarize;
    var userMsg = content.substring(0, 2000);

    gateway.ask(userMsg, systemPrompt).then(function(res) {
      var result = res.content || '';
      if (task === 'continue') {
        self.setData({ content: content + '

' + result, aiProcessing: false });
      } else if (task === 'extract') {
        self.setData({ content: content + '

## 提取的任务
' + result, aiProcessing: false });
      } else {
        wx.showModal({
          title: 'AI 结果',
          content: result.substring(0, 500),
          confirmText: '应用',
          cancelText: '取消',
          success: function(modalRes) {
            if (modalRes.confirm) {
              self.setData({ content: result, aiProcessing: false });
            } else {
              self.setData({ aiProcessing: false });
            }
          }
        });
      }
      wx.showToast({ title: 'AI 完成', icon: 'success' });
    }).catch(function(err) {
      self.setData({ aiProcessing: false });
      wx.showToast({ title: 'AI 失败', icon: 'none' });
    });
  },

});
                wx.showToast({ title: '已添加 ' + tags.length + ' 个标签', icon: 'success' 

  toggleAiMenu: function() {
    this.setData({ showAiMenu: !this.data.showAiMenu });
  },

  onAiContinue: function() {
    this.runAiTask('continue');
  },

  onAiSummarize: function() {
    this.runAiTask('summarize');
  },

  onAiRewrite: function() {
    this.runAiTask('rewrite');
  },

  onAiExtractTasks: function() {
    this.runAiTask('extract');
  },

  onAiExpand: function() {
    this.runAiTask('expand');
  },

  onAiShorten: function() {
    this.runAiTask('shorten');
  },

  runAiTask: function(task) {
    var self = this;
    var content = self.data.content;
    if (!content || content.length < 10) {
      wx.showToast({ title: '内容太短', icon: 'none' });
      return;
    }
    self.setData({ aiProcessing: true, showAiMenu: false });

    var gateway = require('../../miniprogram/ai-gateway');
    var promptRegistry = require('../../miniprogram/prompt-registry');

    var prompts = {
      continue: '请根据以下内容继续写下去，保持风格一致，只输出续写部分：',
      summarize: '请用一段话总结以下内容的核心要点：',
      rewrite: '请重新改写以下内容，使其更清晰、更有条理：',
      extract: '请从以下内容中提取待办任务，每行一个，用 - [ ] 开头：',
      expand: '请扩充以下内容，增加更多细节和例子：',
      shorten: '请精简以下内容，保留核心信息，删除冗余部分：'
    };

    var systemPrompt = prompts[task] || prompts.summarize;
    var userMsg = content.substring(0, 2000);

    gateway.ask(userMsg, systemPrompt).then(function(res) {
      var result = res.content || '';
      if (task === 'continue') {
        self.setData({ content: content + '

' + result, aiProcessing: false });
      } else if (task === 'extract') {
        self.setData({ content: content + '

## 提取的任务
' + result, aiProcessing: false });
      } else {
        wx.showModal({
          title: 'AI 结果',
          content: result.substring(0, 500),
          confirmText: '应用',
          cancelText: '取消',
          success: function(modalRes) {
            if (modalRes.confirm) {
              self.setData({ content: result, aiProcessing: false });
            } else {
              self.setData({ aiProcessing: false });
            }
          }
        });
      }
      wx.showToast({ title: 'AI 完成', icon: 'success' });
    }).catch(function(err) {
      self.setData({ aiProcessing: false });
      wx.showToast({ title: 'AI 失败', icon: 'none' });
    });
  },

});
              }
            }
          

  toggleAiMenu: function() {
    this.setData({ showAiMenu: !this.data.showAiMenu });
  },

  onAiContinue: function() {
    this.runAiTask('continue');
  },

  onAiSummarize: function() {
    this.runAiTask('summarize');
  },

  onAiRewrite: function() {
    this.runAiTask('rewrite');
  },

  onAiExtractTasks: function() {
    this.runAiTask('extract');
  },

  onAiExpand: function() {
    this.runAiTask('expand');
  },

  onAiShorten: function() {
    this.runAiTask('shorten');
  },

  runAiTask: function(task) {
    var self = this;
    var content = self.data.content;
    if (!content || content.length < 10) {
      wx.showToast({ title: '内容太短', icon: 'none' });
      return;
    }
    self.setData({ aiProcessing: true, showAiMenu: false });

    var gateway = require('../../miniprogram/ai-gateway');
    var promptRegistry = require('../../miniprogram/prompt-registry');

    var prompts = {
      continue: '请根据以下内容继续写下去，保持风格一致，只输出续写部分：',
      summarize: '请用一段话总结以下内容的核心要点：',
      rewrite: '请重新改写以下内容，使其更清晰、更有条理：',
      extract: '请从以下内容中提取待办任务，每行一个，用 - [ ] 开头：',
      expand: '请扩充以下内容，增加更多细节和例子：',
      shorten: '请精简以下内容，保留核心信息，删除冗余部分：'
    };

    var systemPrompt = prompts[task] || prompts.summarize;
    var userMsg = content.substring(0, 2000);

    gateway.ask(userMsg, systemPrompt).then(function(res) {
      var result = res.content || '';
      if (task === 'continue') {
        self.setData({ content: content + '

' + result, aiProcessing: false });
      } else if (task === 'extract') {
        self.setData({ content: content + '

## 提取的任务
' + result, aiProcessing: false });
      } else {
        wx.showModal({
          title: 'AI 结果',
          content: result.substring(0, 500),
          confirmText: '应用',
          cancelText: '取消',
          success: function(modalRes) {
            if (modalRes.confirm) {
              self.setData({ content: result, aiProcessing: false });
            } else {
              self.setData({ aiProcessing: false });
            }
          }
        });
      }
      wx.showToast({ title: 'AI 完成', icon: 'success' });
    }).catch(function(err) {
      self.setData({ aiProcessing: false });
      wx.showToast({ title: 'AI 失败', icon: 'none' });
    });
  },

});
        }
      })
      .catch(function() { wx.showToast({ title: 'AI 服务不可用', icon: 'none' 

  toggleAiMenu: function() {
    this.setData({ showAiMenu: !this.data.showAiMenu });
  },

  onAiContinue: function() {
    this.runAiTask('continue');
  },

  onAiSummarize: function() {
    this.runAiTask('summarize');
  },

  onAiRewrite: function() {
    this.runAiTask('rewrite');
  },

  onAiExtractTasks: function() {
    this.runAiTask('extract');
  },

  onAiExpand: function() {
    this.runAiTask('expand');
  },

  onAiShorten: function() {
    this.runAiTask('shorten');
  },

  runAiTask: function(task) {
    var self = this;
    var content = self.data.content;
    if (!content || content.length < 10) {
      wx.showToast({ title: '内容太短', icon: 'none' });
      return;
    }
    self.setData({ aiProcessing: true, showAiMenu: false });

    var gateway = require('../../miniprogram/ai-gateway');
    var promptRegistry = require('../../miniprogram/prompt-registry');

    var prompts = {
      continue: '请根据以下内容继续写下去，保持风格一致，只输出续写部分：',
      summarize: '请用一段话总结以下内容的核心要点：',
      rewrite: '请重新改写以下内容，使其更清晰、更有条理：',
      extract: '请从以下内容中提取待办任务，每行一个，用 - [ ] 开头：',
      expand: '请扩充以下内容，增加更多细节和例子：',
      shorten: '请精简以下内容，保留核心信息，删除冗余部分：'
    };

    var systemPrompt = prompts[task] || prompts.summarize;
    var userMsg = content.substring(0, 2000);

    gateway.ask(userMsg, systemPrompt).then(function(res) {
      var result = res.content || '';
      if (task === 'continue') {
        self.setData({ content: content + '

' + result, aiProcessing: false });
      } else if (task === 'extract') {
        self.setData({ content: content + '

## 提取的任务
' + result, aiProcessing: false });
      } else {
        wx.showModal({
          title: 'AI 结果',
          content: result.substring(0, 500),
          confirmText: '应用',
          cancelText: '取消',
          success: function(modalRes) {
            if (modalRes.confirm) {
              self.setData({ content: result, aiProcessing: false });
            } else {
              self.setData({ aiProcessing: false });
            }
          }
        });
      }
      wx.showToast({ title: 'AI 完成', icon: 'success' });
    }).catch(function(err) {
      self.setData({ aiProcessing: false });
      wx.showToast({ title: 'AI 失败', icon: 'none' });
    });
  },

}); 

  toggleAiMenu: function() {
    this.setData({ showAiMenu: !this.data.showAiMenu });
  },

  onAiContinue: function() {
    this.runAiTask('continue');
  },

  onAiSummarize: function() {
    this.runAiTask('summarize');
  },

  onAiRewrite: function() {
    this.runAiTask('rewrite');
  },

  onAiExtractTasks: function() {
    this.runAiTask('extract');
  },

  onAiExpand: function() {
    this.runAiTask('expand');
  },

  onAiShorten: function() {
    this.runAiTask('shorten');
  },

  runAiTask: function(task) {
    var self = this;
    var content = self.data.content;
    if (!content || content.length < 10) {
      wx.showToast({ title: '内容太短', icon: 'none' });
      return;
    }
    self.setData({ aiProcessing: true, showAiMenu: false });

    var gateway = require('../../miniprogram/ai-gateway');
    var promptRegistry = require('../../miniprogram/prompt-registry');

    var prompts = {
      continue: '请根据以下内容继续写下去，保持风格一致，只输出续写部分：',
      summarize: '请用一段话总结以下内容的核心要点：',
      rewrite: '请重新改写以下内容，使其更清晰、更有条理：',
      extract: '请从以下内容中提取待办任务，每行一个，用 - [ ] 开头：',
      expand: '请扩充以下内容，增加更多细节和例子：',
      shorten: '请精简以下内容，保留核心信息，删除冗余部分：'
    };

    var systemPrompt = prompts[task] || prompts.summarize;
    var userMsg = content.substring(0, 2000);

    gateway.ask(userMsg, systemPrompt).then(function(res) {
      var result = res.content || '';
      if (task === 'continue') {
        self.setData({ content: content + '

' + result, aiProcessing: false });
      } else if (task === 'extract') {
        self.setData({ content: content + '

## 提取的任务
' + result, aiProcessing: false });
      } else {
        wx.showModal({
          title: 'AI 结果',
          content: result.substring(0, 500),
          confirmText: '应用',
          cancelText: '取消',
          success: function(modalRes) {
            if (modalRes.confirm) {
              self.setData({ content: result, aiProcessing: false });
            } else {
              self.setData({ aiProcessing: false });
            }
          }
        });
      }
      wx.showToast({ title: 'AI 完成', icon: 'success' });
    }).catch(function(err) {
      self.setData({ aiProcessing: false });
      wx.showToast({ title: 'AI 失败', icon: 'none' });
    });
  },

});
  },

  aiSummarize: function() {
    if (!this.data.content.trim()) {
      wx.showToast({ title: '请先输入内容', icon: 'none' 

  toggleAiMenu: function() {
    this.setData({ showAiMenu: !this.data.showAiMenu });
  },

  onAiContinue: function() {
    this.runAiTask('continue');
  },

  onAiSummarize: function() {
    this.runAiTask('summarize');
  },

  onAiRewrite: function() {
    this.runAiTask('rewrite');
  },

  onAiExtractTasks: function() {
    this.runAiTask('extract');
  },

  onAiExpand: function() {
    this.runAiTask('expand');
  },

  onAiShorten: function() {
    this.runAiTask('shorten');
  },

  runAiTask: function(task) {
    var self = this;
    var content = self.data.content;
    if (!content || content.length < 10) {
      wx.showToast({ title: '内容太短', icon: 'none' });
      return;
    }
    self.setData({ aiProcessing: true, showAiMenu: false });

    var gateway = require('../../miniprogram/ai-gateway');
    var promptRegistry = require('../../miniprogram/prompt-registry');

    var prompts = {
      continue: '请根据以下内容继续写下去，保持风格一致，只输出续写部分：',
      summarize: '请用一段话总结以下内容的核心要点：',
      rewrite: '请重新改写以下内容，使其更清晰、更有条理：',
      extract: '请从以下内容中提取待办任务，每行一个，用 - [ ] 开头：',
      expand: '请扩充以下内容，增加更多细节和例子：',
      shorten: '请精简以下内容，保留核心信息，删除冗余部分：'
    };

    var systemPrompt = prompts[task] || prompts.summarize;
    var userMsg = content.substring(0, 2000);

    gateway.ask(userMsg, systemPrompt).then(function(res) {
      var result = res.content || '';
      if (task === 'continue') {
        self.setData({ content: content + '

' + result, aiProcessing: false });
      } else if (task === 'extract') {
        self.setData({ content: content + '

## 提取的任务
' + result, aiProcessing: false });
      } else {
        wx.showModal({
          title: 'AI 结果',
          content: result.substring(0, 500),
          confirmText: '应用',
          cancelText: '取消',
          success: function(modalRes) {
            if (modalRes.confirm) {
              self.setData({ content: result, aiProcessing: false });
            } else {
              self.setData({ aiProcessing: false });
            }
          }
        });
      }
      wx.showToast({ title: 'AI 完成', icon: 'success' });
    }).catch(function(err) {
      self.setData({ aiProcessing: false });
      wx.showToast({ title: 'AI 失败', icon: 'none' });
    });
  },

});
      return;
    }
    var self = this;
    var aiGateway = require('../../miniprogram/ai-gateway');
    aiGateway.summarize(self.data.content)
      .then(function(r) {
        wx.showModal({
          title: 'AI 摘要',
          content: r.summary || '(空)',
          showCancel: false
        

  toggleAiMenu: function() {
    this.setData({ showAiMenu: !this.data.showAiMenu });
  },

  onAiContinue: function() {
    this.runAiTask('continue');
  },

  onAiSummarize: function() {
    this.runAiTask('summarize');
  },

  onAiRewrite: function() {
    this.runAiTask('rewrite');
  },

  onAiExtractTasks: function() {
    this.runAiTask('extract');
  },

  onAiExpand: function() {
    this.runAiTask('expand');
  },

  onAiShorten: function() {
    this.runAiTask('shorten');
  },

  runAiTask: function(task) {
    var self = this;
    var content = self.data.content;
    if (!content || content.length < 10) {
      wx.showToast({ title: '内容太短', icon: 'none' });
      return;
    }
    self.setData({ aiProcessing: true, showAiMenu: false });

    var gateway = require('../../miniprogram/ai-gateway');
    var promptRegistry = require('../../miniprogram/prompt-registry');

    var prompts = {
      continue: '请根据以下内容继续写下去，保持风格一致，只输出续写部分：',
      summarize: '请用一段话总结以下内容的核心要点：',
      rewrite: '请重新改写以下内容，使其更清晰、更有条理：',
      extract: '请从以下内容中提取待办任务，每行一个，用 - [ ] 开头：',
      expand: '请扩充以下内容，增加更多细节和例子：',
      shorten: '请精简以下内容，保留核心信息，删除冗余部分：'
    };

    var systemPrompt = prompts[task] || prompts.summarize;
    var userMsg = content.substring(0, 2000);

    gateway.ask(userMsg, systemPrompt).then(function(res) {
      var result = res.content || '';
      if (task === 'continue') {
        self.setData({ content: content + '

' + result, aiProcessing: false });
      } else if (task === 'extract') {
        self.setData({ content: content + '

## 提取的任务
' + result, aiProcessing: false });
      } else {
        wx.showModal({
          title: 'AI 结果',
          content: result.substring(0, 500),
          confirmText: '应用',
          cancelText: '取消',
          success: function(modalRes) {
            if (modalRes.confirm) {
              self.setData({ content: result, aiProcessing: false });
            } else {
              self.setData({ aiProcessing: false });
            }
          }
        });
      }
      wx.showToast({ title: 'AI 完成', icon: 'success' });
    }).catch(function(err) {
      self.setData({ aiProcessing: false });
      wx.showToast({ title: 'AI 失败', icon: 'none' });
    });
  },

});
      })
      .catch(function() { wx.showToast({ title: 'AI 服务不可用', icon: 'none' 

  toggleAiMenu: function() {
    this.setData({ showAiMenu: !this.data.showAiMenu });
  },

  onAiContinue: function() {
    this.runAiTask('continue');
  },

  onAiSummarize: function() {
    this.runAiTask('summarize');
  },

  onAiRewrite: function() {
    this.runAiTask('rewrite');
  },

  onAiExtractTasks: function() {
    this.runAiTask('extract');
  },

  onAiExpand: function() {
    this.runAiTask('expand');
  },

  onAiShorten: function() {
    this.runAiTask('shorten');
  },

  runAiTask: function(task) {
    var self = this;
    var content = self.data.content;
    if (!content || content.length < 10) {
      wx.showToast({ title: '内容太短', icon: 'none' });
      return;
    }
    self.setData({ aiProcessing: true, showAiMenu: false });

    var gateway = require('../../miniprogram/ai-gateway');
    var promptRegistry = require('../../miniprogram/prompt-registry');

    var prompts = {
      continue: '请根据以下内容继续写下去，保持风格一致，只输出续写部分：',
      summarize: '请用一段话总结以下内容的核心要点：',
      rewrite: '请重新改写以下内容，使其更清晰、更有条理：',
      extract: '请从以下内容中提取待办任务，每行一个，用 - [ ] 开头：',
      expand: '请扩充以下内容，增加更多细节和例子：',
      shorten: '请精简以下内容，保留核心信息，删除冗余部分：'
    };

    var systemPrompt = prompts[task] || prompts.summarize;
    var userMsg = content.substring(0, 2000);

    gateway.ask(userMsg, systemPrompt).then(function(res) {
      var result = res.content || '';
      if (task === 'continue') {
        self.setData({ content: content + '

' + result, aiProcessing: false });
      } else if (task === 'extract') {
        self.setData({ content: content + '

## 提取的任务
' + result, aiProcessing: false });
      } else {
        wx.showModal({
          title: 'AI 结果',
          content: result.substring(0, 500),
          confirmText: '应用',
          cancelText: '取消',
          success: function(modalRes) {
            if (modalRes.confirm) {
              self.setData({ content: result, aiProcessing: false });
            } else {
              self.setData({ aiProcessing: false });
            }
          }
        });
      }
      wx.showToast({ title: 'AI 完成', icon: 'success' });
    }).catch(function(err) {
      self.setData({ aiProcessing: false });
      wx.showToast({ title: 'AI 失败', icon: 'none' });
    });
  },

}); 

  toggleAiMenu: function() {
    this.setData({ showAiMenu: !this.data.showAiMenu });
  },

  onAiContinue: function() {
    this.runAiTask('continue');
  },

  onAiSummarize: function() {
    this.runAiTask('summarize');
  },

  onAiRewrite: function() {
    this.runAiTask('rewrite');
  },

  onAiExtractTasks: function() {
    this.runAiTask('extract');
  },

  onAiExpand: function() {
    this.runAiTask('expand');
  },

  onAiShorten: function() {
    this.runAiTask('shorten');
  },

  runAiTask: function(task) {
    var self = this;
    var content = self.data.content;
    if (!content || content.length < 10) {
      wx.showToast({ title: '内容太短', icon: 'none' });
      return;
    }
    self.setData({ aiProcessing: true, showAiMenu: false });

    var gateway = require('../../miniprogram/ai-gateway');
    var promptRegistry = require('../../miniprogram/prompt-registry');

    var prompts = {
      continue: '请根据以下内容继续写下去，保持风格一致，只输出续写部分：',
      summarize: '请用一段话总结以下内容的核心要点：',
      rewrite: '请重新改写以下内容，使其更清晰、更有条理：',
      extract: '请从以下内容中提取待办任务，每行一个，用 - [ ] 开头：',
      expand: '请扩充以下内容，增加更多细节和例子：',
      shorten: '请精简以下内容，保留核心信息，删除冗余部分：'
    };

    var systemPrompt = prompts[task] || prompts.summarize;
    var userMsg = content.substring(0, 2000);

    gateway.ask(userMsg, systemPrompt).then(function(res) {
      var result = res.content || '';
      if (task === 'continue') {
        self.setData({ content: content + '

' + result, aiProcessing: false });
      } else if (task === 'extract') {
        self.setData({ content: content + '

## 提取的任务
' + result, aiProcessing: false });
      } else {
        wx.showModal({
          title: 'AI 结果',
          content: result.substring(0, 500),
          confirmText: '应用',
          cancelText: '取消',
          success: function(modalRes) {
            if (modalRes.confirm) {
              self.setData({ content: result, aiProcessing: false });
            } else {
              self.setData({ aiProcessing: false });
            }
          }
        });
      }
      wx.showToast({ title: 'AI 完成', icon: 'success' });
    }).catch(function(err) {
      self.setData({ aiProcessing: false });
      wx.showToast({ title: 'AI 失败', icon: 'none' });
    });
  },

});
  },

  syncToGraph: function(noteId, title, content) {
    try {
      var knowledgeModule = require('../../modules/knowledge/public');
      knowledgeModule.linkNote(noteId, title);
      var wikiLinkRegex = /\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g;
      var match;
      while ((match = wikiLinkRegex.exec(content)) !== null) {
        var target = match[1].trim();
        var alias = match[2] ? match[2].trim() : target;
        var existing = knowledgeModule.findNodeByRef('concept_' + target);
        var conceptNode = existing || knowledgeModule.createNode({
          type: 'concept', refId: 'concept_' + target, label: alias,
          metadata: { description: 'Wiki-Link concept' }
        

  toggleAiMenu: function() {
    this.setData({ showAiMenu: !this.data.showAiMenu });
  },

  onAiContinue: function() {
    this.runAiTask('continue');
  },

  onAiSummarize: function() {
    this.runAiTask('summarize');
  },

  onAiRewrite: function() {
    this.runAiTask('rewrite');
  },

  onAiExtractTasks: function() {
    this.runAiTask('extract');
  },

  onAiExpand: function() {
    this.runAiTask('expand');
  },

  onAiShorten: function() {
    this.runAiTask('shorten');
  },

  runAiTask: function(task) {
    var self = this;
    var content = self.data.content;
    if (!content || content.length < 10) {
      wx.showToast({ title: '内容太短', icon: 'none' });
      return;
    }
    self.setData({ aiProcessing: true, showAiMenu: false });

    var gateway = require('../../miniprogram/ai-gateway');
    var promptRegistry = require('../../miniprogram/prompt-registry');

    var prompts = {
      continue: '请根据以下内容继续写下去，保持风格一致，只输出续写部分：',
      summarize: '请用一段话总结以下内容的核心要点：',
      rewrite: '请重新改写以下内容，使其更清晰、更有条理：',
      extract: '请从以下内容中提取待办任务，每行一个，用 - [ ] 开头：',
      expand: '请扩充以下内容，增加更多细节和例子：',
      shorten: '请精简以下内容，保留核心信息，删除冗余部分：'
    };

    var systemPrompt = prompts[task] || prompts.summarize;
    var userMsg = content.substring(0, 2000);

    gateway.ask(userMsg, systemPrompt).then(function(res) {
      var result = res.content || '';
      if (task === 'continue') {
        self.setData({ content: content + '

' + result, aiProcessing: false });
      } else if (task === 'extract') {
        self.setData({ content: content + '

## 提取的任务
' + result, aiProcessing: false });
      } else {
        wx.showModal({
          title: 'AI 结果',
          content: result.substring(0, 500),
          confirmText: '应用',
          cancelText: '取消',
          success: function(modalRes) {
            if (modalRes.confirm) {
              self.setData({ content: result, aiProcessing: false });
            } else {
              self.setData({ aiProcessing: false });
            }
          }
        });
      }
      wx.showToast({ title: 'AI 完成', icon: 'success' });
    }).catch(function(err) {
      self.setData({ aiProcessing: false });
      wx.showToast({ title: 'AI 失败', icon: 'none' });
    });
  },

});
        var noteNode = knowledgeModule.findNodeByRef(noteId);
        if (noteNode && conceptNode) {
          knowledgeModule.createEdge({ source: noteNode.id, target: conceptNode.id, type: 'link' 

  toggleAiMenu: function() {
    this.setData({ showAiMenu: !this.data.showAiMenu });
  },

  onAiContinue: function() {
    this.runAiTask('continue');
  },

  onAiSummarize: function() {
    this.runAiTask('summarize');
  },

  onAiRewrite: function() {
    this.runAiTask('rewrite');
  },

  onAiExtractTasks: function() {
    this.runAiTask('extract');
  },

  onAiExpand: function() {
    this.runAiTask('expand');
  },

  onAiShorten: function() {
    this.runAiTask('shorten');
  },

  runAiTask: function(task) {
    var self = this;
    var content = self.data.content;
    if (!content || content.length < 10) {
      wx.showToast({ title: '内容太短', icon: 'none' });
      return;
    }
    self.setData({ aiProcessing: true, showAiMenu: false });

    var gateway = require('../../miniprogram/ai-gateway');
    var promptRegistry = require('../../miniprogram/prompt-registry');

    var prompts = {
      continue: '请根据以下内容继续写下去，保持风格一致，只输出续写部分：',
      summarize: '请用一段话总结以下内容的核心要点：',
      rewrite: '请重新改写以下内容，使其更清晰、更有条理：',
      extract: '请从以下内容中提取待办任务，每行一个，用 - [ ] 开头：',
      expand: '请扩充以下内容，增加更多细节和例子：',
      shorten: '请精简以下内容，保留核心信息，删除冗余部分：'
    };

    var systemPrompt = prompts[task] || prompts.summarize;
    var userMsg = content.substring(0, 2000);

    gateway.ask(userMsg, systemPrompt).then(function(res) {
      var result = res.content || '';
      if (task === 'continue') {
        self.setData({ content: content + '

' + result, aiProcessing: false });
      } else if (task === 'extract') {
        self.setData({ content: content + '

## 提取的任务
' + result, aiProcessing: false });
      } else {
        wx.showModal({
          title: 'AI 结果',
          content: result.substring(0, 500),
          confirmText: '应用',
          cancelText: '取消',
          success: function(modalRes) {
            if (modalRes.confirm) {
              self.setData({ content: result, aiProcessing: false });
            } else {
              self.setData({ aiProcessing: false });
            }
          }
        });
      }
      wx.showToast({ title: 'AI 完成', icon: 'success' });
    }).catch(function(err) {
      self.setData({ aiProcessing: false });
      wx.showToast({ title: 'AI 失败', icon: 'none' });
    });
  },

});
        }
      }
      var note = require('../../modules/note/public').getRecentNotes(100).find(function(n) { return n.id === noteId; 

  toggleAiMenu: function() {
    this.setData({ showAiMenu: !this.data.showAiMenu });
  },

  onAiContinue: function() {
    this.runAiTask('continue');
  },

  onAiSummarize: function() {
    this.runAiTask('summarize');
  },

  onAiRewrite: function() {
    this.runAiTask('rewrite');
  },

  onAiExtractTasks: function() {
    this.runAiTask('extract');
  },

  onAiExpand: function() {
    this.runAiTask('expand');
  },

  onAiShorten: function() {
    this.runAiTask('shorten');
  },

  runAiTask: function(task) {
    var self = this;
    var content = self.data.content;
    if (!content || content.length < 10) {
      wx.showToast({ title: '内容太短', icon: 'none' });
      return;
    }
    self.setData({ aiProcessing: true, showAiMenu: false });

    var gateway = require('../../miniprogram/ai-gateway');
    var promptRegistry = require('../../miniprogram/prompt-registry');

    var prompts = {
      continue: '请根据以下内容继续写下去，保持风格一致，只输出续写部分：',
      summarize: '请用一段话总结以下内容的核心要点：',
      rewrite: '请重新改写以下内容，使其更清晰、更有条理：',
      extract: '请从以下内容中提取待办任务，每行一个，用 - [ ] 开头：',
      expand: '请扩充以下内容，增加更多细节和例子：',
      shorten: '请精简以下内容，保留核心信息，删除冗余部分：'
    };

    var systemPrompt = prompts[task] || prompts.summarize;
    var userMsg = content.substring(0, 2000);

    gateway.ask(userMsg, systemPrompt).then(function(res) {
      var result = res.content || '';
      if (task === 'continue') {
        self.setData({ content: content + '

' + result, aiProcessing: false });
      } else if (task === 'extract') {
        self.setData({ content: content + '

## 提取的任务
' + result, aiProcessing: false });
      } else {
        wx.showModal({
          title: 'AI 结果',
          content: result.substring(0, 500),
          confirmText: '应用',
          cancelText: '取消',
          success: function(modalRes) {
            if (modalRes.confirm) {
              self.setData({ content: result, aiProcessing: false });
            } else {
              self.setData({ aiProcessing: false });
            }
          }
        });
      }
      wx.showToast({ title: 'AI 完成', icon: 'success' });
    }).catch(function(err) {
      self.setData({ aiProcessing: false });
      wx.showToast({ title: 'AI 失败', icon: 'none' });
    });
  },

});
      if (note && note.tags) {
        note.tags.forEach(function(tag) {
          var tagNode = knowledgeModule.findNodeByRef('tag_' + tag);
          if (!tagNode) {
            tagNode = knowledgeModule.createNode({
              type: 'tag', refId: 'tag_' + tag, label: '#' + tag,
              metadata: { description: 'Note tag' }
            

  toggleAiMenu: function() {
    this.setData({ showAiMenu: !this.data.showAiMenu });
  },

  onAiContinue: function() {
    this.runAiTask('continue');
  },

  onAiSummarize: function() {
    this.runAiTask('summarize');
  },

  onAiRewrite: function() {
    this.runAiTask('rewrite');
  },

  onAiExtractTasks: function() {
    this.runAiTask('extract');
  },

  onAiExpand: function() {
    this.runAiTask('expand');
  },

  onAiShorten: function() {
    this.runAiTask('shorten');
  },

  runAiTask: function(task) {
    var self = this;
    var content = self.data.content;
    if (!content || content.length < 10) {
      wx.showToast({ title: '内容太短', icon: 'none' });
      return;
    }
    self.setData({ aiProcessing: true, showAiMenu: false });

    var gateway = require('../../miniprogram/ai-gateway');
    var promptRegistry = require('../../miniprogram/prompt-registry');

    var prompts = {
      continue: '请根据以下内容继续写下去，保持风格一致，只输出续写部分：',
      summarize: '请用一段话总结以下内容的核心要点：',
      rewrite: '请重新改写以下内容，使其更清晰、更有条理：',
      extract: '请从以下内容中提取待办任务，每行一个，用 - [ ] 开头：',
      expand: '请扩充以下内容，增加更多细节和例子：',
      shorten: '请精简以下内容，保留核心信息，删除冗余部分：'
    };

    var systemPrompt = prompts[task] || prompts.summarize;
    var userMsg = content.substring(0, 2000);

    gateway.ask(userMsg, systemPrompt).then(function(res) {
      var result = res.content || '';
      if (task === 'continue') {
        self.setData({ content: content + '

' + result, aiProcessing: false });
      } else if (task === 'extract') {
        self.setData({ content: content + '

## 提取的任务
' + result, aiProcessing: false });
      } else {
        wx.showModal({
          title: 'AI 结果',
          content: result.substring(0, 500),
          confirmText: '应用',
          cancelText: '取消',
          success: function(modalRes) {
            if (modalRes.confirm) {
              self.setData({ content: result, aiProcessing: false });
            } else {
              self.setData({ aiProcessing: false });
            }
          }
        });
      }
      wx.showToast({ title: 'AI 完成', icon: 'success' });
    }).catch(function(err) {
      self.setData({ aiProcessing: false });
      wx.showToast({ title: 'AI 失败', icon: 'none' });
    });
  },

});
          }
          var noteNode = knowledgeModule.findNodeByRef(noteId);
          if (noteNode && tagNode) {
            knowledgeModule.createEdge({ source: noteNode.id, target: tagNode.id, type: 'tag' 

  toggleAiMenu: function() {
    this.setData({ showAiMenu: !this.data.showAiMenu });
  },

  onAiContinue: function() {
    this.runAiTask('continue');
  },

  onAiSummarize: function() {
    this.runAiTask('summarize');
  },

  onAiRewrite: function() {
    this.runAiTask('rewrite');
  },

  onAiExtractTasks: function() {
    this.runAiTask('extract');
  },

  onAiExpand: function() {
    this.runAiTask('expand');
  },

  onAiShorten: function() {
    this.runAiTask('shorten');
  },

  runAiTask: function(task) {
    var self = this;
    var content = self.data.content;
    if (!content || content.length < 10) {
      wx.showToast({ title: '内容太短', icon: 'none' });
      return;
    }
    self.setData({ aiProcessing: true, showAiMenu: false });

    var gateway = require('../../miniprogram/ai-gateway');
    var promptRegistry = require('../../miniprogram/prompt-registry');

    var prompts = {
      continue: '请根据以下内容继续写下去，保持风格一致，只输出续写部分：',
      summarize: '请用一段话总结以下内容的核心要点：',
      rewrite: '请重新改写以下内容，使其更清晰、更有条理：',
      extract: '请从以下内容中提取待办任务，每行一个，用 - [ ] 开头：',
      expand: '请扩充以下内容，增加更多细节和例子：',
      shorten: '请精简以下内容，保留核心信息，删除冗余部分：'
    };

    var systemPrompt = prompts[task] || prompts.summarize;
    var userMsg = content.substring(0, 2000);

    gateway.ask(userMsg, systemPrompt).then(function(res) {
      var result = res.content || '';
      if (task === 'continue') {
        self.setData({ content: content + '

' + result, aiProcessing: false });
      } else if (task === 'extract') {
        self.setData({ content: content + '

## 提取的任务
' + result, aiProcessing: false });
      } else {
        wx.showModal({
          title: 'AI 结果',
          content: result.substring(0, 500),
          confirmText: '应用',
          cancelText: '取消',
          success: function(modalRes) {
            if (modalRes.confirm) {
              self.setData({ content: result, aiProcessing: false });
            } else {
              self.setData({ aiProcessing: false });
            }
          }
        });
      }
      wx.showToast({ title: 'AI 完成', icon: 'success' });
    }).catch(function(err) {
      self.setData({ aiProcessing: false });
      wx.showToast({ title: 'AI 失败', icon: 'none' });
    });
  },

});
          }
        

  toggleAiMenu: function() {
    this.setData({ showAiMenu: !this.data.showAiMenu });
  },

  onAiContinue: function() {
    this.runAiTask('continue');
  },

  onAiSummarize: function() {
    this.runAiTask('summarize');
  },

  onAiRewrite: function() {
    this.runAiTask('rewrite');
  },

  onAiExtractTasks: function() {
    this.runAiTask('extract');
  },

  onAiExpand: function() {
    this.runAiTask('expand');
  },

  onAiShorten: function() {
    this.runAiTask('shorten');
  },

  runAiTask: function(task) {
    var self = this;
    var content = self.data.content;
    if (!content || content.length < 10) {
      wx.showToast({ title: '内容太短', icon: 'none' });
      return;
    }
    self.setData({ aiProcessing: true, showAiMenu: false });

    var gateway = require('../../miniprogram/ai-gateway');
    var promptRegistry = require('../../miniprogram/prompt-registry');

    var prompts = {
      continue: '请根据以下内容继续写下去，保持风格一致，只输出续写部分：',
      summarize: '请用一段话总结以下内容的核心要点：',
      rewrite: '请重新改写以下内容，使其更清晰、更有条理：',
      extract: '请从以下内容中提取待办任务，每行一个，用 - [ ] 开头：',
      expand: '请扩充以下内容，增加更多细节和例子：',
      shorten: '请精简以下内容，保留核心信息，删除冗余部分：'
    };

    var systemPrompt = prompts[task] || prompts.summarize;
    var userMsg = content.substring(0, 2000);

    gateway.ask(userMsg, systemPrompt).then(function(res) {
      var result = res.content || '';
      if (task === 'continue') {
        self.setData({ content: content + '

' + result, aiProcessing: false });
      } else if (task === 'extract') {
        self.setData({ content: content + '

## 提取的任务
' + result, aiProcessing: false });
      } else {
        wx.showModal({
          title: 'AI 结果',
          content: result.substring(0, 500),
          confirmText: '应用',
          cancelText: '取消',
          success: function(modalRes) {
            if (modalRes.confirm) {
              self.setData({ content: result, aiProcessing: false });
            } else {
              self.setData({ aiProcessing: false });
            }
          }
        });
      }
      wx.showToast({ title: 'AI 完成', icon: 'success' });
    }).catch(function(err) {
      self.setData({ aiProcessing: false });
      wx.showToast({ title: 'AI 失败', icon: 'none' });
    });
  },

});
      }
    } catch(e) { console.warn('[NoteEditor] syncToGraph error:', e); }
  },

  goBack: function() { wx.navigateBack(); },

  save: function() {
    var noteId = this.data.noteId;
    var title = this.data.title;
    var content = this.data.content;
    var isNew = this.data.isNew;
    if (!title.trim() && !content.trim()) {
      wx.showToast({ title: '内容不能为空', icon: 'none' 

  toggleAiMenu: function() {
    this.setData({ showAiMenu: !this.data.showAiMenu });
  },

  onAiContinue: function() {
    this.runAiTask('continue');
  },

  onAiSummarize: function() {
    this.runAiTask('summarize');
  },

  onAiRewrite: function() {
    this.runAiTask('rewrite');
  },

  onAiExtractTasks: function() {
    this.runAiTask('extract');
  },

  onAiExpand: function() {
    this.runAiTask('expand');
  },

  onAiShorten: function() {
    this.runAiTask('shorten');
  },

  runAiTask: function(task) {
    var self = this;
    var content = self.data.content;
    if (!content || content.length < 10) {
      wx.showToast({ title: '内容太短', icon: 'none' });
      return;
    }
    self.setData({ aiProcessing: true, showAiMenu: false });

    var gateway = require('../../miniprogram/ai-gateway');
    var promptRegistry = require('../../miniprogram/prompt-registry');

    var prompts = {
      continue: '请根据以下内容继续写下去，保持风格一致，只输出续写部分：',
      summarize: '请用一段话总结以下内容的核心要点：',
      rewrite: '请重新改写以下内容，使其更清晰、更有条理：',
      extract: '请从以下内容中提取待办任务，每行一个，用 - [ ] 开头：',
      expand: '请扩充以下内容，增加更多细节和例子：',
      shorten: '请精简以下内容，保留核心信息，删除冗余部分：'
    };

    var systemPrompt = prompts[task] || prompts.summarize;
    var userMsg = content.substring(0, 2000);

    gateway.ask(userMsg, systemPrompt).then(function(res) {
      var result = res.content || '';
      if (task === 'continue') {
        self.setData({ content: content + '

' + result, aiProcessing: false });
      } else if (task === 'extract') {
        self.setData({ content: content + '

## 提取的任务
' + result, aiProcessing: false });
      } else {
        wx.showModal({
          title: 'AI 结果',
          content: result.substring(0, 500),
          confirmText: '应用',
          cancelText: '取消',
          success: function(modalRes) {
            if (modalRes.confirm) {
              self.setData({ content: result, aiProcessing: false });
            } else {
              self.setData({ aiProcessing: false });
            }
          }
        });
      }
      wx.showToast({ title: 'AI 完成', icon: 'success' });
    }).catch(function(err) {
      self.setData({ aiProcessing: false });
      wx.showToast({ title: 'AI 失败', icon: 'none' });
    });
  },

});
      return;
    }
    if (isNew) {
      var note = noteModule.createNote({ title: title.trim(), content: content 

  toggleAiMenu: function() {
    this.setData({ showAiMenu: !this.data.showAiMenu });
  },

  onAiContinue: function() {
    this.runAiTask('continue');
  },

  onAiSummarize: function() {
    this.runAiTask('summarize');
  },

  onAiRewrite: function() {
    this.runAiTask('rewrite');
  },

  onAiExtractTasks: function() {
    this.runAiTask('extract');
  },

  onAiExpand: function() {
    this.runAiTask('expand');
  },

  onAiShorten: function() {
    this.runAiTask('shorten');
  },

  runAiTask: function(task) {
    var self = this;
    var content = self.data.content;
    if (!content || content.length < 10) {
      wx.showToast({ title: '内容太短', icon: 'none' });
      return;
    }
    self.setData({ aiProcessing: true, showAiMenu: false });

    var gateway = require('../../miniprogram/ai-gateway');
    var promptRegistry = require('../../miniprogram/prompt-registry');

    var prompts = {
      continue: '请根据以下内容继续写下去，保持风格一致，只输出续写部分：',
      summarize: '请用一段话总结以下内容的核心要点：',
      rewrite: '请重新改写以下内容，使其更清晰、更有条理：',
      extract: '请从以下内容中提取待办任务，每行一个，用 - [ ] 开头：',
      expand: '请扩充以下内容，增加更多细节和例子：',
      shorten: '请精简以下内容，保留核心信息，删除冗余部分：'
    };

    var systemPrompt = prompts[task] || prompts.summarize;
    var userMsg = content.substring(0, 2000);

    gateway.ask(userMsg, systemPrompt).then(function(res) {
      var result = res.content || '';
      if (task === 'continue') {
        self.setData({ content: content + '

' + result, aiProcessing: false });
      } else if (task === 'extract') {
        self.setData({ content: content + '

## 提取的任务
' + result, aiProcessing: false });
      } else {
        wx.showModal({
          title: 'AI 结果',
          content: result.substring(0, 500),
          confirmText: '应用',
          cancelText: '取消',
          success: function(modalRes) {
            if (modalRes.confirm) {
              self.setData({ content: result, aiProcessing: false });
            } else {
              self.setData({ aiProcessing: false });
            }
          }
        });
      }
      wx.showToast({ title: 'AI 完成', icon: 'success' });
    }).catch(function(err) {
      self.setData({ aiProcessing: false });
      wx.showToast({ title: 'AI 失败', icon: 'none' });
    });
  },

});
      this.setData({ noteId: note.id, isNew: false 

  toggleAiMenu: function() {
    this.setData({ showAiMenu: !this.data.showAiMenu });
  },

  onAiContinue: function() {
    this.runAiTask('continue');
  },

  onAiSummarize: function() {
    this.runAiTask('summarize');
  },

  onAiRewrite: function() {
    this.runAiTask('rewrite');
  },

  onAiExtractTasks: function() {
    this.runAiTask('extract');
  },

  onAiExpand: function() {
    this.runAiTask('expand');
  },

  onAiShorten: function() {
    this.runAiTask('shorten');
  },

  runAiTask: function(task) {
    var self = this;
    var content = self.data.content;
    if (!content || content.length < 10) {
      wx.showToast({ title: '内容太短', icon: 'none' });
      return;
    }
    self.setData({ aiProcessing: true, showAiMenu: false });

    var gateway = require('../../miniprogram/ai-gateway');
    var promptRegistry = require('../../miniprogram/prompt-registry');

    var prompts = {
      continue: '请根据以下内容继续写下去，保持风格一致，只输出续写部分：',
      summarize: '请用一段话总结以下内容的核心要点：',
      rewrite: '请重新改写以下内容，使其更清晰、更有条理：',
      extract: '请从以下内容中提取待办任务，每行一个，用 - [ ] 开头：',
      expand: '请扩充以下内容，增加更多细节和例子：',
      shorten: '请精简以下内容，保留核心信息，删除冗余部分：'
    };

    var systemPrompt = prompts[task] || prompts.summarize;
    var userMsg = content.substring(0, 2000);

    gateway.ask(userMsg, systemPrompt).then(function(res) {
      var result = res.content || '';
      if (task === 'continue') {
        self.setData({ content: content + '

' + result, aiProcessing: false });
      } else if (task === 'extract') {
        self.setData({ content: content + '

## 提取的任务
' + result, aiProcessing: false });
      } else {
        wx.showModal({
          title: 'AI 结果',
          content: result.substring(0, 500),
          confirmText: '应用',
          cancelText: '取消',
          success: function(modalRes) {
            if (modalRes.confirm) {
              self.setData({ content: result, aiProcessing: false });
            } else {
              self.setData({ aiProcessing: false });
            }
          }
        });
      }
      wx.showToast({ title: 'AI 完成', icon: 'success' });
    }).catch(function(err) {
      self.setData({ aiProcessing: false });
      wx.showToast({ title: 'AI 失败', icon: 'none' });
    });
  },

});
      wx.showToast({ title: '已创建', icon: 'success' 

  toggleAiMenu: function() {
    this.setData({ showAiMenu: !this.data.showAiMenu });
  },

  onAiContinue: function() {
    this.runAiTask('continue');
  },

  onAiSummarize: function() {
    this.runAiTask('summarize');
  },

  onAiRewrite: function() {
    this.runAiTask('rewrite');
  },

  onAiExtractTasks: function() {
    this.runAiTask('extract');
  },

  onAiExpand: function() {
    this.runAiTask('expand');
  },

  onAiShorten: function() {
    this.runAiTask('shorten');
  },

  runAiTask: function(task) {
    var self = this;
    var content = self.data.content;
    if (!content || content.length < 10) {
      wx.showToast({ title: '内容太短', icon: 'none' });
      return;
    }
    self.setData({ aiProcessing: true, showAiMenu: false });

    var gateway = require('../../miniprogram/ai-gateway');
    var promptRegistry = require('../../miniprogram/prompt-registry');

    var prompts = {
      continue: '请根据以下内容继续写下去，保持风格一致，只输出续写部分：',
      summarize: '请用一段话总结以下内容的核心要点：',
      rewrite: '请重新改写以下内容，使其更清晰、更有条理：',
      extract: '请从以下内容中提取待办任务，每行一个，用 - [ ] 开头：',
      expand: '请扩充以下内容，增加更多细节和例子：',
      shorten: '请精简以下内容，保留核心信息，删除冗余部分：'
    };

    var systemPrompt = prompts[task] || prompts.summarize;
    var userMsg = content.substring(0, 2000);

    gateway.ask(userMsg, systemPrompt).then(function(res) {
      var result = res.content || '';
      if (task === 'continue') {
        self.setData({ content: content + '

' + result, aiProcessing: false });
      } else if (task === 'extract') {
        self.setData({ content: content + '

## 提取的任务
' + result, aiProcessing: false });
      } else {
        wx.showModal({
          title: 'AI 结果',
          content: result.substring(0, 500),
          confirmText: '应用',
          cancelText: '取消',
          success: function(modalRes) {
            if (modalRes.confirm) {
              self.setData({ content: result, aiProcessing: false });
            } else {
              self.setData({ aiProcessing: false });
            }
          }
        });
      }
      wx.showToast({ title: 'AI 完成', icon: 'success' });
    }).catch(function(err) {
      self.setData({ aiProcessing: false });
      wx.showToast({ title: 'AI 失败', icon: 'none' });
    });
  },

});
      this.syncToGraph(note.id, title.trim(), content);
    } else {
      noteModule.updateNote(noteId, {
        title: title.trim(),
        content: content,
        summary: noteModule.generateSummary(content)
      

  toggleAiMenu: function() {
    this.setData({ showAiMenu: !this.data.showAiMenu });
  },

  onAiContinue: function() {
    this.runAiTask('continue');
  },

  onAiSummarize: function() {
    this.runAiTask('summarize');
  },

  onAiRewrite: function() {
    this.runAiTask('rewrite');
  },

  onAiExtractTasks: function() {
    this.runAiTask('extract');
  },

  onAiExpand: function() {
    this.runAiTask('expand');
  },

  onAiShorten: function() {
    this.runAiTask('shorten');
  },

  runAiTask: function(task) {
    var self = this;
    var content = self.data.content;
    if (!content || content.length < 10) {
      wx.showToast({ title: '内容太短', icon: 'none' });
      return;
    }
    self.setData({ aiProcessing: true, showAiMenu: false });

    var gateway = require('../../miniprogram/ai-gateway');
    var promptRegistry = require('../../miniprogram/prompt-registry');

    var prompts = {
      continue: '请根据以下内容继续写下去，保持风格一致，只输出续写部分：',
      summarize: '请用一段话总结以下内容的核心要点：',
      rewrite: '请重新改写以下内容，使其更清晰、更有条理：',
      extract: '请从以下内容中提取待办任务，每行一个，用 - [ ] 开头：',
      expand: '请扩充以下内容，增加更多细节和例子：',
      shorten: '请精简以下内容，保留核心信息，删除冗余部分：'
    };

    var systemPrompt = prompts[task] || prompts.summarize;
    var userMsg = content.substring(0, 2000);

    gateway.ask(userMsg, systemPrompt).then(function(res) {
      var result = res.content || '';
      if (task === 'continue') {
        self.setData({ content: content + '

' + result, aiProcessing: false });
      } else if (task === 'extract') {
        self.setData({ content: content + '

## 提取的任务
' + result, aiProcessing: false });
      } else {
        wx.showModal({
          title: 'AI 结果',
          content: result.substring(0, 500),
          confirmText: '应用',
          cancelText: '取消',
          success: function(modalRes) {
            if (modalRes.confirm) {
              self.setData({ content: result, aiProcessing: false });
            } else {
              self.setData({ aiProcessing: false });
            }
          }
        });
      }
      wx.showToast({ title: 'AI 完成', icon: 'success' });
    }).catch(function(err) {
      self.setData({ aiProcessing: false });
      wx.showToast({ title: 'AI 失败', icon: 'none' });
    });
  },

});
      this.syncToGraph(noteId, title.trim(), content);
      wx.showToast({ title: '已保存', icon: 'success' 

  toggleAiMenu: function() {
    this.setData({ showAiMenu: !this.data.showAiMenu });
  },

  onAiContinue: function() {
    this.runAiTask('continue');
  },

  onAiSummarize: function() {
    this.runAiTask('summarize');
  },

  onAiRewrite: function() {
    this.runAiTask('rewrite');
  },

  onAiExtractTasks: function() {
    this.runAiTask('extract');
  },

  onAiExpand: function() {
    this.runAiTask('expand');
  },

  onAiShorten: function() {
    this.runAiTask('shorten');
  },

  runAiTask: function(task) {
    var self = this;
    var content = self.data.content;
    if (!content || content.length < 10) {
      wx.showToast({ title: '内容太短', icon: 'none' });
      return;
    }
    self.setData({ aiProcessing: true, showAiMenu: false });

    var gateway = require('../../miniprogram/ai-gateway');
    var promptRegistry = require('../../miniprogram/prompt-registry');

    var prompts = {
      continue: '请根据以下内容继续写下去，保持风格一致，只输出续写部分：',
      summarize: '请用一段话总结以下内容的核心要点：',
      rewrite: '请重新改写以下内容，使其更清晰、更有条理：',
      extract: '请从以下内容中提取待办任务，每行一个，用 - [ ] 开头：',
      expand: '请扩充以下内容，增加更多细节和例子：',
      shorten: '请精简以下内容，保留核心信息，删除冗余部分：'
    };

    var systemPrompt = prompts[task] || prompts.summarize;
    var userMsg = content.substring(0, 2000);

    gateway.ask(userMsg, systemPrompt).then(function(res) {
      var result = res.content || '';
      if (task === 'continue') {
        self.setData({ content: content + '

' + result, aiProcessing: false });
      } else if (task === 'extract') {
        self.setData({ content: content + '

## 提取的任务
' + result, aiProcessing: false });
      } else {
        wx.showModal({
          title: 'AI 结果',
          content: result.substring(0, 500),
          confirmText: '应用',
          cancelText: '取消',
          success: function(modalRes) {
            if (modalRes.confirm) {
              self.setData({ content: result, aiProcessing: false });
            } else {
              self.setData({ aiProcessing: false });
            }
          }
        });
      }
      wx.showToast({ title: 'AI 完成', icon: 'success' });
    }).catch(function(err) {
      self.setData({ aiProcessing: false });
      wx.showToast({ title: 'AI 失败', icon: 'none' });
    });
  },

});
    }
    var self = this;
    setTimeout(function() { wx.navigateBack(); }, 1000);
  }


  toggleAiMenu: function() {
    this.setData({ showAiMenu: !this.data.showAiMenu });
  },

  onAiContinue: function() {
    this.runAiTask('continue');
  },

  onAiSummarize: function() {
    this.runAiTask('summarize');
  },

  onAiRewrite: function() {
    this.runAiTask('rewrite');
  },

  onAiExtractTasks: function() {
    this.runAiTask('extract');
  },

  onAiExpand: function() {
    this.runAiTask('expand');
  },

  onAiShorten: function() {
    this.runAiTask('shorten');
  },

  runAiTask: function(task) {
    var self = this;
    var content = self.data.content;
    if (!content || content.length < 10) {
      wx.showToast({ title: '内容太短', icon: 'none' });
      return;
    }
    self.setData({ aiProcessing: true, showAiMenu: false });

    var gateway = require('../../miniprogram/ai-gateway');
    var promptRegistry = require('../../miniprogram/prompt-registry');

    var prompts = {
      continue: '请根据以下内容继续写下去，保持风格一致，只输出续写部分：',
      summarize: '请用一段话总结以下内容的核心要点：',
      rewrite: '请重新改写以下内容，使其更清晰、更有条理：',
      extract: '请从以下内容中提取待办任务，每行一个，用 - [ ] 开头：',
      expand: '请扩充以下内容，增加更多细节和例子：',
      shorten: '请精简以下内容，保留核心信息，删除冗余部分：'
    };

    var systemPrompt = prompts[task] || prompts.summarize;
    var userMsg = content.substring(0, 2000);

    gateway.ask(userMsg, systemPrompt).then(function(res) {
      var result = res.content || '';
      if (task === 'continue') {
        self.setData({ content: content + '

' + result, aiProcessing: false });
      } else if (task === 'extract') {
        self.setData({ content: content + '

## 提取的任务
' + result, aiProcessing: false });
      } else {
        wx.showModal({
          title: 'AI 结果',
          content: result.substring(0, 500),
          confirmText: '应用',
          cancelText: '取消',
          success: function(modalRes) {
            if (modalRes.confirm) {
              self.setData({ content: result, aiProcessing: false });
            } else {
              self.setData({ aiProcessing: false });
            }
          }
        });
      }
      wx.showToast({ title: 'AI 完成', icon: 'success' });
    }).catch(function(err) {
      self.setData({ aiProcessing: false });
      wx.showToast({ title: 'AI 失败', icon: 'none' });
    });
  },

});
