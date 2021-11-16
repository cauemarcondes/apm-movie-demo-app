//@ts-ignore
import { ApmRoute } from "@elastic/apm-rum-react";
import { BrowserRouter as Router, Link, Switch } from "react-router-dom";
import "./App.css";
import Home from "./components/Home";
import MovieList from "./components/MovieList";

function App() {
  return (
    <Router>
      <div>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/movies">Movies</Link>
          </li>
        </ul>
        <hr />
        <Switch>
          <ApmRoute exact path="/" component={Home}></ApmRoute>
          <ApmRoute path="/movies" component={MovieList}></ApmRoute>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
