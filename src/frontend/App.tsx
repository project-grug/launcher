import "./App.css";
import { lazy, Suspense } from "solid-js";
import { Router, Route, Routes } from "@solidjs/router";
import Sidebar from "./components/Sidebar";
const Home = lazy(() => import("./pages/Home"));
const PlayerSearch = lazy(() => import("./pages/PlayerSearch"));
const ServerList = lazy(() => import("./pages/ServerList"));
const Settings = lazy(() => import("./pages/Settings"));
function App() {
  return (
    <Router>
      <Sidebar></Sidebar>
      <section class="ml-64">
        <Suspense
          fallback={
            <div class="text-center py-2">
              <p class="font-bold text-2xl">Loading...</p>
            </div>
          }
        >
          <Routes>
            <Route path="/" component={Home} />
            <Route path="/player-search" component={PlayerSearch} />
            <Route path="/server-list" component={ServerList} />
            <Route path="/settings" component={Settings} />
          </Routes>
        </Suspense>
      </section>
    </Router>
  );
}

export default App;
