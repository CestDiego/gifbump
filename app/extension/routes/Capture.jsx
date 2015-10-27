import React 	  from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router';

import media    from '../controllers/media'
import history  from '../controllers/history'

const COUNTDOWN = 3000

export default class CaptureRoute extends React.Component {
  constructor() {
    super()
    this.state = {
      capture: false,
      stopped: false
    }
  }

  componentDidMount(){
    setTimeout(
      () =>  {
        this.setState({capture: true})
        media.capture(
          () => this.setState({capture: false, stopped: true}),
          () => history.replaceState(null, '/preview')
        )
      }, 
    COUNTDOWN)
  }


  render() {
    if(this.state.capture) return (
      <div>
        <h2>Bump da camera!</h2>
      </div>
    );

    if(this.state.stopped) return (
      <div>
        <h2>Processing your bump...</h2>
      </div>
    );

    return (
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
}