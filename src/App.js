import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import UserPage from "./Pages/Userpage";
import Home from "./Pages/Home";
import NotFound from "./Pages/404";

function App() {
  return (
    <Router>
      <Switch>
        {/* Handle URLs and display elements accordingly */}
        <Route path="/" exact component={Home} />
        <Route path="/user/:user" component={UserPage} />
        <Route component={NotFound} />
      </Switch>
    </Router>
  );
}

export default App;
