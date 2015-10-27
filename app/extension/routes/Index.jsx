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
    media.clearPreview()
    
    // Get user media, or ask for permissions
    media.getStream(streamUrl => {
      media.startCheck( reactSucks => history.replaceState(null, '/capture') )
    }, e => history.replaceState(null, '/permission') );
  }

  render() {
    return (
      <div>
        <Link to='/capture'>
          <img src="icon.png" />
          <h2>
            BUMP TO <small>(GIF)</small>BUMP!
          </h2>
        </Link>
      </div>
    );
  }
}