var compTool = require('../../modules/tool-compress/public');

Page({
  data: {
    images: [],
    results: [],
    quality: 60,
    loading: false,
    ready: false
  },

  onLoad: function() {
    var self = this;
    setTimeout(function() { self.setData({ ready: true }); }, 100);
  },

  onSelectImages: function() {
    var self = this;
    compTool.selectImages(9).then(function(paths) {
      if (paths.length === 0) return;
      var chain = Promise.resolve();
      var imgs = [];
      paths.forEach(function(p) {
        chain = chain.then(function() {
          return compTool.getImageInfo(p).then(function(info) { imgs.push(info); });
        });
      });
      chain.then(function() { self.setData({ images: imgs, results: [] }); });
    });
  },

  onQualityChange: function(e) {
    this.setData({ quality: e.detail.value });
  },

  onCompress: function() {
    var self = this;
    if (self.data.images.length === 0) return;
    self.setData({ loading: true, results: [] });

    var paths = self.data.images.map(function(i) { return i.path; });
    compTool.batchCompress(paths, self.data.quality).then(function(results) {
      self.setData({ results: results, loading: false });
      var saved = 0;
      results.forEach(function(r) {
        if (r.compressed) saved += r.sizeKB;
      });
      wx.showToast({ title: '压缩完成', icon: 'success' });
    });
  },

  onSaveAll: function() {
    var self = this;
    var results = self.data.results.filter(function(r) { return r.path; });
    if (results.length === 0) return;
    var saved = 0;
    var chain = Promise.resolve();
    results.forEach(function(r) {
      chain = chain.then(function() {
        return compTool.saveToAlbum(r.path).then(function() { saved++; }).catch(function() {});
      });
    });
    chain.then(function() {
      wx.showToast({ title: '已保存 ' + saved + ' 张', icon: 'success' });
    });
  },

  onReset: function() {
    this.setData({ images: [], results: [], loading: false });
  },

  onBack: function() { wx.navigateBack(); }
});
