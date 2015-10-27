import React 	  from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router';

import media    from '../controllers/media'
import history  from '../controllers/history'

const COUNTDOWN = 3000

export default class LiesRoute extends React.Component {
  constructor() {
    super()
    this.state = {
      done: false
    }
  }

  componentDidMount(){
    media.upload(msg => {
      console.log(msg)
      // TODO: go to error screen
      if (msg.action === 'error') history.replaceState(null, '/error');
      if (msg.action === 'sendLink') history.replaceState(null, `/share/${ msg.content.match(/.mp\/(.*).gif/)[1] }`);
    } )
  } 

  render() {
    return (
      <div>
        <h2>Uploading your bump on the line!</h2>
        <p>I can't think of a joke...</p>
      </div>
    );
  }
}