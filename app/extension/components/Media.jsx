import React 		from 'react';
import ReactDOM from 'react-dom';
import media 		from '../controllers/media'

// Shim getUserMedia
navigator.getUserMedia  = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

const videoSettings = {
  video: {
    mandatory: {
      maxWidth: 640,
      maxHeight: 360
    }
  }
};

export default class MediaAllTheThings extends React.Component {
	componentDidMount() {
		// this.canvas
		// this.vid
		// this.image
	}

  componentDidMount() {
    const elm = ReactDOM.findDOMNode(this);

    // Get elements
    this.ctx = elm.getElementsByTagName('canvas')[0].getContext('2d');
    this.vid = elm.getElementsByTagName('video')[0];
    this.img = elm.getElementsByTagName('img')[0];

    this.renderStatic();

    media.attachElements(this.ctx, this.vid, this.img)

    // Get user media, or ask for permissions
    media.getStream(streamUrl => {
      this.loaded = true;

      this.ctx.canvas.parentNode.removeChild(this.ctx.canvas);
      this.ctx.canvas.width = this.vid.clientWidth;
      this.ctx.canvas.height = this.vid.clientHeight;
    }, e => console.log(e) );
  }

  renderStatic() {
    if (this.loaded) return this.imageData = undefined

    this.imageData = this.imageData || this.ctx.createImageData(this.ctx.canvas.width, this.ctx.canvas.height)
    for (var i = 0, a = this.imageData.data.length; i < a; i++) this.imageData.data[i] = ( (Math.random() * 255)|0 );
    this.ctx.putImageData(this.imageData, 0, 0);

    if (!this.loaded) requestAnimationFrame(ts => this.renderStatic(this.ctx));
  }

	render() {
		return (
			<div className="video">
				<canvas />
				<video autoPlay />
				<img className="le-img" alt="" src="" />
			</div>
		);
	}
}
