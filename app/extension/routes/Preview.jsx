import React 	  from 'react';
import { Link } from 'react-router';

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
            <span>&nbsp;&nbsp;</span>
          <Link to='/'>
            <span>Nay...</span>
          </Link>
        </div>
      </div>
    );
  }
}
