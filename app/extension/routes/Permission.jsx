import React 	  from 'react';

export default class PermissionRoute extends React.Component {
  openOptions(e) {
    chrome.tabs.create({url: 'options.html'});
  }

  render() {
    return (
      <div>
        <img src="icon.png" />
        <span className="error">
          <br/>
          <span>GIF ME ACCESS!</span>
          <br/><br/>
          <span><small>
            We need to access your camera for bumping action, go to &nbsp;
            <span className="link" onClick={ e => this.openOptions(e) }>options</span>
            &nbsp; to enable camera access
          </small></span>
        </span>
      </div>
    );
  }
}
