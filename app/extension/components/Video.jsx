import React from 'react';

export default class Video extends React.Component {
  render() {
    return (
      <div className="video">
        <canvas />
        <video autoPlay />
        <img className="le-img" alt="" src=""/>
      </div>
    );
  }
}
