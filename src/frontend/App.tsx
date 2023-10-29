import "./App.css";
import { lazy } from "solid-js";
import { Router, Route, Routes } from "@solidjs/router";
import Sidebar from "./components/Sidebar";
const Home = lazy(() => import("./pages/Home"));
const PlayerSearch = lazy(() => import("./pages/PlayerSearch"));
const Settings = lazy(() => import("./pages/Settings"));
function App() {
  return (
    <Router>
      <Sidebar></Sidebar>
      <section class="ml-64">
        <Routes>
          <Route path="/" component={Home} />
          <Route path="/player-search" component={PlayerSearch} />
          <Route path="/settings" component={Settings} />
        </Routes>
      </section>
    </Router>
  );
}

export default App;
