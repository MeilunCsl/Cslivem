// pages/chat/chat.js
var conversationStore = require('../../core/conversation/store');
var gateway = require('../../miniprogram/ai-gateway');
var types = require('../../core/conversation/types');

Page({
  data: {
    statusBarHeight: 20,
    conversationId: '',
    conversation: null,
    messages: [],
    inputText: '',
    sending: false,
    showActions: false,
    selectedMessageId: ''
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
      // New conversation - wait for first message
      self.setData({ conversationId: '' });
    }

    // Handle auto-send from home page
    if (options && options.send) {
      var msg = decodeURIComponent(options.send);
      setTimeout(function() {
        self.setData({ inputText: msg });
        self.onSend();
      }, 300);
    }
  },

  loadConversation: function(id) {
    var conv = conversationStore.getConversation(id);
    var msgs = conversationStore.getMessages(id);
    if (conv) {
      this.setData({
        conversation: conv,
        messages: msgs
      });
      wx.setNavigationBarTitle({ title: conv.title || '对话' });
    }
    // Scroll to bottom
    this.scrollToBottom();
  },

  onInput: function(e) {
    this.setData({ inputText: e.detail.value });
  },

  onSend: function() {
    var self = this;
    var text = self.data.inputText.trim();
    if (!text || self.data.sending) return;

    self.setData({ sending: true, inputText: '' });

    // Create conversation if needed
    var convId = self.data.conversationId;
    if (!convId) {
      var conv = conversationStore.createConversation({
        title: text.substring(0, 30),
        model: 'MiMo'
      });
      convId = conv.id;
      self.setData({ conversationId: convId, conversation: conv });
    }

    // Save user message
    var userMsg = conversationStore.addMessage({
      conversationId: convId,
      role: 'user',
      content: text,
      type: 'text'
    });

    var msgs = conversationStore.getMessages(convId);
    self.setData({ messages: msgs });
    self.scrollToBottom();

    // Call AI
    gateway.ask(text).then(function(result) {
      // Save AI message
      conversationStore.addMessage({
        conversationId: convId,
        role: 'assistant',
        content: result.content,
        type: 'text',
        model: result.model || 'MiMo'
      });

      var updatedMsgs = conversationStore.getMessages(convId);
      self.setData({ messages: updatedMsgs, sending: false });

      // Update conversation title if first reply
      var conv = conversationStore.getConversation(convId);
      if (conv && conv.messageCount <= 2) {
        conversationStore.updateConversation(convId, {
          title: text.substring(0, 30),
          model: result.model || 'MiMo'
        });
      }

      self.scrollToBottom();
    }).catch(function(err) {
      // Save error as AI message
      conversationStore.addMessage({
        conversationId: convId,
        role: 'assistant',
        content: '(Error) ' + err.message,
        type: 'text'
      });
      var updatedMsgs = conversationStore.getMessages(convId);
      self.setData({ messages: updatedMsgs, sending: false });
      self.scrollToBottom();
    });
  },

  scrollToBottom: function() {
    var self = this;
    setTimeout(function() {
      wx.pageScrollTo({ scrollTop: 99999, duration: 200 });
    }, 100);
  },

  onMessageLongPress: function(e) {
    var id = e.currentTarget.dataset.id;
    this.setData({ showActions: true, selectedMessageId: id });
  },

  hideActions: function() {
    this.setData({ showActions: false, selectedMessageId: '' });
  },

  onSaveAsNote: function() {
    var msgs = this.data.messages;
    var selectedId = this.data.selectedMessageId;
    for (var i = 0; i < msgs.length; i++) {
      if (msgs[i].id === selectedId && msgs[i].role === 'assistant') {
        var noteModule = require('../../modules/note/public');
        noteModule.createNote({
          title: 'AI: ' + msgs[i].content.substring(0, 30),
          content: msgs[i].content,
          tags: ['AI生成']
        });
        wx.showToast({ title: '已保存为笔记', icon: 'success' });
        break;
      }
    }
    this.hideActions();
  },

  onCopyMessage: function() {
    var msgs = this.data.messages;
    var selectedId = this.data.selectedMessageId;
    for (var i = 0; i < msgs.length; i++) {
      if (msgs[i].id === selectedId) {
        wx.setClipboardData({ data: msgs[i].content });
        break;
      }
    }
    this.hideActions();
  },

  onDeleteMessage: function() {
    var self = this;
    wx.showModal({
      title: '删除消息',
      content: '确定删除该消息？',
      success: function(res) {
        if (res.confirm) {
          // Remove from messages list
          var msgs = self.data.messages.filter(function(m) {
            return m.id !== self.data.selectedMessageId;
          });
          self.setData({ messages: msgs });
          wx.showToast({ title: '已删除', icon: 'success' });
        }
      }
    });
    this.hideActions();
  },

  onBack: function() {
    wx.navigateBack();
  },

  onMore: function() {
    wx.showActionSheet({
      itemList: ['清空对话', '复制全部'],
      success: function(res) {
        if (res.tapIndex === 0) {
          // Clear conversation
        } else if (res.tapIndex === 1) {
          // Copy all
        }
      }
    });
  }
});
