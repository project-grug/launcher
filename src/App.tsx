import "./App.css";
import { lazy } from "solid-js";
import { Router, Route, Routes } from "@solidjs/router";
import Sidebar from "./components/Sidebar";
const Home = lazy(() => import("./pages/Home"));
function App() {
  return (
    <Router>
      <Sidebar></Sidebar>
      <section>
        <Routes>
          <Route path="/" component={Home} />
        </Routes>
      </section>
    </Router>
  );
}

export default App;
