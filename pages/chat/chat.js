// pages/chat/chat.js
var conversationStore = require('../../core/conversation/store');
var gateway = require('../../miniprogram/ai-gateway');
var types = require('../../core/conversation/types');
var assetStore = require('../../core/assets/local-asset-store');
var format = require('../../utils/format');
var recorder = require('../../core/audio/recorder');

Page({
  data: {
    statusBarHeight: 20,
    conversationId: '',
    conversation: null,
    messages: [],
    groupedMessages: [],
    inputText: '',
    sending: false,
    showActions: false,
    selectedMessageId: '',
    selectedMsgRole: '',
    scrollTarget: '',
    streamingContent: '',
    isStreaming: false
  },

  onLoad: function(options) {
    var self = this;
    try {
      self.setData({ statusBarHeight: wx.getSystemInfoSync().statusBarHeight || 20 });
    } catch (e) {}

    if (options && options.id) {
      self.setData({ conversationId: options.id });
      self.loadConversation(options.id);
    } else {
      self.setData({ conversationId: '' });
    }

    if (options && options.send) {
      var msg = decodeURIComponent(options.send);
      setTimeout(function() {
        self.setData({ inputText: msg });
        self.onSend();
      }, 300);
    }
  },

  onShow: function() {
    if (this.data.conversationId) {
      this.loadConversation(this.data.conversationId);
    }
  },

  loadConversation: function(id) {
    var conv = conversationStore.getConversation(id);
    var msgs = conversationStore.getMessages(id, { limit: 100 });
    if (conv) {
      var grouped = this.groupByTime(msgs);
      this.setData({
        conversation: conv,
        messages: msgs,
        groupedMessages: grouped
      });
      wx.setNavigationBarTitle({ title: conv.title || '\u5bf9\u8bdd' });
    }
    this.scrollToBottom();
  },

  groupByTime: function(msgs) {
    var groups = [];
    var currentGroup = null;
    var TIME_GAP = 5 * 60 * 1000;

    for (var i = 0; i < msgs.length; i++) {
      var msg = msgs[i];
      var timeStr = this.formatTime(msg.createdAt);
      var showTime = !currentGroup || (msg.createdAt - currentGroup.lastTime > TIME_GAP);

      if (showTime) {
        currentGroup = {
          time: timeStr,
          lastTime: msg.createdAt,
          messages: []
        };
        groups.push(currentGroup);
      }
      currentGroup.messages.push(msg);
    }
    return groups;
  },

  formatTime: function(ts) {
    var d = new Date(ts);
    var now = new Date();
    var month = d.getMonth() + 1;
    var day = d.getDate();
    var hours = d.getHours();
    var mins = d.getMinutes();
    var timeStr = (hours < 10 ? '0' : '') + hours + ':' + (mins < 10 ? '0' : '') + mins;

    if (d.toDateString() === now.toDateString()) {
      return '\u4eca\u5929 ' + timeStr;
    }
    var yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    if (d.toDateString() === yesterday.toDateString()) {
      return '\u6628\u5929 ' + timeStr;
    }
    return month + '\u6708' + day + '\u65e5 ' + timeStr;
  },

  onInput: function(e) {
    this.setData({ inputText: e.detail.value });
  },

  onSend: function() {
    var self = this;
    var text = self.data.inputText.trim();
    if (!text || self.data.sending) return;

    self.setData({ sending: true, inputText: '' });

    var convId = self.data.conversationId;
    if (!convId) {
      var conv = conversationStore.createConversation({
        title: text.substring(0, 30),
        model: 'MiMo'
      });
      convId = conv.id;
      self.setData({ conversationId: convId, conversation: conv });
    }

    conversationStore.addMessage({
      conversationId: convId,
      role: 'user',
      content: text,
      type: 'text'
    });

    var msgs = conversationStore.getMessages(convId);
    self.setData({ messages: msgs, groupedMessages: self.groupByTime(msgs) });
    self.scrollToBottom();

    // Check for pending attachment
    var attachment = self.data.pendingAttachment;
    if (attachment && attachment.type === 'image') {
      gateway.analyzeImage(attachment.filePath, text).then(function(result) {
        conversationStore.addMessage({ conversationId: convId, role: 'assistant', content: result.content, type: 'text', model: result.model || 'MiMo' });
        self.setData({ pendingAttachment: null });
        var updatedMsgs = conversationStore.getMessages(convId);
        self.setData({ messages: updatedMsgs, groupedMessages: self.groupByTime(updatedMsgs), sending: false });
        self.scrollToBottom();
      }).catch(function(err) {
        conversationStore.addMessage({ conversationId: convId, role: 'assistant', content: 'Image analysis failed: ' + err.message, type: 'text', isError: true });
        self.setData({ pendingAttachment: null, sending: false });
        var updatedMsgs = conversationStore.getMessages(convId);
        self.setData({ messages: updatedMsgs, groupedMessages: self.groupByTime(updatedMsgs) });
      });
      return;
    }

    gateway.ask(text).then(function(result) {
      conversationStore.addMessage({
        conversationId: convId,
        role: 'assistant',
        content: result.content,
        type: 'text',
        model: result.model || 'MiMo'
      });

      var conv = conversationStore.getConversation(convId);
      if (conv && conv.messageCount <= 2) {
        conversationStore.updateConversation(convId, {
          model: result.model || 'MiMo'
        });
        self.generateTitle(convId, text, result.content);
      }

      self.startTypingEffect(result.content, convId);
      
      setTimeout(function() {
        self.stopTypingEffect();
        var updatedMsgs = conversationStore.getMessages(convId);
        self.setData({
          messages: updatedMsgs,
          groupedMessages: self.groupByTime(updatedMsgs),
          sending: false
        });
        self.scrollToBottom();
      }, Math.min(result.content.length * 30, 3000));
    }).catch(function(err) {
      conversationStore.addMessage({
        conversationId: convId,
        role: 'assistant',
        content: '\u274c \u8fde\u63a5\u5931\u8d25: ' + err.message,
        type: 'text',
        isError: true
      });
      self.stopTypingEffect();
      var updatedMsgs = conversationStore.getMessages(convId);
      self.setData({
        messages: updatedMsgs,
        groupedMessages: self.groupByTime(updatedMsgs),
        sending: false
      });
      self.scrollToBottom();
    });
  },

  onRetry: function(e) {
    var msgId = e.currentTarget.dataset.id;
    var msgs = this.data.messages;
    for (var i = msgs.length - 1; i >= 0; i--) {
      if (msgs[i].id === msgId && msgs[i].role === 'user') {
        this.setData({ inputText: msgs[i].content });
        this.onSend();
        return;
      }
    }
  },

  scrollToBottom: function() {
    var self = this;
    if (self._scrollTimer) clearTimeout(self._scrollTimer);
    self._scrollTimer = setTimeout(function() {
      wx.pageScrollTo({ scrollTop: 99999, duration: 200 });
    }, 200);
  },

  onMessageLongPress: function(e) {
    var id = e.currentTarget.dataset.id;
    var role = e.currentTarget.dataset.role;
    this.setData({ showActions: true, selectedMessageId: id, selectedMsgRole: role });
  },

  hideActions: function() {
    this.setData({ showActions: false, selectedMessageId: '', selectedMsgRole: '' });
  },

  onCopyMessage: function() {
    var msgs = this.data.messages;
    var selectedId = this.data.selectedMessageId;
    for (var i = 0; i < msgs.length; i++) {
      if (msgs[i].id === selectedId) {
        wx.setClipboardData({ data: msgs[i].content });
        wx.showToast({ title: '\u5df2\u590d\u5236', icon: 'success' });
        break;
      }
    }
    this.hideActions();
  },

  onSaveAsNote: function() {
    var msgs = this.data.messages;
    var selectedId = this.data.selectedMessageId;
    for (var i = 0; i < msgs.length; i++) {
      if (msgs[i].id === selectedId) {
        var noteModule = require('../../modules/note/public');
        noteModule.createNote({
          title: msgs[i].content.substring(0, 30),
          content: msgs[i].content,
          tags: ['AI\u751f\u6210']
        });
        wx.showToast({ title: '\u5df2\u4fdd\u5b58\u4e3a\u7b14\u8bb0', icon: 'success' });
        break;
      }
    }
    this.hideActions();
  },


  onExtractKnowledge: function() {
    var self = this;
    var msgs = self.data.messages;
    var selectedId = self.data.selectedMessageId;
    var msg = null;
    for (var i = 0; i < msgs.length; i++) {
      if (msgs[i].id === selectedId) { msg = msgs[i]; break; }
    }
    if (!msg) { self.hideActions(); return; }

    wx.showLoading({ title: '提取中...' });
    var gateway = require('../../miniprogram/ai-gateway');
    var prompt = '从以下内容提取 3-5 个知识点，每个用 JSON 返回：{"title":"标题","summary":"摘要","tags":["标签"]}。只输出 JSON 数组。\n\n内容: ' + msg.content.substring(0, 1000);
    
    gateway.ask(prompt, '你是知识提取器。').then(function(res) {
      wx.hideLoading();
      try {
        var points = JSON.parse(res.content);
        if (!Array.isArray(points)) points = [];
        
        var noteModule = require('../../modules/note/public');
        points.forEach(function(p) {
          noteModule.createNote({
            title: p.title || '知识点',
            content: p.summary || '',
            tags: p.tags || ['提取知识点']
          });
        });
        
        wx.showToast({ title: '已提取 ' + points.length + ' 个知识点', icon: 'success' });
      } catch (e) {
        wx.showToast({ title: '解析失败', icon: 'none' });
      }
    }).catch(function(err) {
      wx.hideLoading();
      wx.showToast({ title: '提取失败: ' + err.message, icon: 'none' });
    });
    self.hideActions();
  },

  onIngestToGraph: function() {
    var self = this;
    var msgs = self.data.messages;
    var selectedId = self.data.selectedMessageId;
    var msg = null;
    for (var i = 0; i < msgs.length; i++) {
      if (msgs[i].id === selectedId) { msg = msgs[i]; break; }
    }
    if (!msg) { self.hideActions(); return; }

    var convId = self.data.conversationId;
    wx.navigateTo({
      url: '/pages/graph-ingest/graph-ingest?id=' + convId + '&msgId=' + selectedId
    });
    self.hideActions();
  },

  onDeleteMessage: function() {
    var self = this;
    wx.showModal({
      title: '\u5220\u9664\u6d88\u606f',
      content: '\u786e\u5b9a\u5220\u9664\u8be5\u6d88\u606f\uff1f',
      success: function(res) {
        if (res.confirm) {
          var msgs = self.data.messages.filter(function(m) {
            return m.id !== self.data.selectedMessageId;
          });
          self.setData({
            messages: msgs,
            groupedMessages: self.groupByTime(msgs)
          });
          wx.showToast({ title: '\u5df2\u5220\u9664', icon: 'success' });
        }
      }
    });
    this.hideActions();
  },


  startTypingEffect: function(fullText, convId) {
    var self = this;
    var index = 0;
    var chars = fullText.split('');
    var chunkSize = 2;
    var interval = 30;

    self.setData({ isStreaming: true, streamingContent: '' });

    function typeNext() {
      if (index >= chars.length) {
        self.setData({ isStreaming: false, streamingContent: '' });
        return;
      }
      var end = Math.min(index + chunkSize, chars.length);
      var partial = chars.slice(0, end).join('');
      self.setData({ streamingContent: partial });
      index = end;
      self.scrollToBottom();

      if (index < chars.length) {
        self._typingTimer = setTimeout(typeNext, interval);
      } else {
        self.setData({ isStreaming: false, streamingContent: '' });
      }
    }

    typeNext();
  },

  stopTypingEffect: function() {
    if (this._typingTimer) {
      clearTimeout(this._typingTimer);
      this._typingTimer = null;
    }
    this.setData({ isStreaming: false, streamingContent: '' });
  },



  generateTitle: function(convId, userMsg, aiReply) {
    var self = this;
    var prompt = '用一个简短的中文短语（5-15字）概括以下对话的主题，只输出短语，不要其他内容。\n用户: ' + userMsg.substring(0, 200) + '\nAI: ' + aiReply.substring(0, 200);
    
    gateway.ask(prompt, '你是一个标题生成器，只输出短标题。').then(function(res) {
      var title = res.content.replace(/["\'\n]/g, '').trim();
      if (title.length > 20) title = title.substring(0, 20);
      if (title.length > 0) {
        conversationStore.updateConversation(convId, { title: title });
        wx.setNavigationBarTitle({ title: title });
      }
    }).catch(function() {
      // Fallback: use first 15 chars of user message
      var fallback = userMsg.substring(0, 15);
      conversationStore.updateConversation(convId, { title: fallback });
      wx.setNavigationBarTitle({ title: fallback });
    });
  },

  onChooseImage: function() {
    var self = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function(res) {
        var filePath = res.tempFilePaths[0];
        self.setData({ pendingAttachment: { type: 'image', filePath: filePath } });
        wx.showToast({ title: '图片已选择', icon: 'success' });
      }
    });
  },

  onStartRecord: function() {
    var self = this;
    recorder.onStop(function(res) {
      var tempFilePath = res.tempFilePath;
      self.setData({
        pendingAttachment: { type: 'voice', filePath: tempFilePath },
        recording: false
      });
      wx.showToast({ title: '录音完成', icon: 'success' });
    });
    recorder.onError(function(err) {
      self.setData({ recording: false });
      wx.showToast({ title: '录音失败', icon: 'none' });
    });
    recorder.start({ duration: 60000 });
    self.setData({ recording: true });
    wx.showToast({ title: '正在录音...', icon: 'none', duration: 60000 });
  },

  onStopRecord: function() {
    recorder.stop();
  },

  onBack: function() {
    wx.navigateBack();
  },

  onMore: function() {
    var self = this;
    wx.showActionSheet({
      itemList: ['\u6e05\u7a7a\u5bf9\u8bdd', '\u590d\u5236\u5168\u90e8', '\u8f6c\u77e5\u8bc6\u56fe\u8c31'],
      success: function(res) {
        if (res.tapIndex === 0) {
          wx.showModal({
            title: '\u6e05\u7a7a\u5bf9\u8bdd',
            content: '\u786e\u5b9a\u6e05\u7a7a\u6240\u6709\u6d88\u606f\uff1f',
            success: function(r) {
              if (r.confirm) {
                self.setData({ messages: [], groupedMessages: [] });
                wx.showToast({ title: '\u5df2\u6e05\u7a7a', icon: 'success' });
              }
            }
          });
        } else if (res.tapIndex === 1) {
          var all = self.data.messages.map(function(m) {
            return (m.role === 'user' ? '\u6211: ' : 'AI: ') + m.content;
          }).join('\n\n');
          wx.setClipboardData({ data: all });
          wx.showToast({ title: '\u5df2\u590d\u5236', icon: 'success' });
        } else if (res.tapIndex === 2) {
          wx.navigateTo({ url: '/pages/graph-ingest/graph-ingest?id=' + self.data.conversationId });
        }
      }
    });
  }
});
