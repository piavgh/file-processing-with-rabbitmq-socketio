import React from 'react';

// Import routing components
import {Route, Switch} from 'react-router-dom';
import {ConnectedRouter} from 'react-router-redux';
import createHistory from 'history/createBrowserHistory'
const history = createHistory();

// Import custom components
import MainLayout from '../components/common/layout/MainLayout';
import ResultImage from '../containers/app/ResultImage';
import Home from '../components/frontend/Home';
import NotFound from '../components/error/NotFound';

const Router = () => (
    <ConnectedRouter history={history}>
      <Switch>
          <MainLayout>
            <Switch>
              <Route path="/" exact component={Home}/>
              <Route path="/result" exact  component={ResultImage}/>
            </Switch>
          </MainLayout>
          <Route component={NotFound}/>
      </Switch>
    </ConnectedRouter>
);

export default Router;
