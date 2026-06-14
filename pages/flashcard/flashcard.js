var fcModule = require('../../modules/flashcard/public');

Page({
  data: {
    view: 'decks',
    decks: [],
    currentDeck: null,
    cards: [],
    dueCards: [],
    currentCard: null,
    cardIndex: 0,
    showAnswer: false,
    stats: {},
    showCreateDeck: false,
    showCreateCard: false,
    newDeckName: '',
    newCardFront: '',
    newCardBack: '',
    ready: false
  },

  onLoad: function() {
    var self = this;
    setTimeout(function() { self.setData({ ready: true }); }, 100);
  },

  onShow: function() {
    this.loadDecks();
    this.setData({ stats: fcModule.getStats() });
  },

  loadDecks: function() {
    this.setData({ decks: fcModule.getDecks() });
  },

  onDeckTap: function(e) {
    var id = e.currentTarget.dataset.id;
    var decks = this.data.decks;
    var deck = null;
    for (var i = 0; i < decks.length; i++) {
      if (decks[i].id === id) { deck = decks[i]; break; }
    }
    if (!deck) return;
    var dueCards = fcModule.getDueCards(id);
    this.setData({
      view: 'deck-detail',
      currentDeck: deck,
      dueCards: dueCards,
      cardIndex: 0,
      showAnswer: false,
      currentCard: dueCards.length > 0 ? dueCards[0] : null
    });
  },

  onStartReview: function() {
    if (this.data.dueCards.length === 0) {
      wx.showToast({ title: '没有待复习的卡片', icon: 'none' });
      return;
    }
    this.setData({
      view: 'review',
      cardIndex: 0,
      showAnswer: false,
      currentCard: this.data.dueCards[0]
    });
  },

  onFlipCard: function() {
    this.setData({ showAnswer: !this.data.showAnswer });
  },

  onRateCard: function(e) {
    var quality = parseInt(e.currentTarget.dataset.quality);
    var card = this.data.currentCard;
    if (!card) return;
    fcModule.reviewCard(card.id, quality);

    var nextIndex = this.data.cardIndex + 1;
    if (nextIndex >= this.data.dueCards.length) {
      wx.showToast({ title: '复习完成！', icon: 'success' });
      this.setData({ view: 'deck-detail', stats: fcModule.getStats() });
      return;
    }
    this.setData({
      cardIndex: nextIndex,
      currentCard: this.data.dueCards[nextIndex],
      showAnswer: false
    });
  },

  toggleCreateDeck: function() {
    this.setData({ showCreateDeck: !this.data.showCreateDeck, newDeckName: '' });
  },

  onDeckNameInput: function(e) { this.setData({ newDeckName: e.detail.value }); },

  onCreateDeck: function() {
    if (!this.data.newDeckName.trim()) return;
    fcModule.createDeck({ name: this.data.newDeckName.trim() });
    this.setData({ showCreateDeck: false, newDeckName: '' });
    this.loadDecks();
    wx.showToast({ title: '卡组已创建', icon: 'success' });
  },

  toggleCreateCard: function() {
    this.setData({ showCreateCard: !this.data.showCreateCard, newCardFront: '', newCardBack: '' });
  },

  onCardFrontInput: function(e) { this.setData({ newCardFront: e.detail.value }); },
  onCardBackInput: function(e) { this.setData({ newCardBack: e.detail.value }); },

  onCreateCard: function() {
    if (!this.data.newCardFront.trim() || !this.data.newCardBack.trim()) {
      wx.showToast({ title: '请填写正反面', icon: 'none' });
      return;
    }
    fcModule.addCard({
      deckId: this.data.currentDeck.id,
      front: this.data.newCardFront.trim(),
      back: this.data.newCardBack.trim()
    });
    this.setData({ showCreateCard: false, newCardFront: '', newCardBack: '' });
    var dueCards = fcModule.getDueCards(this.data.currentDeck.id);
    this.setData({ dueCards: dueCards, stats: fcModule.getStats() });
    wx.showToast({ title: '卡片已添加', icon: 'success' });
  },

  onDeleteDeck: function(e) {
    var id = e.currentTarget.dataset.id;
    var self = this;
    wx.showModal({
      title: '删除卡组',
      content: '确定删除这个卡组及其所有卡片吗？',
      success: function(res) {
        if (res.confirm) {
          fcModule.deleteDeck(id);
          self.loadDecks();
        }
      }
    });
  },

  onBackToDecks: function() {
    this.setData({ view: 'decks', currentDeck: null });
    this.loadDecks();
  },

  onBack: function() {
    if (this.data.view === 'review') {
      this.setData({ view: 'deck-detail' });
    } else if (this.data.view === 'deck-detail') {
      this.onBackToDecks();
    } else {
      wx.navigateBack();
    }
  }
});
