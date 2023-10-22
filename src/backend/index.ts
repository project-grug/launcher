import { exists, BaseDirectory } from "@tauri-apps/api/fs";
import { ConfigurationManager } from "./ConfigurationManager";
const configManager = new ConfigurationManager();
export async function init() {
  // initialize backend

  // why is this hanging????
  // to-do: fix this
  const result = await exists("app.conf", { dir: BaseDirectory.Executable });
  console.log(result);
  if (!result) {
    // create app.conf with default values
    configManager.save();
  } else {
    configManager.load();
  }
}
export { configManager };
