import 'styles/extensions.scss';

import React 	from 'react';
import ReactDOM from 'react-dom';
import { GIF } from 'gif.js';

import Video from './Video';

// Shim getUserMedia
navigator.getUserMedia  = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

// Create canvas and context
let ctx, canvas;

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

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {stage: "inactive"};
  }

  componentWillMount() {
    this.renderElements();
  }

  componentDidMount() {
    const elm = ReactDOM.findDOMNode(this);

    canvas = elm.getElementsByTagName('canvas')[0];

    ctx = canvas.getContext('2d');
    this.renderStatic(ctx);

    // Get user media, or ask for permissions
    navigator.getUserMedia(videoSettings, stream => {
      this.setState({access: true});

      // Get rendered video element
      this.video  = elm.getElementsByTagName('video')[0];

      this.video.src = window.URL.createObjectURL(stream);

      this.video.onloadedmetadata = e => {
        this.loaded = true;

        canvas.parentNode.removeChild(canvas);
        canvas.width = this.video.clientWidth;
        canvas.height = this.video.clientHeight;

        this.passiveTimer =  window.setInterval(() => {
          ctx.drawImage(this.video, 0, 0);
          if (this.checkIfBlack()) this.triggerRecording();
        }, PASSIVE_FETCH_INTERVAL);
      };

      this.localMediaStream = stream;
    }, e => {
      this.setState({access: false})
    });
  }

  renderStatic(ctx) {
    if (this.loaded) return this.imageData = undefined

    this.imageData = this.imageData || ctx.createImageData(ctx.canvas.width, ctx.canvas.height)

      for (var i = 0, a = this.imageData.data.length; i < a; i++) {
        this.imageData.data[i] = (Math.random() * 255)|0;
      }

    ctx.putImageData(this.imageData, 0, 0);

    if (!this.loaded) requestAnimationFrame(ts => this.renderStatic(ctx));
  }

  renderElements() {
    this.errorCover = (
      <div>
        <img src="icon.png" />
        <span className="error">
          <br/>
          <span>GIF ME ACCESS!</span>
          <br/><br/>
          <span><small>
            We need to access your camera for bumping action, go to &nbsp;
            <span className="link" onClick={ e => this.openOptions(e) }>options</span>
            &nbsp; to enable camera access
          </small></span>
        </span>
      </div>
    );

    this.inactiveCover = (
      <div>
        <img src="icon.png" onClick={e => this.triggerRecording()} />
        <h2>
          BUMP TO <small>(GIF)</small>BUMP!
        </h2>
      </div>
    );

    this.activeCover = (
      <div>
        <h2>Bump da camera!</h2>

      </div>
    );

    this.capturedCover = (
      <div>
        <h2>Uploading your GifBump!</h2>

      </div>
    );

    this.linkCover = (
      <div>
        <h2>Your GifBump is Uploaded!</h2>
        <p>But we don't have the link, bummer...</p>
      </div>
    );

    this.countdownCover = (
      <div>
        <svg>
          <g>
            <text className="count count-3" x="50%" y="50%">BUMP!</text>
            <text className="count count-2" x="50%" y="50%">2</text>
            <text className="count count-1" x="50%" y="50%">3</text>
          </g>
        </svg>
      </div>
    );
  }

  screenShot() {
    if (this.localMediaStream) {
      ctx.drawImage(this.video, 0, 0);
      if (!this.checkIfBlack()) {
        this.gif.addFrame(ctx, {
          copy: true,
          delay: FRAME_RATE
        });
      }
      else window.setTimeout(e => this.stopRecording(), BUMP_DELAY);
    }
  }

  checkIfBlack() {
    let count = 0;
    let result;
    let dark = 0;
    let cur;
    let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

    for (let i = 0; i < canvas.width; i += 40) {
      for (let j = 0; i < canvas.height; i += 40) {
        let rgb;

        // (R + G + B)
        cur = (j * canvas.width + i) * 4;
        rgb = imageData[cur] + imageData[cur + 1] + imageData[cur + 2];
        if (rgb < DARK_TRESHOLD) dark++;
        count++;
      }
    }
    result = (dark / count > MIN_DARK_RATIO);
    return result;
  }

  stopRecording() {
    window.clearInterval(this.timer);
    this.timer = null;
    this.gif.render();
    this.setState({stage: "captured"});
  }

  openOptions() {
    console.log('WHAAKLSJLAKJS');
    chrome.tabs.create({url: 'options.html'});
  }

  triggerRecording() {
    window.clearInterval(this.passiveTimer);
    this.setState({stage: "countdown"});
    window.setTimeout(() => {
      if (this.state.access) {
        this.setState({stage: "recording"});

        if (!this.timer) {
          this.gif = new GIF({
            workers: 4,
            quality: 10,
            width: this.video.clientWidth,
            height: this.video.clientHeight
          });

          this.gif.on('finished', blob => {
            const blobURL = URL.createObjectURL(blob);

            document.querySelector('.le-img').src = blobURL;
            chrome.runtime.sendMessage({action: 'uploadFile', content: blobURL});
            chrome.runtime.onMessage.addListener(msg => {
              if (msg.action === 'sendLink') this.setState({stage: "finished"});
              if (msg.action === 'error') this.setState({error: true});
            });
          });

          this.timer = window.setInterval(e => this.screenShot(), FRAME_RATE);
        } else this.stopRecording();
      }
    }, 3000);
  }

  render() {
    let successCover;

    switch (this.state.stage) {
     case "inactive":  successCover = this.inactiveCover;  break;
     case "countdown": successCover = this.countdownCover; break;
     case "recording": successCover = this.activeCover;    break;
     case "captured":  successCover = this.capturedCover;  break;
     case "finished":  successCover = this.linkCover;      break;
   }

    return (
      <div className="app flicker scanlines">
        <Video/>
        <div className="cover">
          {(this.state.access) ? successCover : this.errorCover}
        </div>
      </div>
    );
  }
}
