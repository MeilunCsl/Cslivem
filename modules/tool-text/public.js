var manifest = require('./manifest');

function countChars(text) {
  if (!text) return { chars: 0, words: 0, lines: 0, chinese: 0, english: 0, numbers: 0, punctuation: 0 };
  var lines = text.split('\n');
  var chinese = (text.match(/[\u4e00-\u9fff]/g) || []).length;
  var english = (text.match(/[a-zA-Z]+/g) || []).length;
  var numbers = (text.match(/[0-9]+/g) || []).length;
  var punctuation = (text.match(/[\u3000-\u303f\uff00-\uffef.,;:!?\-'"()\[\]{}]/g) || []).length;
  return {
    chars: text.length,
    words: chinese + english,
    lines: lines.length,
    chinese: chinese,
    english: english,
    numbers: numbers,
    punctuation: punctuation,
    noSpaces: text.replace(/\s/g, '').length
  };
}

function toUpperCase(text) { return (text || '').toUpperCase(); }
function toLowerCase(text) { return (text || '').toLowerCase(); }

function toTitleCase(text) {
  return (text || '').replace(/\b\w+/g, function(word) {
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  });
}

function removeEmptyLines(text) {
  return (text || '').split('\n').filter(function(l) { return l.trim(); }).join('\n');
}

function removeDuplicateLines(text) {
  var lines = (text || '').split('\n');
  var seen = {};
  return lines.filter(function(l) {
    if (seen[l]) return false;
    seen[l] = true;
    return true;
  }).join('\n');
}

function sortLines(text, desc) {
  var lines = (text || '').split('\n').filter(function(l) { return l.trim(); });
  lines.sort();
  if (desc) lines.reverse();
  return lines.join('\n');
}

function reverseText(text) {
  return (text || '').split('').reverse().join('');
}

function replaceText(text, find, replace) {
  if (!find) return text;
  return (text || '').split(find).join(replace);
}

module.exports = {
  manifest: manifest,
  countChars: countChars,
  toUpperCase: toUpperCase,
  toLowerCase: toLowerCase,
  toTitleCase: toTitleCase,
  removeEmptyLines: removeEmptyLines,
  removeDuplicateLines: removeDuplicateLines,
  sortLines: sortLines,
  reverseText: reverseText,
  replaceText: replaceText
};
