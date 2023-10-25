import { ConfigurationManager } from "./ConfigurationManager";
import { invoke } from "@tauri-apps/api";
const configManager = new ConfigurationManager();
export async function init() {
  // initialize backend

  invoke("get_settings")
    .then((result) => console.log(result))
    .catch((err) => {
      console.log(err);
    });
  /*if (!result) {
    // create app.conf with default values
    configManager.save();
  } else {
    configManager.load();
  }*/
}
export { configManager };
