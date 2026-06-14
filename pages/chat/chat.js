// pages/chat/chat.js
var conversationStore = require('../../core/conversation/store');
var gateway = require('../../miniprogram/ai-gateway');
var types = require('../../core/conversation/types');
var assetStore = require('../../core/assets/local-asset-store');
var format = require('../../utils/format');

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
    scrollTarget: ''
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
    var msgs = conversationStore.getMessages(id);
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

      var updatedMsgs = conversationStore.getMessages(convId);
      self.setData({
        messages: updatedMsgs,
        groupedMessages: self.groupByTime(updatedMsgs),
        sending: false
      });

      var conv = conversationStore.getConversation(convId);
      if (conv && conv.messageCount <= 2) {
        conversationStore.updateConversation(convId, {
          title: text.substring(0, 30),
          model: result.model || 'MiMo'
        });
      }
      self.scrollToBottom();
    }).catch(function(err) {
      conversationStore.addMessage({
        conversationId: convId,
        role: 'assistant',
        content: '\u274c \u8fde\u63a5\u5931\u8d25: ' + err.message,
        type: 'text',
        isError: true
      });
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
    setTimeout(function() {
      wx.pageScrollTo({ scrollTop: 99999, duration: 200 });
    }, 150);
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
          wx.showToast({ title: '\u56fe\u8c31\u529f\u80fd\u5f00\u53d1\u4e2d', icon: 'none' });
        }
      }
    });
  }
});
