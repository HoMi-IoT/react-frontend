import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';

export default () => {

  return (
    <div className="ui top fixed menu">
      <Link to="/" className="item">
        <div className="ui medium header">
          <i className="home icon"></i>
          <div className="content">HoMI</div>
        </div>
      </Link>
      <div className="right menu">
        <Fragment>
        <Link to="/path" className="item">
            path
        </Link>
        <Link to="/login" onClick={()=>{}} className="item">
            Logout
        </Link>
        </Fragment>
      </div>
    </div>
  );
};
