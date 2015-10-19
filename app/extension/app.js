import { GIF } from 'gif.js'

// Constants
const DARK_TRESHOLD = 130,
      MIN_DARK_RATIO = 0.8

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
      gif.addFrame(ctx, {copy: true, delay: 50})
    } else {
      stopRecording()
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
      width: video.clientWidth,
      height: video.clientHeight
    })

    gif.on('finished', function(blob){
      document.querySelector('img').src = URL.createObjectURL(blob)
    })

    timer = window.setInterval(screenShot, 50)
  } else {
    stopRecording()
  }

}

function stopRecording() {
  window.clearInterval(timer)
  timer = null
  gif.render()
}

// Start the app

video.addEventListener('click', toggleRecording, false)

showCamera(videoSettings)