import { GIF } from 'gif.js'

// Constants
const DARK_TRESHOLD  = 130,
      MIN_DARK_RATIO = 0.8,
      FRAME_RATE     = 1000 / 15,
      BUMP_DELAY     = FRAME_RATE * 3

// Elements
const canvas = document.createElement('canvas'),
      ctx    = canvas.getContext('2d'),
      video  = document.querySelector('video')

// Variables
let localMediaStream = null,
    timer = null,
    gif = null,
    holi = null

const videoSettings = {
  video: {
    mandatory: {
      maxWidth: 640,
      maxHeight: 360
    }
  }
}


// Shim getUserMedia
navigator.getUserMedia  = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia

function showCamera(videoSettings) {
  navigator.getUserMedia(videoSettings , function (stream) {
      video.src = window.URL.createObjectURL(stream)
      localMediaStream = stream

      video.onloadedmetadata = function(e) {
        canvas.width = video.clientWidth
        canvas.height = video.clientHeight
      }
    }, e => console.log(e)
  )
}

function screenShot() {
  if (localMediaStream) {
    ctx.drawImage(video, 0, 0)
    if (!checkIfBlack()){
      gif.addFrame(ctx, {copy: true, delay: FRAME_RATE})
    } else {
      setTimeout(stopRecording, BUMP_DELAY)
    }
  }
}

function checkIfBlack() {
  let count = 0,
      dark = 0,
      cur,
      imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data

  console.log("New Image Data")

  for (var i=0; i < canvas.width; i+=40) {
    for (var j=0; i < canvas.height; i+=40) {
      count++

      cur = (j * canvas.width + i) * 4

      // (R + G + B)
      if (imageData[cur] + imageData[cur+1] + imageData[cur+2] < DARK_TRESHOLD) dark++
    }
  }

  return (dark/count > MIN_DARK_RATIO)
}

function toggleRecording() {
  if (!timer) {
    gif = new GIF({
      workers: 4,
      quality: 10,
      width: video.clientWidth,
      height: video.clientHeight
    })

    gif.on('finished', function(blob){
      document.querySelector('img').src = URL.createObjectURL(blob)
      upload(blobToFile(blob))
    })

    timer = window.setInterval(screenShot, FRAME_RATE)
  } else {
    stopRecording()
  }

}

function stopRecording() {
  window.clearInterval(timer)
  timer = null
  gif.render()
}

function blobToFile(theBlob, fileName){
  //A Blob() is almost a File() - it's just missing the two properties below which we will add
  theBlob.lastModifiedDate = new Date();
  theBlob.name = fileName;
  return theBlob;
}

function upload(file) {

  // file is from a <input> tag or from Drag'n Drop
  // Is the file an image?

  if (!file || !file.type.match(/image.*/)) return;

  // It is!
  // Let's build a FormData object

  var fd = new FormData();
  fd.append("image", file); // Append the file
  fd.append("key", "6528448c258cff474ca9701c5bab6927");
  // Get your own key: http://api.imgur.com/

  // Create the XHR (Cross-Domain XHR FTW!!!)
  var xhr = new XMLHttpRequest();
  xhr.open("POST", "http://api.imgur.com/2/upload.json"); // Boooom!
  xhr.onload = function() {
    // Big win!
    // The URL of the image is:
    const link = JSON.parse(xhr.responseText).upload.links.original;
    console.log(link)
  }
  // Ok, I don't handle the errors. An exercice for the reader.
  // And now, we send the formdata
  xhr.send(fd);
}

// Start the app

video.addEventListener('click', toggleRecording, false)

showCamera(videoSettings)
