// core/audio/player.js v1.3.8
var audioCtx = null;
var currentSrc = '';

function play(src, opts) {
  opts = opts || {};
  stop();
  audioCtx = wx.createInnerAudioContext();
  audioCtx.src = src;
  audioCtx.autoplay = opts.autoplay !== false;
  currentSrc = src;
  if (opts.onPlay) audioCtx.onPlay(opts.onPlay);
  if (opts.onEnded) audioCtx.onEnded(opts.onEnded);
  if (opts.onError) audioCtx.onError(opts.onError);
  audioCtx.play();
}

function pause() {
  if (audioCtx) audioCtx.pause();
}

function resume() {
  if (audioCtx) audioCtx.play();
}

function stop() {
  if (audioCtx) {
    audioCtx.stop();
    audioCtx.destroy();
    audioCtx = null;
    currentSrc = '';
  }
}

function seek(position) {
  if (audioCtx) audioCtx.seek(position);
}

function getCurrentTime(cb) {
  if (audioCtx && cb) cb(audioCtx.currentTime);
  return audioCtx ? audioCtx.currentTime : 0;
}

function getDuration(cb) {
  if (audioCtx && cb) cb(audioCtx.duration);
  return audioCtx ? audioCtx.duration : 0;
}

function isPlaying() { return audioCtx !== null; }

module.exports = { play: play, pause: pause, resume: resume, stop: stop, seek: seek, getCurrentTime: getCurrentTime, getDuration: getDuration, isPlaying: isPlaying };
