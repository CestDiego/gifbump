var DARK_TRESHOLD = 130;
var MIN_DARK_RATIO = 0.8;

navigator.getUserMedia  = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;

function showCamera(videoSettings) {
  navigator.getUserMedia(videoSettings , function (stream) {
    video.src = window.URL.createObjectURL(stream);
    localMediaStream = stream;
    video.onloadedmetadata = function(e) {
      canvas = document.createElement('canvas');
      canvas.width = video.clientWidth;
      canvas.height = video.clientHeight;
    };
  }, function (error) {console.log(error)});
}

function screenShot() {
  if (localMediaStream) {
    var ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0);
    if (!checkIfBlack()){
      gif.addFrame(ctx, {copy: true, delay: 50});
    } else {
      stopRecording()
    }
  }
}

function checkIfBlack(ctx) {
  var ctx = canvas.getContext('2d');
  var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
  console.log("New Image Data");
  var count = 0;
  var dark = 0;
  for (var i=0; i < canvas.width; i+=40) {
    for (var j=0; i < canvas.height; i+=40) {
      count++;
      var cur = (j * canvas.width + i) * 4
      var r = imageData[cur];
      var g = imageData[cur+1];
      var b = imageData[cur+2];
      if (r + g +b < DARK_TRESHOLD) dark++;
    }
  }

  var ratio = (dark/count > MIN_DARK_RATIO);
  console.log(ratio);
  return ratio;

}

function toggleRecording() {
  if (!timer) {
    gif = new GIF({
      workers: 4,
      width: video.clientWidth,
      height: video.clientHeight
    })
    gif.on('finished', function(blob){
      document.querySelector('img').src = URL.createObjectURL(blob);
    });

    timer = window.setInterval(screenShot, 50);
  } else {
    stopRecording();
  }

}

function stopRecording() {
  window.clearInterval(timer)
  timer = null;
  gif.render();
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
var timer = null;
var canvas = null;
var gif = null;
var holi = null;

video.addEventListener('click', toggleRecording, false);
showCamera(videoSettings)
