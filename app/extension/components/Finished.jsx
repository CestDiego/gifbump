import React from 'react';

export default class Finished extends React.Component {
  render() {
    return (
      <div>
        <h2>Your GifBump is Uploaded!</h2>
        <a href={this.props.link}>{this.props.link}</a>
      </div>
    );
  }
}
