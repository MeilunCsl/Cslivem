// core/pdf/pdf-writer.js
// Lightweight PDF generation for WeChat mini program
// Supports JPEG/PNG image embedding, A4 page layout
// v1.7.0

var b64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

function toBase64(buffer) {
  var bytes = new Uint8Array(buffer);
  var out = '';
  for (var i = 0; i < bytes.length; i += 3) {
    var a = bytes[i];
    var b = i + 1 < bytes.length ? bytes[i + 1] : 0;
    var c = i + 2 < bytes.length ? bytes[i + 2] : 0;
    out += b64[a >> 2];
    out += b64[((a & 3) << 4) | (b >> 4)];
    out += i + 1 < bytes.length ? b64[((b & 15) << 2) | (c >> 6)] : '=';
    out += i + 2 < bytes.length ? b64[c & 63] : '=';
  }
  return out;
}

function PdfWriter(opts) {
  opts = opts || {};
  this.pageW = opts.width || 595;
  this.pageH = opts.height || 842;
  this.margin = opts.margin || 40;
  this.objs = [];
  this.pages = [];
  this.pageKids = [];
}

PdfWriter.prototype.addObject = function(content) {
  this.objs.push(content);
  return this.objs.length;
};

PdfWriter.prototype.addPage = function() {
  var id = this.addObject('<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ' + this.pageW + ' ' + this.pageH + '] /Contents [ ] >>');
  this.pageKids.push(id);
  return id;
};

PdfWriter.prototype.embedJpeg = function(jpegBuffer) {
  var b64Data = toBase64(jpegBuffer);
  return this.addObject(b64Data + '\nstream\n/jpeg');
};

PdfWriter.prototype.renderImages = function(imageBuffers) {
  if (!imageBuffers || imageBuffers.length === 0) return;
  var usableW = this.pageW - this.margin * 2;
  var usableH = this.pageH - this.margin * 2;
  var firstPage = true;

  for (var i = 0; i < imageBuffers.length; i++) {
    if (firstPage) {
      this.pageKids = [];
      firstPage = false;
    }
    this.addPage();

    var imgId = this.embedJpeg(imageBuffers[i]);
    var x = this.margin;
    var y = this.margin;
    var w = usableW;
    var h = usableH;

    var contentStream = 'q ' + w + ' 0 0 ' + h + ' ' + x + ' ' + y + ' cm /Img' + imgId + ' Do Q';
    var contentId = this.addObject(contentStream);

    var pageIdx = this.pageKids.length - 1;
    var pageId = this.pageKids[pageIdx];
    this.objs[pageId - 1] = '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ' + this.pageW + ' ' + this.pageH + '] /Contents [' + contentId + ' 0 R] /Resources << /XObject << /Img' + imgId + ' ' + imgId + ' 0 R >> >> >>';
  }
};

PdfWriter.prototype.build = function() {
  var offsets = [];
  var lines = [];

  lines.push('%PDF-1.4');
  offsets.push(0);

  // Obj 1: Catalog
  offsets.push(lines[lines.length - 1].length + (lines.length > 1 ? 1 : 0));
  lines.push('1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj');

  // Obj 2: Pages
  var kidsStr = '';
  for (var i = 0; i < this.pageKids.length; i++) {
    if (i > 0) kidsStr += ' ';
    kidsStr += this.pageKids[i] + ' 0 R';
  }
  var prevLen = 0;
  for (var j = 0; j < lines.length; j++) prevLen += lines[j].length + 1;
  offsets.push(prevLen);
  lines.push('2 0 obj\n<< /Type /Pages /Kids [' + kidsStr + '] /Count ' + this.pageKids.length + ' >>\nendobj');

  // Obj 3..n
  for (var k = 0; k < this.objs.length; k++) {
    var prev = 0;
    for (var m = 0; m < lines.length; m++) prev += lines[m].length + 1;
    offsets.push(prev);
    var obj = this.objs[k];
    if (obj.indexOf('stream') > -1 && obj.indexOf('/jpeg') > -1) {
      var parts = obj.split('\nstream\n/jpeg');
      lines.push((k + 3) + ' 0 obj\n<< /Type /XObject /Subtype /Image /Width ' + this.pageW + ' /Height ' + this.pageH + ' /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ' + parts[0].length + ' >>\nstream');
      lines.push(parts[0]);
      lines.push('endstream\nendobj');
    } else {
      lines.push((k + 3) + ' 0 obj\n' + obj + '\nendobj');
    }
  }

  // Xref
  var xrefOffset = 0;
  for (var n = 0; n < lines.length; n++) xrefOffset += lines[n].length + 1;
  var totalCount = 3 + this.objs.length;
  var xref = 'xref\n0 ' + totalCount + '\n';
  xref += '0000000000 65535 f \n';
  for (var p = 0; p < offsets.length; p++) {
    var off = String(offsets[p]);
    while (off.length < 10) off = '0' + off;
    xref += off + ' 00000 n \n';
  }
  lines.push(xref);

  // Trailer
  lines.push('trailer\n<< /Size ' + totalCount + ' /Root 1 0 R >>\nstartxref\n' + xrefOffset + '\n%%EOF');

  var result = '';
  for (var q = 0; q < lines.length; q++) {
    if (q > 0) result += '\n';
    result += lines[q];
  }
  return result;
};

PdfWriter.prototype.toArrayBuffer = function() {
  var str = this.build();
  var buf = new ArrayBuffer(str.length);
  var view = new Uint8Array(buf);
  for (var i = 0; i < str.length; i++) view[i] = str.charCodeAt(i) & 0xFF;
  return buf;
};

module.exports = PdfWriter;
