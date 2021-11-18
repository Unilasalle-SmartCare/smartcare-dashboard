import React, { Component } from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import './scss/style.scss';
import 'react-toastify/dist/ReactToastify.css';

const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
)

// Containers
const Dashboard = React.lazy(() => import('./smartcare/components/dashboard/Dashboard'));

// Pages
const Login = React.lazy(() => import('./smartcare/pages/login/Login'));
const Register = React.lazy(() => import('./smartcare/pages/register/Register'));

class App extends Component {

  render() {
    return (
      <HashRouter>
          <React.Suspense fallback={loading}>
            <Switch>
              <Route path="/register" name="Cadastro" render={props => <Register {...props}/>} />
              <Route path="/dashboard" name="Dashboard" render={props => <Dashboard {...props}/>} />
              <Route path="/" name="Login" render={props => <Login {...props}/>} />
            </Switch>
            <ToastContainer />
          </React.Suspense>
      </HashRouter>
    );
  }
}

export default App;
