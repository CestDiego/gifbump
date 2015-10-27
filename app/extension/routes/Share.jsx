import React 	  from 'react';

import media    from '../controllers/media';
import history  from '../controllers/history';

const COUNTDOWN = 3000;

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
    const link = "http://reddit.com";
    return (
      <div>
      <h2>Bump is uploaded</h2>
      <p>{ link }</p>
      </div>
    );
  }
}
