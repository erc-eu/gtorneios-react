import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './components/pages/Home';
import Login from './components/pages/Login';
import Register from "./components/pages/Register"
import UserAlterar from './components/pages/user/UserAlterar';
function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact path='/' Component={Home}><Home/></Route>
          <Route exact path='/login' Component={Login}><Login/></Route>
          <Route exact path='/register' Component={Register}><Register/></Route>
          <Route exact path={'/UserAlterar'} component={UserAlterar}><UserAlterar/></Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;