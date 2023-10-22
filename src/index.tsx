/* @refresh reload */

// Back-End setup
import { init } from "./backend";
await init();
console.log("Back-End initialized");
// Front-End setup
import { render } from "solid-js/web";

import App from "./frontend/App";

const root = document.getElementById("root");

render(() => <App />, root!);
