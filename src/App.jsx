import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { AuthProvider } from "./components/Auth";
import Home from "./pages/HomePage/Home";
import Login from "./pages/LoginPage/Login";
import Account from "./pages/AccountPage/Account";
import SignUp from "./pages/SignUpPage/SignUp";
import Project from "./pages/ProjectPage/Project";
import NewProject from "./pages/NewProjectPage/NewProject";
import PrivateRoute from "./components/PrivateRouter";
import Navbar from "./components/navbar/Navbar";
import NotFound from "./pages/NotFoundPage/NotFound";

const App = () => {
  return (
    <AuthProvider>
      <Router>
      <PrivateRoute component={Navbar} />
      <Switch>
      <Route exact path="/login" component={Login} />
        <Route exact path="/signup" component={SignUp} />
        <PrivateRoute exact path="/" component={Home} />
        <PrivateRoute exact path="/account" component={Account} />
        <PrivateRoute exact path="/project:id" component={Project} />
        <PrivateRoute exact path="/newproject" component={NewProject} />
        <Route component={NotFound} />
      </Switch>
      </Router>
    </AuthProvider>
  );
};

export default App;
