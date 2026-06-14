var manifest = require('./manifest');

var CATEGORIES = [
  {
    id: 'length', name: '长度',
    units: [
      { id: 'mm', name: '毫米', factor: 0.001 },
      { id: 'cm', name: '厘米', factor: 0.01 },
      { id: 'm', name: '米', factor: 1 },
      { id: 'km', name: '千米', factor: 1000 },
      { id: 'in', name: '英寸', factor: 0.0254 },
      { id: 'ft', name: '英尺', factor: 0.3048 },
      { id: 'mi', name: '英里', factor: 1609.344 }
    ]
  },
  {
    id: 'weight', name: '重量',
    units: [
      { id: 'mg', name: '毫克', factor: 0.000001 },
      { id: 'g', name: '克', factor: 0.001 },
      { id: 'kg', name: '千克', factor: 1 },
      { id: 't', name: '吨', factor: 1000 },
      { id: 'oz', name: '盎司', factor: 0.0283495 },
      { id: 'lb', name: '磅', factor: 0.453592 }
    ]
  },
  {
    id: 'temperature', name: '温度',
    units: [
      { id: 'c', name: '摄氏度', factor: 1 },
      { id: 'f', name: '华氏度', factor: 1 },
      { id: 'k', name: '开尔文', factor: 1 }
    ]
  },
  {
    id: 'area', name: '面积',
    units: [
      { id: 'sqm', name: '平方米', factor: 1 },
      { id: 'sqkm', name: '平方千米', factor: 1000000 },
      { id: 'ha', name: '公顷', factor: 10000 },
      { id: 'sqft', name: '平方英尺', factor: 0.092903 },
      { id: 'acre', name: '英亩', factor: 4046.86 }
    ]
  },
  {
    id: 'volume', name: '体积',
    units: [
      { id: 'ml', name: '毫升', factor: 0.001 },
      { id: 'l', name: '升', factor: 1 },
      { id: 'gal', name: '加仑', factor: 3.78541 },
      { id: 'floz', name: '液盎司', factor: 0.0295735 }
    ]
  }
];

function getCategories() { return CATEGORIES.map(function(c) { return { id: c.id, name: c.name }; }); }

function getUnits(categoryId) {
  for (var i = 0; i < CATEGORIES.length; i++) {
    if (CATEGORIES[i].id === categoryId) {
      return CATEGORIES[i].units.map(function(u) { return { id: u.id, name: u.name }; });
    }
  }
  return [];
}

function convert(value, fromId, toId, categoryId) {
  value = parseFloat(value);
  if (isNaN(value)) return 0;

  if (categoryId === 'temperature') {
    return convertTemperature(value, fromId, toId);
  }

  var cat = null;
  for (var i = 0; i < CATEGORIES.length; i++) {
    if (CATEGORIES[i].id === categoryId) { cat = CATEGORIES[i]; break; }
  }
  if (!cat) return 0;

  var fromFactor = 1, toFactor = 1;
  for (var j = 0; j < cat.units.length; j++) {
    if (cat.units[j].id === fromId) fromFactor = cat.units[j].factor;
    if (cat.units[j].id === toId) toFactor = cat.units[j].factor;
  }

  var baseValue = value * fromFactor;
  var result = baseValue / toFactor;
  return Math.round(result * 1000000) / 1000000;
}

function convertTemperature(value, from, to) {
  var celsius;
  if (from === 'c') celsius = value;
  else if (from === 'f') celsius = (value - 32) * 5 / 9;
  else celsius = value - 273.15;

  if (to === 'c') return Math.round(celsius * 100) / 100;
  if (to === 'f') return Math.round((celsius * 9 / 5 + 32) * 100) / 100;
  return Math.round((celsius + 273.15) * 100) / 100;
}

module.exports = {
  manifest: manifest,
  getCategories: getCategories,
  getUnits: getUnits,
  convert: convert
};
