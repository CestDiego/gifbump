import 'styles/extensions.scss'

import React 	from 'react'
import ReactDOM from 'react-dom'

// Shim getUserMedia
navigator.getUserMedia  = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia

// Create canvas and context
const canvas = document.createElement('canvas'),
      ctx    = canvas.getContext('2d')

// Constants
const DARK_TRESHOLD  = 130,
      MIN_DARK_RATIO = 0.8,
      FRAME_RATE     = 1000 / 15,
      BUMP_DELAY     = FRAME_RATE * 3

const videoSettings = {
  video: {
    mandatory: {
      maxWidth: 640,
      maxHeight: 360
    }
  }
}

export default class App extends React.Component {
	constructor(props) {
		super(props)
		this.state = {}
	}

	componentDidMount() {
		// Get user media, or ask for permissions
	  	navigator.getUserMedia(videoSettings , stream => {
			this.setState({
				access: true
			})

			// Get rendered video element
			let video = ReactDOM.findDOMNode(this).getElementsByTagName('video')[0]

			video.onloadedmetadata = function(e) {
				canvas.width = video.clientWidth
				canvas.height = video.clientHeight
			}

	     	video.src = window.URL.createObjectURL(stream)
	      	// localMediaStream = stream
	    }, e => {
			this.setState({
				access: false
			})
	    })
	}

	openOptions() {
		console.log('WHAAKLSJLAKJS')
		chrome.tabs.create({url: 'options.html'})
	}

	render() {
		return(
			<div className="app flicker scanlines">
				<video autoPlay />
				<div className="cover">
					<img src="icon.png"/>
					<h2 className={this.state.access ? '' : 'hidden'}>BUMP or CLICK TO <small>(GIF)</small>BUMP!</h2>
					<div>
						<span className={'error ' + (this.state.access ? 'hidden' : '')}>
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
				</div>
			</div>	
		)
	}
}