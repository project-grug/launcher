import "./App.css";
import { lazy } from "solid-js";
import { Router, Route, Routes } from "@solidjs/router";
const Home = lazy(() => import("./pages/Main"));
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" component={Home} />
      </Routes>
    </Router>
  );
}

export default App;
