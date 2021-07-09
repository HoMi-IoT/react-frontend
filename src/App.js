import React, { Fragment } from 'react';
import './App.css';


import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Navbar from './Components/Navbar/Navbar';


import DeviceList from './Components/DeviceRegistry/DeviceList'


function App() {
  return (
    <Router>
        <Fragment>
          <Navbar></Navbar>
          
          <section className="ui container mt-5">

            <Switch>
              <Route exact path="/path/:id" component={()=><div>{"path/id"}</div>} />
              <Route exact path="/path" component={()=><div>{"path"}</div>} />
              <Route exact path="/devices" component={DeviceList} />
              <Route path="/" component={()=><div>{"Home"}</div>} />
            </Switch>
          </section>
        </Fragment>
      </Router>
  );
}

export default App;
