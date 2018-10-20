// @flow
import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import asyncComponent from '../helpers/async-component';


const MainPage = asyncComponent(() => import('../main/main'));
const NotFoundPage = asyncComponent(() => import('../common/not-found-page/not-found-page'));

const App = () => (
  <Router>
    <Switch>
      <Route exact path="/" component={MainPage} />
      <Route component={NotFoundPage} />
    </Switch>
  </Router>
);

export default App;
