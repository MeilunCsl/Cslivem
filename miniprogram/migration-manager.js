// miniprogram/migration-manager.js
// Data migration manager v2.2.0
// Handles storage schema upgrades between versions

var storage = require('./storage');
var localStorage = require('../core/storage/local-storage');
var keys = require('../core/storage/storage-keys');

var MIGRATION_KEY = 'csl_migration_state';

// All migrations in order
var MIGRATIONS = [
  {
    version: 1,
    name: 'init_storage_keys',
    description: 'Initialize storage key constants',
    up: function() {
      // Ensure all storage keys exist with defaults
      if (!localStorage.getJSON(keys.GRAPH, null)) {
        localStorage.setJSON(keys.GRAPH, { nodes: {}, edges: {}, outEdges: {}, inEdges: {}, nodeToEdges: {}, version: 1 });
      }
      if (!localStorage.getJSON(keys.NOTES, null)) {
        localStorage.setJSON(keys.NOTES, []);
      }
      if (!localStorage.getJSON(keys.INBOX, null)) {
        localStorage.setJSON(keys.INBOX, []);
      }
    }
  },
  {
    version: 2,
    name: 'init_conversations',
    description: 'Initialize conversation storage',
    up: function() {
      if (!localStorage.getJSON('csl_conversations', null)) {
        localStorage.setJSON('csl_conversations', []);
      }
    }
  },
  {
    version: 3,
    name: 'init_lifestyle_modules',
    description: 'Initialize lifestyle module storage',
    up: function() {
      var defaults = {
        'csl_habits': [],
        'csl_habit_checkins': [],
        'csl_food_records': [],
        'csl_countdowns': [],
        'csl_pomodoro_sessions': [],
        'csl_flashcard_decks': [],
        'csl_flashcard_cards': [],
        'csl_flashcard_reviews': [],
        'csl_mood_records': []
      };
      Object.keys(defaults).forEach(function(key) {
        if (!localStorage.getJSON(key, null)) {
          localStorage.setJSON(key, defaults[key]);
        }
      });
    }
  },
  {
    version: 4,
    name: 'init_budget_storage',
    description: 'Initialize budget storage for ledger',
    up: function() {
      if (!localStorage.getJSON('ledger_budgets', null)) {
        localStorage.setJSON('ledger_budgets', []);
      }
    }
  }
];

function getState() {
  return localStorage.getJSON(MIGRATION_KEY, { currentVersion: 0, lastRunAt: null });
}

function saveState(state) {
  localStorage.setJSON(MIGRATION_KEY, state);
}

module.exports = {
  // Run all pending migrations
  runAll: function() {
    var state = getState();
    var currentVersion = state.currentVersion || 0;
    var ran = 0;

    MIGRATIONS.forEach(function(migration) {
      if (migration.version > currentVersion) {
        try {
          console.log('[Migration] Running v' + migration.version + ': ' + migration.name);
          migration.up();
          currentVersion = migration.version;
          ran++;
        } catch (e) {
          console.error('[Migration] Failed v' + migration.version + ':', e.message);
          saveState({ currentVersion: currentVersion, lastRunAt: new Date().toISOString(), lastError: e.message });
          return;
        }
      }
    });

    if (ran > 0) {
      saveState({ currentVersion: currentVersion, lastRunAt: new Date().toISOString() });
      console.log('[Migration] Completed ' + ran + ' migrations, now at v' + currentVersion);
    }
    return { ran: ran, currentVersion: currentVersion };
  },

  // Get migration status
  getStatus: function() {
    var state = getState();
    return {
      currentVersion: state.currentVersion || 0,
      latestVersion: MIGRATIONS.length,
      lastRunAt: state.lastRunAt,
      lastError: state.lastError || null,
      pending: MIGRATIONS.length - (state.currentVersion || 0)
    };
  },

  // Reset migration state (for testing)
  reset: function() {
    saveState({ currentVersion: 0, lastRunAt: null });
  }
};
