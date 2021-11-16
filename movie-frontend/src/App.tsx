import { BrowserRouter as Router, Link, Switch, Route } from "react-router-dom";
import "./App.css";
import Home from "./components/Home";
import MovieList from "./components/MovieList";

function App() {
  return (
    <Router>
      <div>
        <ul style={{ display: "flex", listStyle: "none" }}>
          <li style={{ marginRight: 10 }}>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/movies">Movies</Link>
          </li>
        </ul>
        <hr />
        <Switch>
          <Route exact path="/" component={Home}></Route>
          <Route path="/movies" component={MovieList}></Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
