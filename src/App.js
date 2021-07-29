import React, { Fragment } from 'react';
import './App.css';


import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Navbar from './Components/Navbar/Navbar';


import DeviceList from './Components/DeviceRegistry/DeviceList'
import Rules from './Components/rules/Rules';
import Scripting from './Components/scripting/Scripting';


function App() {
  return (
    <Router>
        <Fragment>
          <Navbar></Navbar>
          
          <section className="ui container mt-5">

            <Switch>
              <Route exact path="/script" component={Scripting} />
              <Route exact path="/rules" component={Rules} />
              <Route exact path="/devices" component={DeviceList} />
              <Route path="/" component={()=><div>{"Data"}</div>} />
            </Switch>
          </section>
        </Fragment>
      </Router>
  );
}

export default App;
