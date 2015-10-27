import React 	  from 'react';

import media    from '../controllers/media';
import history  from '../controllers/history';

const COUNTDOWN = 3000;

export default class ShareRoute extends React.Component {
  constructor() {
    super()
    this.state = {
      capture: false
    }
  }

  openBump(url){
    chrome.tabs.create({url});
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
    const url = `http://go.gifbu.mp/${ this.props.params.url }.gif`
    return (
      <div onClick={ e => this.openBump(url) }>
      <h2>Bump is uploaded</h2>
      <a href="#">{ url }</a>
      </div>
    );
  }
}
