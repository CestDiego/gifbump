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
      // TODO: go to error screen
      // if (msg.action === 'error') this.setState({error: true});

      console.log(msg)
      if (msg.action === 'sendLink') history.replaceState(null, '/share');
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