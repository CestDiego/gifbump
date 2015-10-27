import { GIF }  		 from 'gif.js';

const logo = new Image()
logo.src = 'icon.png'

// Shim getUserMedia
navigator.getUserMedia  = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
window.URL = window.URL || window.webkitURL

// Constants
const DARK_TRESHOLD          = 130;
const MIN_DARK_RATIO         = 0.8;
const FRAME_RATE             = 1000 / 15;
const PASSIVE_FETCH_INTERVAL = FRAME_RATE * 5;
const BUMP_DELAY             = FRAME_RATE * 3;
const videoSettings = {
				video: {
					mandatory: {
						maxWidth: 640,
						maxHeight: 360
					}
				}
			};

class MediaManager {
	getStream(success, error) {
		if (this.stream) return success( window.URL.createObjectURL(this.stream) )
		if (this.error)  return error( 'bummer...' )

    navigator.getUserMedia(videoSettings, stream => {
    	this.stream = stream
			
      if (this.loaded) return success( window.URL.createObjectURL(this.stream) )

      this.video.addEventListener('loadedmetadata', e => {
				this.loaded = true
				success( window.URL.createObjectURL(this.stream) )
			})

			this.video.src = window.URL.createObjectURL(this.stream)
    }, e => {
      this.error = true
      error( 'bummer...' )
    });
	}

	attachElements(ctx, video, image) {
		this.ctx 	 = ctx
		this.video = video
		this.image = image
	}

	startCheck(callback) {
		this.checkInterval = window.setInterval(() => {
			console.log('check...')
			this.ctx.drawImage(this.video, 0, 0);
			if (this.checkBlack()) this.stopCheck(callback);
		}, PASSIVE_FETCH_INTERVAL);
	}

	checkBlack() {
    let count = 0;
    let result;
    let dark = 0;
    let cur;
    let imageData = this.ctx.getImageData(0, 0,this.ctx.canvas.width,this.ctx.canvas.height).data;

    for (let i = 0; i <this.ctx.canvas.width; i += 40) {
      for (let j = 0; i <this.ctx.canvas.height; i += 40) {
        let rgb;

        // (R + G + B)
        cur = (j *this.ctx.canvas.width + i) * 4;
        rgb = imageData[cur] + imageData[cur + 1] + imageData[cur + 2];
        if (rgb < DARK_TRESHOLD) dark++;
        count++;
      }
    }

    return (dark / count > MIN_DARK_RATIO);
	}

	stopCheck(callback) {
		clearInterval(this.checkInterval)
		callback()
	}

	capture(onStop, onDone) {
    this.gif = new GIF({
      workers: 4,
      quality: 10,
      width: this.video.clientWidth,
      height: this.video.clientHeight
    });

    this.gif.on('finished', blob => {
      this.blobURL = URL.createObjectURL(blob);
      this.image.src = this.blobURL;
      onDone(this.blobURL)
    });

    this.captureInterval = window.setInterval(e => this.screenShot(onStop), FRAME_RATE);
	}

  screenShot(onStop) {
    this.ctx.drawImage(this.video, 0, 0);

    if (!this.checkBlack()) {
      this.renderWatermark()
      this.gif.addFrame(this.ctx, {
        copy: true,
        delay: FRAME_RATE
      });
    } else {
			window.setTimeout(e => {
				clearInterval(this.captureInterval)
		    this.gif.render();
		    onStop();
			}, BUMP_DELAY);
    }
  }

  renderWatermark() {
    this.ctx.globalAlpha = 0.5
    this.ctx.drawImage(logo, this.ctx.canvas.width - 70, this.ctx.canvas.height - 73, 50, 50);
    this.ctx.globalAlpha = 1
    this.ctx.font = "10px 'Press Start 2P'"
    this.ctx.fillStyle = 'white'
    this.ctx.fillText("gifbu.mp",this.ctx.canvas.width - 85,this.ctx.canvas.height - 10)
  }

	upload(callback) {
    chrome.runtime.sendMessage({action: 'uploadFile', content: this.blobURL});
    chrome.runtime.onMessage.addListener( msg => callback(msg) );
	}

	clearPreview() {
		this.image.src = ''
	}
}

export default new MediaManager()