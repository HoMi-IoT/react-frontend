import React, { Fragment } from 'react';
import { Link, useLocation} from 'react-router-dom';
import { Header, Menu } from 'semantic-ui-react';

const Navbar = () => {
  const location = useLocation();

  return (
    <div className="ui top fixed menu">
      <Menu.Header className="item">
        <div className="ui medium header">
          <i className="home icon"></i>
          <div className="content">HoMI</div>
        </div>
      </Menu.Header>
      <div className="right menu">
        <Fragment>
        <Link to="/rules" className={location.pathname === "/rules" ? "active item" : "item"}>
            Rules
        </Link>
        <Link to="/script" className={location.pathname === "/script" ? "active item" : "item"}>
            Scripting
        </Link>
        <Link to="/devices" className={location.pathname === "/devices" ? "active item" : "item"}>
            Devices
        </Link>
        <Link to="/data" className={location.pathname === "/data" ? "active item" : "item"}>
            Data
        </Link>
        </Fragment>
      </div>
    </div>
  );
};

export default Navbar;