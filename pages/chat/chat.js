// pages/chat/chat.js
var conversationStore = require('../../core/conversation/store');
var gateway = require('../../miniprogram/ai-gateway');
var types = require('../../core/conversation/types');
var assetStore = require('../../core/assets/local-asset-store');
var format = require('../../utils/format');
var recorder = require('../../core/audio/recorder');
var promptRegistry = require('../../miniprogram/prompt-registry');

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
    isStreaming: false,
    messagePageSize: 50,
    messagePage: 1,
    hasMoreMessages: true,
    loadingOlder: false
  },

  onLoad: function (options) {
    var self = this;
    try {
      self.setData({ statusBarHeight: wx.getSystemInfoSync().statusBarHeight || 20 });
    } catch (e) {}

    if (options && options.id) {
      self.setData({ conversationId: options.id });
      self.loadConversation(options.id);
    } else {
      var conv = conversationStore.createConversation({ title: '' });
      self.setData({ conversationId: conv.id, conversation: conv });
    }

    if (options && options.send) {
      setTimeout(function () {
        self.setData({ inputText: options.send });
        self.onSend();
      }, 300);
    }
  },

  onShow: function () {
    if (this.data.conversationId) {
      this.loadConversation(this.data.conversationId);
    }
  },

  loadConversation: function (id) {
    var self = this;
    var conv = conversationStore.getConversation(id);
    if (!conv) return;
    var msgs = conversationStore.getMessages(id, { limit: self.data.messagePageSize });
    self.setData({
      conversation: conv,
      messages: msgs,
      groupedMessages: self.groupByTime(msgs)
    });
    self.scrollToBottom();
  },

  onSend: function () {
    var self = this;
    var content = self.data.inputText;
    if (!content || !content.trim() || self.data.sending) return;

    var convId = self.data.conversationId;
    if (!convId) {
      var conv = conversationStore.createConversation({ title: '' });
      convId = conv.id;
      self.setData({ conversationId: convId, conversation: conv });
    }

    var userMsg = conversationStore.addMessage(types.createMessage({
      conversationId: convId,
      role: 'user',
      content: content.trim()
    }));

    var updatedMsgs = self.data.messages.concat([userMsg]);
    self.setData({
      messages: updatedMsgs,
      groupedMessages: self.groupByTime(updatedMsgs),
      inputText: '',
      sending: true
    });

    // Generate title from first user message
    if (!self.data.conversation || !self.data.conversation.title) {
      self.generateTitle(content.trim());
    }

    gateway.ask(content.trim(), '你是一个知识助手，帮助用户整理和管理知识。')
      .then(function (res) {
        var reply = res.content || '';
        self.startTypingEffect(convId, reply);
      })
      .catch(function (err) {
        console.error('[chat] AI error:', err);
        var errMsg = conversationStore.addMessage(types.createMessage({
          conversationId: convId,
          role: 'assistant',
          content: '抱歉，AI 暂时无法回复，请稍后重试。'
        }));
        var finalMsgs = self.data.messages.concat([errMsg]);
        self.setData({
          messages: finalMsgs,
          groupedMessages: self.groupByTime(finalMsgs),
          sending: false
        });
        self.scrollToBottom();
      });
  },

  onInput: function (e) {
    this.setData({ inputText: e.detail.value });
  },

  scrollToBottom: function () {
    var msgs = this.data.messages;
    if (msgs.length === 0) return;
    var last = msgs[msgs.length - 1];
    this.setData({ scrollTarget: 'msg-' + last.id });
  },

  // ===== Time grouping =====

  groupByTime: function (messages) {
    if (!messages || messages.length === 0) return [];

    var groups = [];
    var currentLabel = '';
    var currentItems = [];

    for (var i = 0; i < messages.length; i++) {
      var msg = messages[i];
      var label = this.getTimeLabel(msg.createdAt);
      if (label !== currentLabel) {
        if (currentItems.length > 0) {
          groups.push({ label: currentLabel, messages: currentItems });
        }
        currentLabel = label;
        currentItems = [msg];
      } else {
        currentItems.push(msg);
      }
    }
    if (currentItems.length > 0) {
      groups.push({ label: currentLabel, messages: currentItems });
    }
    return groups;
  },

  getTimeLabel: function (timestamp) {
    if (!timestamp) return '未知时间';
    var date = new Date(timestamp);
    var now = new Date();
    var isToday = date.toDateString() === now.toDateString();
    var yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    var isYesterday = date.toDateString() === yesterday.toDateString();

    if (isToday) return '今天';
    if (isYesterday) return '昨天';
    return date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate();
  },

  formatTime: function (timestamp) {
    if (!timestamp) return '';
    var d = new Date(timestamp);
    var h = d.getHours();
    var m = d.getMinutes();
    return (h < 10 ? '0' : '') + h + ':' + (m < 10 ? '0' : '') + m;
  },

  generateTitle: function (text) {
    var title = text.length > 20 ? text.substring(0, 20) + '...' : text;
    conversationStore.updateConversation(this.data.conversationId, { title: title });
  },

  // ===== Load older messages =====

  loadOlderMessages: function () {
    if (!this.data.hasMoreMessages || this.data.loadingOlder) return;
    var self = this;
    var convId = self.data.conversationId;
    if (!convId) return;

    self.setData({ loadingOlder: true });
    var allMsgs = conversationStore.getMessages(convId);
    var page = self.data.messagePage + 1;
    var pageSize = self.data.messagePageSize;
    var totalNeeded = page * pageSize;
    var start = Math.max(0, allMsgs.length - totalNeeded);
    var end = allMsgs.length - (page - 1) * pageSize;
    var olderMsgs = allMsgs.slice(start, end);

    if (olderMsgs.length < pageSize) {
      self.setData({ hasMoreMessages: false });
    }

    setTimeout(function () {
      var merged = olderMsgs.concat(self.data.messages);
      self.setData({
        messages: merged,
        groupedMessages: self.groupByTime(merged),
        messagePage: page,
        loadingOlder: false
      });
    }, 200);
  },

  onScrollToUpper: function () {
    this.loadOlderMessages();
  },

  // ===== Throttled setData =====

  _throttleTimer: null,

  throttledSetData: function (data) {
    var self = this;
    if (self._throttleTimer) clearTimeout(self._throttleTimer);
    self._throttleTimer = setTimeout(function () {
      self.setData(data);
    }, 50);
  },

  // ===== Message actions =====

  onMessageLongPress: function (e) {
    var dataset = e.currentTarget.dataset;
    this.setData({
      showActions: true,
      selectedMessageId: dataset.id,
      selectedMsgRole: dataset.role
    });
  },

  hideActions: function () {
    this.setData({ showActions: false, selectedMessageId: '', selectedMsgRole: '' });
  },

  onCopyMessage: function () {
    var self = this;
    var msg = self._findMessage(self.data.selectedMessageId);
    if (msg) {
      wx.setClipboardData({ data: msg.content });
    }
    self.hideActions();
  },

  onDeleteMessage: function () {
    var self = this;
    var msgId = self.data.selectedMessageId;
    if (!msgId) { self.hideActions(); return; }

    var remaining = self.data.messages.filter(function (m) { return m.id !== msgId; });
    self.setData({
      messages: remaining,
      groupedMessages: self.groupByTime(remaining)
    });
    self.hideActions();
  },

  onSaveAsNote: function () {
    var self = this;
    var msg = self._findMessage(self.data.selectedMessageId);
    self.hideActions();
    if (!msg) return;

    var noteService = require('../../core/notes/note-service');
    var note = noteService.createNote({
      title: msg.content.substring(0, 30),
      content: msg.content
    });
    wx.showToast({ title: '已保存为笔记', icon: 'success' });
  },

  onExtractKnowledge: function () {
    var self = this;
    var msg = self._findMessage(self.data.selectedMessageId);
    self.hideActions();
    if (!msg) return;

    wx.navigateTo({
      url: '/pages/graph-ingest/graph-ingest?content=' + encodeURIComponent(msg.content)
    });
  },

  onIngestToGraph: function () {
    var self = this;
    var msg = self._findMessage(self.data.selectedMessageId);
    self.hideActions();
    if (!msg) return;

    wx.navigateTo({
      url: '/pages/graph-ingest/graph-ingest?content=' + encodeURIComponent(msg.content)
    });
  },

  onRetry: function () {
    var self = this;
    var msgs = self.data.messages;
    if (msgs.length === 0) return;
    var lastUserMsg = null;
    for (var i = msgs.length - 1; i >= 0; i--) {
      if (msgs[i].role === 'user') { lastUserMsg = msgs[i]; break; }
    }
    if (lastUserMsg) {
      self.setData({ inputText: lastUserMsg.content });
      self.onSend();
    }
  },

  onChooseImage: function () {
    var self = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        var filePath = res.tempFilePaths[0];
        var convId = self.data.conversationId;
        // Save asset
        var asset = assetStore.add({ conversationId: convId, type: 'image', filePath: filePath });
        // Create user message with image indicator
        var store = require('../../core/conversation/store');
        var userMsg = store.addMessage({
          conversationId: convId,
          role: 'user',
          content: '[图片] ' + filePath,
          type: 'image'
        });
        var msgs = store.getMessages(convId);
        self.setData({
          messages: msgs,
          groupedMessages: self.groupByTime(msgs),
          sending: true
        });
        self.scrollToBottom();
        // Ask AI to analyze the image
        gateway.ask('用户发送了一张图片，请描述你看到的内容并提供分析。', '你是一个有用的AI助手。用户发送了一张图片。')
          .then(function (res) {
            store.addMessage({ conversationId: convId, role: 'assistant', content: res.content || '(无回复)', model: res.model });
            var updatedMsgs = store.getMessages(convId);
            self.setData({ messages: updatedMsgs, groupedMessages: self.groupByTime(updatedMsgs), sending: false });
            self.scrollToBottom();
          })
          .catch(function () {
            store.addMessage({ conversationId: convId, role: 'assistant', content: '图片分析失败，请稍后重试。', isError: true });
            var updatedMsgs = store.getMessages(convId);
            self.setData({ messages: updatedMsgs, groupedMessages: self.groupByTime(updatedMsgs), sending: false });
          });
      }
    });
  },

  onStartRecord: function () {
    var self = this;
    self.setData({ recording: true });
    recorder.onStop(function (res) {
      if (res && res.tempFilePath) {
        var convId = self.data.conversationId;
        assetStore.add({ conversationId: convId, type: 'voice', filePath: res.tempFilePath });
        var store = require('../../core/conversation/store');
        store.addMessage({ conversationId: convId, role: 'user', content: '[语音消息]', type: 'voice' });
        var msgs = store.getMessages(convId);
        self.setData({ messages: msgs, groupedMessages: self.groupByTime(msgs), recording: false });
        self.scrollToBottom();
      }
    });
    recorder.start();
    wx.showToast({ title: '录音中...', icon: 'none' });
  },

  onStopRecord: function () {
    recorder.stop();
  },

  onBack: function () {
    wx.navigateBack();
  },

  onMore: function () {
    wx.navigateTo({ url: '/pages/settings/settings' });
  },

  // ===== Typing effect =====

  _typingTimer: null,

  startTypingEffect: function (convId, fullContent) {
    var self = this;
    self.stopTypingEffect();
    self.setData({ isStreaming: true, streamingContent: '' });

    var index = 0;
    var chunkSize = 3;

    function tick() {
      if (index >= fullContent.length) {
        // Done — persist final message
        var aiMsg = conversationStore.addMessage(types.createMessage({
          conversationId: convId,
          role: 'assistant',
          content: fullContent
        }));
        var finalMsgs = self.data.messages.concat([aiMsg]);
        self.setData({
          messages: finalMsgs,
          groupedMessages: self.groupByTime(finalMsgs),
          isStreaming: false,
          streamingContent: '',
          sending: false
        });
        self.scrollToBottom();
        return;
      }

      var end = Math.min(index + chunkSize, fullContent.length);
      var current = fullContent.substring(0, end);
      self.throttledSetData({ streamingContent: current });
      index = end;

      var delay = Math.floor(Math.random() * 30) + 15;
      self._typingTimer = setTimeout(tick, delay);
    }

    tick();
  },

  stopTypingEffect: function () {
    if (this._typingTimer) {
      clearTimeout(this._typingTimer);
      this._typingTimer = null;
    }
  },

  // ===== Helpers =====

  _findMessage: function (id) {
    var msgs = this.data.messages;
    for (var i = 0; i < msgs.length; i++) {
      if (msgs[i].id === id) return msgs[i];
    }
    return null;
  }
});
