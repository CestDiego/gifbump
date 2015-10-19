navigator.getUserMedia  = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;

function showCamera(videoSettings) {
  navigator.getUserMedia(videoSettings , function (stream) {
    video.src = window.URL.createObjectURL(stream);
    localMediaStream = stream;
    video.onloadedmetadata = function(e) {
      canvasFrame = document.createElement('canvas');
      canvasFrame.width = video.clientWidth;
      canvasFrame.height = video.clientHeight;
    };
  }, function (error) {console.log(error)});
}

function screenShot() {
  if (localMediaStream) {
    var ctx = canvasFrame.getContext('2d');
    ctx.drawImage(video, 0, 0);
    document.querySelector('img').src = canvasFrame.toDataURL('image/webp');
  }
}

function toggleRecording() {
  if (!frameTimeout) {
    frameTimeout = window.setInterval(screenShot, 50);
  } else {
    window.clearInterval(frameTimeout)
    frameTimeout = null;
  }
}

var videoSettings = {
  video: {
    mandatory: {
      minWidth: 480,
      minHeight: 360
    }
  }
};
var video = document.querySelector('video');
var localMediaStream = null;
var frameTimeout = null;
var canvasFrame = null;

video.addEventListener('click', toggleRecording, false);
showCamera(videoSettings)
