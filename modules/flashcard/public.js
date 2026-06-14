var manifest = require('./manifest');
var localStorage = require('../../core/storage/local-storage');

var DECKS_KEY = 'csl_flashcard_decks';
var CARDS_KEY = 'csl_flashcard_cards';
var REVIEWS_KEY = 'csl_flashcard_reviews';

function loadDecks() { return localStorage.getJSON(DECKS_KEY, []); }
function saveDecks(d) { localStorage.setJSON(DECKS_KEY, d); }
function loadCards() { return localStorage.getJSON(CARDS_KEY, []); }
function saveCards(c) { localStorage.setJSON(CARDS_KEY, c); }
function loadReviews() { return localStorage.getJSON(REVIEWS_KEY, []); }
function saveReviews(r) { localStorage.setJSON(REVIEWS_KEY, r); }

function createDeck(data) {
  var decks = loadDecks();
  var deck = {
    id: 'dk_' + Date.now(),
    name: data.name || '新卡组',
    description: data.description || '',
    createdAt: new Date().toISOString()
  };
  decks.push(deck);
  saveDecks(decks);
  return deck;
}

function deleteDeck(id) {
  saveDecks(loadDecks().filter(function(d) { return d.id !== id; }));
  saveCards(loadCards().filter(function(c) { return c.deckId !== id; }));
}

function getDecks() {
  var decks = loadDecks();
  var cards = loadCards();
  return decks.map(function(d) {
    var dc = cards.filter(function(c) { return c.deckId === d.id; });
    var due = dc.filter(function(c) { return !c.nextReview || c.nextReview <= Date.now(); });
    return Object.assign({}, d, { cardCount: dc.length, dueCount: due.length });
  });
}

function addCard(data) {
  var cards = loadCards();
  var card = {
    id: 'cd_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
    deckId: data.deckId,
    front: data.front || '',
    back: data.back || '',
    ease: 2.5,
    interval: 0,
    repetitions: 0,
    nextReview: Date.now(),
    createdAt: new Date().toISOString()
  };
  cards.push(card);
  saveCards(cards);
  return card;
}

function deleteCard(id) {
  saveCards(loadCards().filter(function(c) { return c.id !== id; }));
}

function getDueCards(deckId) {
  var cards = loadCards().filter(function(c) { return c.deckId === deckId; });
  return cards.filter(function(c) { return !c.nextReview || c.nextReview <= Date.now(); });
}

function reviewCard(cardId, quality) {
  // SM-2 algorithm (simplified)
  // quality: 0-5 (0=complete fail, 5=perfect)
  var cards = loadCards();
  for (var i = 0; i < cards.length; i++) {
    if (cards[i].id === cardId) {
      var card = cards[i];
      if (quality >= 3) {
        if (card.repetitions === 0) card.interval = 1;
        else if (card.repetitions === 1) card.interval = 6;
        else card.interval = Math.round(card.interval * card.ease);
        card.repetitions++;
      } else {
        card.repetitions = 0;
        card.interval = 1;
      }
      card.ease = Math.max(1.3, card.ease + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)));
      card.nextReview = Date.now() + card.interval * 24 * 60 * 60 * 1000;
      cards[i] = card;

      var reviews = loadReviews();
      reviews.push({ cardId: cardId, quality: quality, timestamp: Date.now() });
      if (reviews.length > 1000) reviews = reviews.slice(-500);
      saveReviews(reviews);
      saveCards(cards);
      return card;
    }
  }
  return null;
}

function getStats() {
  var cards = loadCards();
  var reviews = loadReviews();
  var today = new Date().toISOString().substring(0, 10);
  var todayReviews = reviews.filter(function(r) {
    return new Date(r.timestamp).toISOString().substring(0, 10) === today;
  });
  return {
    totalCards: cards.length,
    dueNow: cards.filter(function(c) { return !c.nextReview || c.nextReview <= Date.now(); }).length,
    todayReviews: todayReviews.length,
    totalReviews: reviews.length
  };
}

module.exports = {
  manifest: manifest,
  getDecks: getDecks,
  createDeck: createDeck,
  deleteDeck: deleteDeck,
  addCard: addCard,
  deleteCard: deleteCard,
  getDueCards: getDueCards,
  reviewCard: reviewCard,
  getStats: getStats
};
