import React 	  from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router';

import media    from '../controllers/media'
import history  from '../controllers/history'

const COUNTDOWN = 3000

export default class ShareRoute extends React.Component {
  constructor() {
    this.state = {
      capture: false
    }
  }

  openOptions() {
    chrome.tabs.create({url: 'options.html'});
  }

  componentDidMount(){
    setTimeout(
      () =>  {
        this.setState({capture: true})
        media.capture( () => history.replaceState(null, '/preview') )
      }, 
    COUNTDOWN)
  }

  render() {
    if(this.capture) return (
      <div>
        <h2>Bump da camera!</h2>

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