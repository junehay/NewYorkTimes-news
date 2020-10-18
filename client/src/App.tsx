import React from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import BookmarkListContainer from './BookmarkListContainer';
import MainContainer from './MainContainer';

const App = () => {
  return (
  <BrowserRouter>
    <Switch>
      <Route path="/" exact component={MainContainer} />
      <Route path="/bookmark" component={BookmarkListContainer} />
      <Redirect path="*" to="/" />
    </Switch>
  </BrowserRouter>
  )
}

export default App;