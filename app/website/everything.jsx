import React 	from 'react';
import ReactDOM from 'react-dom';

const logo = new Image()
logo.src = 'icon.png'

// Create canvas and context
let ctx, canvas;

export default class Everything extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const elm = ReactDOM.findDOMNode(this);

    canvas = elm.getElementsByTagName('canvas')[0];

    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;

    ctx = canvas.getContext('2d');
    this.renderStatic(ctx);
  }

  renderStatic(ctx) {
    if (this.loaded) return this.imageData = undefined

    this.imageData = this.imageData || ctx.createImageData(ctx.canvas.width , ctx.canvas.height)

      for (var i = 0, a = this.imageData.data.length; i < a; i++) {
        this.imageData.data[i] = (Math.random() * 255)|0;
      }


    ctx.putImageData(this.imageData, 0, 0, 0, 0 , ctx.canvas.width , ctx.canvas.height);

    if (!this.loaded) requestAnimationFrame(ts => this.renderStatic(ctx));
  }

  render() {
    return (
      <div className="app flicker scanlines container-fluid">
      		<div className="app-content">
      			<img className="bump" src="icon.png"/>
      			<h1>GifBump!</h1>
      			<a href="https://chrome.google.com/webstore/detail/gifbump/bacfjdhpbcepapbkibpdmpaikphomene" className="extension-badge"><img src="https://developer.chrome.com/webstore/images/ChromeWebStore_Badge_v2_496x150.png"/></a>
      		</div>

			<canvas id='static'/>
      </div>
    );
  }
}
