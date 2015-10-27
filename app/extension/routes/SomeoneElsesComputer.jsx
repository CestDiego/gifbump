import React 	  from 'react';

import media    from '../controllers/media';
import history  from '../controllers/history';

export default class LiesRoute extends React.Component {
  constructor() {
    super();
    this.state = {
      done: false
    };
  }

  componentDidMount() {
    media.upload(response => {
      const link = response.content.match(/.mp\/(.*).gif/)[1];

      // TODO: go to error screen
      if (response.action === 'error') history.replaceState(null, '/error');
      if (response.action === 'sendLink') history.replaceState(null, `/share/${link}`);
    });
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
