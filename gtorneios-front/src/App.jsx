import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './components/pages/Home';
import Login from './components/pages/Login';
import Register from "./components/pages/Register"
import UserAlterar from './components/pages/user/UserAlterar';
import NovoTorneio from './components/pages/torneio/NovoTorneio';
import TorneiosCriados from './components/pages/torneio/TorneiosCriados';

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact path='/' Component={Home}><Home/></Route>
          <Route exact path='/login' Component={Login}><Login/></Route>
          <Route exact path='/register' Component={Register}><Register/></Route>
          <Route exact path={'/UserAlterar'} component={UserAlterar}><UserAlterar/></Route>
          <Route exact path={'/NovoTorneio'} component={NovoTorneio}><NovoTorneio/></Route>
          <Route exact path={'/TorneiosCriados'} component={TorneiosCriados}><TorneiosCriados/></Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
