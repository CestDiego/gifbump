import 'styles/extensions.scss'

import React 	from 'react'
import ReactDOM from 'react-dom'

// Shim getUserMedia
navigator.getUserMedia  = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia

class Options extends React.Component {
	constructor(props) {
		super(props)
		this.state = {}
	}

	componentWillMount() {
		this.requestPermission()
	}

	requestPermission() {
		// Get user media, or ask for permissions
	  	navigator.getUserMedia(
  			{video: true},
	  		s => this.setState({access:true}), 
	  		e => this.setState({access:false})
	  	)		
	}

	render() {
		return(
			<div>
				<div>GIFBUMP Configuration</div>
				<br/>
				<span className={this.state.access ? '' : 'hidden'}>Camera access enabled</span>
				<span className={this.state.access ? 'hidden' : 'link'} onClick={ e => this.requestPermission() }>Click to enable camera access</span>
			</div>
		)
	}
}

// Render app container
ReactDOM.render(
  <Options/>,
  document.getElementById('container')
)
