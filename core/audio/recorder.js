// core/audio/recorder.js v1.3.8
var isRecording = false;
var recorderManager = null;

function getRecorder() {
  if (!recorderManager) {
    recorderManager = wx.getRecorderManager();
  }
  return recorderManager;
}

function start(opts) {
  opts = opts || {};
  var recorder = getRecorder();
  isRecording = true;
  recorder.start({
    duration: opts.duration || 60000,
    sampleRate: opts.sampleRate || 16000,
    numberOfChannels: opts.numberOfChannels || 1,
    encodeBitRate: opts.encodeBitRate || 96000,
    format: opts.format || 'mp3'
  });
}

function stop() {
  var recorder = getRecorder();
  isRecording = false;
  recorder.stop();
}

function onPause(cb) {
  getRecorder().onPause(cb);
}

function onResume(cb) {
  getRecorder().onResume(cb);
}

function onStop(cb) {
  getRecorder().onStop(cb);
}

function onError(cb) {
  getRecorder().onError(cb);
}

function onFrameRecorded(cb) {
  getRecorder().onFrameRecorded(cb);
}

function isRecordingAudio() { return isRecording; }

module.exports = { start: start, stop: stop, onPause: onPause, onResume: onResume, onStop: onStop, onError: onError, onFrameRecorded: onFrameRecorded, isRecording: isRecordingAudio };
