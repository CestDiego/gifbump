import React 	  from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router';

import media    from '../controllers/media'
import history  from '../controllers/history'

export default class IndexRoute extends React.Component {
  openOptions() {
    chrome.tabs.create({url: 'options.html'});
  }

  componentDidMount(){
    // Get user media, or ask for permissions
    media.getStream(streamUrl => null, e => history.replaceState(null, '/permission') );
  }

  render() {
    if(this.ready) return (
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