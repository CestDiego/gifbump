import React 	  from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router';

import media    from '../controllers/media'
import history  from '../controllers/history'

export default class PreviewRoute extends React.Component {
  render() {
    return (
      <div>
        <h2>Here's your bump!</h2>
        <p>How'd you like it?</p>
        <div>
          <Link to='/upload'>
            <span>Yay!</span>
          </Link>
          <Link to='/'>
            <span>Nay...</span>
          </Link>
        </div>
      </div>
    );
  }
}