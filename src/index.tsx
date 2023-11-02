/* @refresh reload */

// Back-End setup
import { init } from "./backend";
import { SettingsManager } from "./backend/SettingsManager";

let settingsManager: SettingsManager = init();
console.log("Back-End initialized");
// Front-End setup
import { render } from "solid-js/web";

import App from "./frontend/App";
const jpxsApiUrl = "https://jpxs.io/api";
const grugApiUrl = "https://cityrp.jpxs.io/api";
const root = document.getElementById("root");
// necessary if back-end has to reload, thus also reloading the front-end
root!.innerHTML = "";
render(() => <App />, root!);
export { settingsManager, jpxsApiUrl, grugApiUrl };
