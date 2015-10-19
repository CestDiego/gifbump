navigator.getUserMedia  = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;

function showCamera(videoSettings) {
  navigator.getUserMedia(videoSettings , function (stream) {
    video.src = window.URL.createObjectURL(stream);
    localMediaStream = stream;
    video.onloadedmetadata = function(e) {
      canvasFrame = document.createElement('canvas');
      canvasFrame.width = video.clientWidth;
      canvasFrame.height = video.clientHeight;
      gif = new GIF({
        workers: 4,
        width: video.clientWidth,
        height: video.clientHeight
      })
      gif.on('finished', function(blob){
        document.querySelector('img').src = URL.createObjectURL(blob);
      });

    };
  }, function (error) {console.log(error)});
}

function screenShot() {
  if (localMediaStream) {
    var ctx = canvasFrame.getContext('2d');
    ctx.drawImage(video, 0, 0);
    gif.addFrame(ctx, {copy: true, delay: 50});
  }
}

function toggleRecording() {
  if (!frameTimeout) {
    frameTimeout = window.setInterval(screenShot, 50);
  } else {
    window.clearInterval(frameTimeout)
    frameTimeout = null;
    gif.render();
  }
}

var videoSettings = {
  video: {
    mandatory: {
      maxWidth: 640,
      maxHeight: 360
    }
  }
};
var video = document.querySelector('video');
var localMediaStream = null;
var frameTimeout = null;
var canvasFrame = null;
var gif = null

video.addEventListener('click', toggleRecording, false);
showCamera(videoSettings)
